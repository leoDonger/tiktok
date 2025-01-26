// POST body: { videoId: string }
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await request.json();
  try {
    // Check if already liked
    const existingLike = await prisma.like.findFirst({
      where: {
        videoId,
        userId: session.user.id,
      },
    });

    if (existingLike) {
      // Unlike (delete)
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      // Like (create)
      await prisma.like.create({
        data: {
          userId: session.user.id,
          videoId,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
