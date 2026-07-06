import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this path to wherever your prisma client instance lives
import bcrypt from "bcryptjs"; // run: npm i bcryptjs && npm i --save-dev @types/bcryptjs

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // 2. Encrypt the password safely
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Insert into your live Supabase database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}