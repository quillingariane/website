# Website

A Next.js web application and developer portfolio.

## Prerequisites

- Node.js (or Docker with Compose plugin)

## Getting Started

1. Copy the environment template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Start the development stack:
   ```bash
   docker compose up
   ```
   Or run locally:
   ```bash
   npm run dev
   ```

The Next.js app will be available at http://localhost:3000.

## Port Usage

| Service | URL |
|---|---|
| Next.js app | http://localhost:3000 |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

For checks on unlinking the deprecated database from production Vercel, see [vercel-database-removal-checklist.md](vercel-database-removal-checklist.md).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.