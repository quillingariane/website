#!/bin/sh
set -ex

# 1. Generate client types
npx prisma generate --schema=./prisma/schema

# 2. Start the server
echo "--- Starting Next.js ---"
npm run dev -- -p 3000