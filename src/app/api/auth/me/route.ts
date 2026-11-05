import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    try {
      await connectToDatabase();
      const dbUser = await User.findById(session.userId)
        .select("name email role avatar bio")
        .lean();

      if (dbUser) {
        return NextResponse.json({
          authenticated: true,
          user: {
            ...session,
            name: dbUser.name || session.name,
            avatar: dbUser.avatar || "",
            bio: dbUser.bio || "",
          },
        });
      }
    } catch {
      // Fallback to session
    }

    return NextResponse.json({
      authenticated: true,
      user: session,
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    );
  }
}

