import { defineConfig } from 'prisma/config';
import 'dotenv/config'; // Automatically loads environment variables globally

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Uses the unpooled direct connection required by Prisma 7 CLI on Netlify
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});