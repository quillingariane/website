# Global Supabase Architecture on Arch Linux

This document outlines the architecture and setup for running a **single, centralized Supabase instance** on an Arch Linux host, while allowing isolated, Dockerized sub-projects (Next.js + Prisma) to connect to it securely.

## 1. Core Architecture Concept

Instead of spinning up heavy database containers for every individual project, this setup uses the **Supabase CLI** to host one master database on the Arch Linux host machine.

Individual web projects run in their own lightweight Docker containers and bridge out to the host machine to share the database and authentication system. Data is kept separated using PostgreSQL **schemas** (e.g., `public`, `crux`). *(Note: Direct database connectivity for the `website` project is deprecated and decoupled).*

---

## 2. Setting Up the Global Database

Create a dedicated folder for the centralized database. This folder will not contain any front-end code.

```bash
mkdir ~/Projects/global-db
cd ~/Projects/global-db
supabase init
```

To start the database manually:

```bash
supabase start

```

_(Note: The `startall.sh` script handles this automatically)._

---

## 3. The Arch Linux Docker Bridge (`docker-compose.yml`)

Because the web apps are isolated inside Docker, they cannot see the Supabase instance running on `localhost` of the Arch machine. You **must** define `extra_hosts` in every sub-project's `docker-compose.yml` to map `host.docker.internal` to the Arch Linux host.

```yaml
services:
    web:
        build:
            context: .
            dockerfile: Dockerfile.dev
        ports:
            - "3000:3000"

        # CRITICAL: Bridges the container to the Arch host
        extra_hosts:
            - "host.docker.internal:host-gateway"

        volumes:
            - .:/app
            - /app/node_modules
            - /app/.next
        environment:
            - DATABASE_URL=${DATABASE_URL}
            - DIRECT_URL=${DIRECT_URL}
            - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
            - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
```

_Note: Do NOT include a `db` service in the `docker-compose.yml`._

---

## 4. Environment Variables (`.env`)

In your sub-projects, point the connection URLs to `host.docker.internal` using the default Supabase CLI ports (`54322` for the database, `54321` for the API).

```env
# Database Connections
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:54322/postgres
DIRECT_URL=postgresql://postgres:postgres@host.docker.internal:54322/postgres

# Supabase API
NEXT_PUBLIC_SUPABASE_URL=[http://host.docker.internal:54321](http://host.docker.internal:54321)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_anon_key_from_the_cli

```

---

## 5. Prisma Configuration & Raw SQL

If you are using schemas other than `public` (e.g., `crux`), Prisma will push your tables to that specific schema.

If you ever execute raw SQL commands via a startup script (like `files/start.sh`) or manual `psql`, you **must specify the schema** prefix, otherwise PostgreSQL defaults to `public` and will throw a "relation does not exist" error.

**Example of enabling RLS in a custom schema:**

```bash
# BAD: Looks in the public schema
psql $DATABASE_URL -c 'ALTER TABLE "Card" ENABLE ROW LEVEL SECURITY;'

# GOOD: Explicitly targets the crux schema
psql $DATABASE_URL -c 'ALTER TABLE "crux"."Card" ENABLE ROW LEVEL SECURITY;'

```

---

## 6. Automation & Management Scripts

Place these scripts in your root `~/Projects` folder to automate your workflow.

### Script 1: `startall.sh`

Boots the global database first, then automatically loops through your sub-projects and starts their Docker containers (or falls back to `npm run dev`).

```bash
#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "--- Starting Projects ---"
# Boot the global DB
cd "$SCRIPT_DIR"/global-db
supabase start

# Find all subdirectories in the first depth
find "$SCRIPT_DIR" -maxdepth 1 -mindepth 1 -type d | while read -r project_dir; do
    project_name=$(basename "$project_dir")
    echo "Processing project: $project_name in $project_dir"

    if [ "$project_name" = "global-db" ]; then
        echo "  Skipping Docker Compose and npm run dev for the 'global-db' directory."
    else
        # Check for docker-compose files
        if [ -f "$project_dir/docker-compose.yml" ] || [ -f "$project_dir/docker-compose.yaml" ]; then
            echo "  Docker Compose file found. Starting Docker containers..."
            (cd "$project_dir" && docker compose up -d --remove-orphans)
            if [ $? -ne 0 ]; then
                echo "  Warning: Failed to start Docker Compose services in '$project_dir'."
            else
                echo "  Successfully started Docker Compose services in: $project_dir"
            fi
        else
            echo "  No Docker Compose file found. Attempting to run 'npm run dev'..."
            if [ -f "$project_dir/package.json" ]; then
                (cd "$project_dir" && npm run dev &)
                if [ $? -ne 0 ]; then
                    echo "  Warning: 'npm run dev' failed in '$project_dir'."
                else
                    echo "  Successfully ran 'npm run dev' in: $project_dir"
                fi
            else
                echo "  No package.json found in '$project_dir'. Skipping 'npm run dev'."
            fi
        fi
    fi
    echo ""
done

echo "--- All project operations completed ---"

```

### Script 2: `db-manager.sh`

An interactive UI menu to push Prisma schemas, generate types, and manage the Supabase connection for specific projects.

```bash
#!/usr/bin/env bash

# CONFIGURATION - Update these paths to match your Arch filesystem layout
CRUX_DIR="./jdr-app"
QTQWILL_DIR="./website"

# Colors for clean UI rendering
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear_screen() {
    clear
    echo -e "${CYAN}=============================================${NC}"
    echo -e "${CYAN}       Supabase & Prisma Workspace Manager    ${NC}"
    echo -e "${CYAN}=============================================${NC}"
}

manage_project() {
    local proj_name=$1
    local proj_dir=$2

    if [ ! -d "$proj_dir" ]; then
        echo -e "\n${RED}Error: Directory not found at $proj_dir${NC}"
        echo -e "Please edit the script variables with your correct paths."
        read -n 1 -s -r -p "Press any key to return..."
        return
    fi

    while true; do
        clear_screen
        echo -e "Project: ${GREEN}$proj_name${NC}"
        echo -e "Path:    ${CYAN}$proj_dir${NC}"
        echo "---------------------------------------------"
        echo -e "1) ${YELLOW}[Prisma]${NC} Push schema to local DB (migrate dev)"
        echo -e "2) ${YELLOW}[Prisma]${NC} Regenerate client types"
        echo -e "3) ${GREEN}[Supabase]${NC} Capture local schema changes (db diff)"
        echo -e "4) ${GREEN}[Supabase]${NC} Push schema migrations to PROD cloud"
        echo -e "5) ${CYAN}[Status]${NC} Check local container status"
        echo -e "6) ${RED}[Stop]${NC} Stop local database cluster"
        echo "---------------------------------------------"
        echo "b) <-- Go back to Main Menu"
        echo "============================================="
        echo -n "Choose an action: "
        read -r choice

        cd "$proj_dir" || return

        case $choice in
            1)
                echo -e "\n${YELLOW}Running Prisma migration locally...${NC}"
                echo -n "Enter a name for this migration: "
                read -r mig_name
                if [ -z "$mig_name" ]; then mig_name="manual_update"; fi
                npx prisma migrate dev --name "$mig_name"
                ;;
            2)
                echo -e "\n${YELLOW}Regenerating Prisma client types...${NC}"
                npx prisma generate
                ;;
            3)
                echo -e "\n${GREEN}Comparing local DB state with migration tracking files...${NC}"
                echo -n "Enter a name for this migration file: "
                read -r diff_name
                if [ -z "$diff_name" ]; then diff_name="schema_update"; fi
                supabase db diff -f "$diff_name"
                ;;
            4)
                echo -e "\n${RED}⚠️  WARNING: You are about to push migrations to the live Vercel-linked Production DB!${NC}"
                echo -n "Are you sure? (y/N): "
                read -r confirm
                if [[ "$confirm" =~ ^[Yy]$ ]]; then
                    supabase db push
                else
                    echo "Canceled."
                fi
                ;;
            5)
                echo -e "\n${CYAN}Current Local Instance Info:${NC}"
                supabase status
                ;;
            6)
                echo -e "\n${RED}Spinning down local database containers...${NC}"
                supabase stop
                ;;
            [Bb])
                return
                ;;
            *)
                echo -e "\n${RED}Invalid option.${NC}"
                ;;
        esac

        echo ""
        read -n 1 -s -r -p "Action completed. Press any key to continue..."
    done
}

while true; do
    clear_screen
    echo "Select a project workspace to manage:"
    echo "---------------------------------------------"
    echo -e "1) CRUX ${CYAN}(App port: 3001 | DB ports: 5433X)${NC}"
    echo -e "2) QTQWILL ${CYAN}(App port: 3000 | DB ports: 5432X)${NC}"
    echo "---------------------------------------------"
    echo -e "q) Exit Script"
    echo "============================================="
    echo -n "Enter selection: "
    read -r main_choice

    case $main_choice in
        1)
            manage_project "CRUX" "$CRUX_DIR"
            ;;
        2)
            manage_project "QTQWILL" "$QTQWILL_DIR"
            ;;
        [Qq])
            clear
            echo -e "${GREEN}Workspace manager closed safely.${NC}"
            exit 0
            ;;
        *)
            echo -e "\n${RED}Invalid option.${NC}"
            sleep 1
            ;;
    esac
done

```
