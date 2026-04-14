import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@my-better-t-app/auth";
import { headers } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  videoUploader: f({
    video: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Testimonial uploads are public, but we can restrict if needed.
      // For now, allow public uploads for the collection wizard.
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for file:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
