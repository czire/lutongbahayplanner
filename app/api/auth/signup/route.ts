import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { email, name, password } = body as {
      email?: string;
      name?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    email = email.toLowerCase().trim();
    name = (name ?? "").trim();

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      // If user already has a password, block (true duplicate)
      if (existing.hashedPassword) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
      // OAuth-only account: allow setting password
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          hashedPassword,
          // Only set name if not previously set
          name: existing.name ? existing.name : name || existing.name,
        },
      });
      return NextResponse.json(
        { message: "Password set for existing social account" },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name: name || null,
        hashedPassword,
      },
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
