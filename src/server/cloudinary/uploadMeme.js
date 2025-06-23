"use server"

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMeme = async(base64, id) => {
  return cloudinary.uploader.upload(`data:image/png;base64,${base64}`, {
    folder: "memes",
    public_id: `meme-${id}`,
  });
};

export default uploadMeme