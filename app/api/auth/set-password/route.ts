import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth"; // uses NextAuth instance
import { prisma } from "@/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { password } = await req.json().catch(() => ({}));
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.hashedPassword) {
      return NextResponse.json(
        { message: "Password already set" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    return NextResponse.json({ message: "Password set" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
