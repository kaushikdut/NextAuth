import { db } from "@/libs/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // YOU MAY WANT TO ADD SOME VALIDATION HERE
    if (!email || !password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 401 }
      );
    }

    const newUser = await db.user.create({
      data: {
        email,
        password,
      },
    });

    return NextResponse.json({ newUser }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 500 });
  }
}
