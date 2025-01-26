import { NextRequest, NextResponse } from "next/server";
import { S3 } from "aws-sdk";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const caption = formData.get("caption")?.toString() || "";

  // Upload to S3 (example)
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `videos/${Date.now()}-${file.name}`,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  };

  try {
    const uploadResult = await s3.upload(uploadParams).promise();

    // Store in DB
    const video = await prisma.video.create({
      data: {
        caption,
        url: uploadResult.Location,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
