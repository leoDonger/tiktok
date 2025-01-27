// POST body: { videoId: string }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {


  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body  = await request.json();

    if (!body) {
        return NextResponse.json({ error: "Missing videoId or userId" }, { status: 400 });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        videoId: body.videoId,
        // userId: session.user.id,
        userId: "demo-user-123",
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
        //   userId: session.user.id,
          userId: "demo-user-123",
          videoId: body.videoId,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
