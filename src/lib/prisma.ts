import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// 1. Initialize the pg connection pool with explicit SSL rules for Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Allows serverless environments to bypass local cert chain validation
  },
});

// 2. Wrap it inside the Prisma 7 driver adapter
const adapter = new PrismaPg(pool);

// 3. Prevent multiple client instances during Next.js hot-reloads
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;