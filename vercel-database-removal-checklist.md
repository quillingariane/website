# Vercel Production Database Unlink & Removal Checklist

This checklist guides you through removing and unlinking the deprecated database from your **production Vercel deployment** for the `website` project.

---

## 📋 Context & Project Details

| Parameter                         | Value                                  |
| --------------------------------- | -------------------------------------- |
| **Project**                       | `website`                              |
| **Integration**                   | Supabase (Vercel Integration)          |
| **Organization / Integration ID** | `vercel_icfg_nRO2ytp1oUzdaVmr7yYLiwQ5` |
| **Supabase Project Name**         | `supabase-database`                    |
| **Supabase Project Ref**          | `lhhtjyyjyjtjgopjanzf`                 |
| **Pooler Region**                 | AWS EU West (`eu-west-3` / Paris)      |

> [!IMPORTANT]
> If your Supabase instance is shared across other local projects (such as `crux` or `jdr-app`), **do NOT delete the Supabase project** itself. Only **unlink / disconnect** it from the `website` project in Vercel.

---

## 🔲 Step 1: Codebase Verification (Pre-Flight Checks)

Ensure the following codebase adjustments are in place before redeploying:

- [x] **Build Script Cleaned (`package.json`)**:
    - `"build": "prisma generate --schema=./prisma/schema && next build"`
    - Verified that `prisma db push` has been removed from the build script so builds do not require live database access.
- [x] **Vercel Cron Removed (`vercel.json`)**:
    - Removed or emptied the scheduled cron job (`/api/cron`) that was originally waking up the database every Saturday.
- [x] **Database Cron Route Deprecated (`src/app/api/cron/route.ts`)**:
    - Removed `prisma.$queryRaw` SELECT 1 query so requests to `/api/cron` do not fail if triggered.
- [x] **Server Components Safe-Guarded (`src/app/pages/portfolio/tracker/page.tsx`)**:
    - Wrapped data fetching in try/catch fallback so static prerendering at build time succeeds without a database connection.
- [x] **Local Build Verified**:
    - Tested `npm run build` locally without any running database container — completed with exit code 0.

---

## 🔲 Step 2: Unlink Integration in Vercel Dashboard

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Select the **`website`** project.
3. Navigate to **Settings** > **Integrations** (or **Storage**).
4. Find the **Supabase** integration (or connected PostgreSQL database store).
5. Click the **Manage** / **•••** menu next to the integration.
6. Click **Disconnect** or **Remove from Project**.
7. Confirm the disconnection.

---

## 🔲 Step 3: Remove Database Environment Variables from Vercel

When an integration is unlinked, some environment variables may persist. Clean them up manually:

1. In your Vercel project, go to **Settings** > **Environment Variables**.
2. Filter by the **Production** environment (repeat for **Preview** / **Development** if applicable).
3. Delete or remove the following database-related variables:
    - [ ] `DATABASE_URL`
    - [ ] `DIRECT_URL`
    - [ ] `POSTGRES_URL`
    - [ ] `POSTGRES_PRISMA_URL`
    - [ ] `POSTGRES_URL_NON_POOLING`
    - [ ] `STORAGE_POSTGRES_URL_NON_POOLING`
    - [ ] `POSTGRES_USER`
    - [ ] `POSTGRES_PASSWORD`
    - [ ] `POSTGRES_HOST`
    - [ ] `POSTGRES_DATABASE`
    - [ ] `NEXT_PUBLIC_SUPABASE_URL`
    - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - [ ] `SUPABASE_SERVICE_ROLE_KEY`
    - [ ] `CRON_SECRET` _(optional: can be removed if `/api/cron` is no longer used)_
4. Click **Save**.

---

## 🔲 Step 4: Verify Vercel Build Settings

1. In your Vercel project, go to **Settings** > **General**.
2. Scroll down to **Build & Development Settings**.
3. Verify that:
    - **Framework Preset**: `Next.js`
    - **Build Command**: default (`npm run build` or `next build`)
    - Ensure there are no custom override commands attempting `prisma db push` or `npx prisma migrate deploy`.

---

## 🔲 Step 5: Deploy & Production Verification

1. **Push Changes to Git**:
    ```bash
    git add .
    git commit -m "chore: remove deprecated database references and clean vercel build"
    git push origin main
    ```
2. **Trigger Clean Redeployment on Vercel**:
    - Go to the **Deployments** tab in Vercel.
    - Select the newly triggered deployment (or click **•••** on the latest deployment > **Redeploy**).
    - Ensure **"Use existing Build Cache"** is **UNCHECKED** to prevent any cached Prisma engines or database artifacts from persisting.
3. **Check Build Logs**:
    - [ ] Build completes with status **READY**.
    - [ ] No `P1001: Can't reach database server` errors.
    - [ ] Static routes prerendered successfully (17/17 pages).
4. **Smoke Test Production URL**:
    - [ ] Homepage (`/`) loads with HTTP 200.
    - [ ] Portfolio page (`/pages/portfolio`) loads with HTTP 200.
    - [ ] Bench pages (`/bench`, `/bench/genshin`, `/bench/hsr`, `/bench/zzz`) load with HTTP 200.
    - [ ] Demo pages (`/pages/demo`) load with HTTP 200.
    - [ ] Verify Vercel Function logs under the **Logs** tab show 0 database connection timeout errors.

---

## 🛠️ Troubleshooting

| Issue                                              | Cause                                                      | Fix                                                                                        |
| -------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Build fails with `P1001`                           | Old build cache or `prisma db push` in build script        | Ensure `package.json` `"build"` script has no `db push`, and redeploy without build cache. |
| Page `/pages/portfolio/tracker` error during build | Server component attempted DB call during static prerender | Verify the try/catch fallback in `src/app/pages/portfolio/tracker/page.tsx` is deployed.   |
| Unwanted Cron executions                           | Vercel Cron still registered                               | Ensure `vercel.json` has `"crons": []` or the cron configuration is removed.               |
