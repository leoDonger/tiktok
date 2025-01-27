import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/video";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const caption = formData.get("caption")?.toString() || "";

  try {
    const uploadResult = await uploadToS3(file.name, Buffer.from(await file.arrayBuffer()))

    const video = await prisma.video.create({
      data: {
        caption,
        url: uploadResult,
        s3Key: uploadResult,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
