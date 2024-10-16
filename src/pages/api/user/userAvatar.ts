import type { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import fs from "fs";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = new multiparty.Form();
    const [, files] = await new Promise<
      [
        fields: Record<string, string[] | undefined>,
        files: { [key: string]: multiparty.File[] }
      ]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files as { [key: string]: multiparty.File[] }]);
      });
    });

    const file = files.image[0];
    const imageBuffer = fs.readFileSync(file.path);
    const base64Image = imageBuffer.toString("base64");

    // Upload to ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append("key", IMGBB_API_KEY as string);
    imgbbFormData.append("image", base64Image);
    imgbbFormData.append("name", file.originalFilename || "avatar");

    const imgbbResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbFormData,
    });

    if (!imgbbResponse.ok) {
      throw new Error("Failed to upload image to ImgBB");
    }

    const imgbbData = await imgbbResponse.json();

    if (imgbbData.status !== 200) {
      throw new Error(
        imgbbData.error?.message || "Failed to upload image to ImgBB"
      );
    }

    const avatarUrl = imgbbData.data.url;

    // Update user's avatar in your backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/v1/user/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie || "",
      },
      body: JSON.stringify({ avatar: avatarUrl }),
    });

    if (!backendResponse.ok) {
      throw new Error("Failed to update avatar in backend");
    }

    const updatedUser = await backendResponse.json();

    res.status(200).json({ avatarUrl, user: updatedUser });
  } catch (error) {
    console.error("Error in avatar upload:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
}
