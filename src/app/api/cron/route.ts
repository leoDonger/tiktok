import { NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/video";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const pexelsResponse = await axios.get(
      "https://api.pexels.com/videos/search",
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY || "",
        },
        params: {
          query: "vertical",
          orientation: "portrait",
          per_page: 5,
        },
      }
    );

    const videos = pexelsResponse.data?.videos || [];
    console.log(`Fetched ${videos.length} videos from Pexels.`);

    let uploadedCount = 0;

    for (const vid of videos) {
      const videoFile = vid.video_files?.find(
        (f: any) => f.link && f.height && f.width && f.height > f.width
      );
      if (!videoFile) {
        console.log(`Skipping video ${vid.id}, no strictly vertical file found.`);
        continue;
      }

      const aspectRatio = videoFile.height / videoFile.width;
      if (aspectRatio < 1.2) {
        console.log(`Skipping, aspect ratio too low: ${aspectRatio}`);
        continue;
      }

      const fileUrl = videoFile.link;
      const fileName = `pexels_${vid.id}.mp4`;

      console.log(`Downloading: ${fileUrl} -> S3 key: ${fileName}`);

      const { data: fileBuffer } = await axios.get(fileUrl, {
        responseType: "arraybuffer",
      });

      await uploadToS3(fileName, fileBuffer);


      const s3Key = `pexels_${vid.id}.mp4`;
      await prisma.video.create({
        data: {
          s3Key,
          url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`,
          userId: "someUserId",
        },
      });
      uploadedCount++;
    }

    return NextResponse.json({
      success: true,
      count: uploadedCount,
      message: `Fetched ${videos.length} from Pexels, uploaded ${uploadedCount} to S3 & DB.`,
    });
  } catch (error: any) {
    console.error("Error in weekly Pexels job:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
