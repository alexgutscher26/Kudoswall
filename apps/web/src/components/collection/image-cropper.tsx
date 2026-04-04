"use client";

import { Check, X } from "lucide-react";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

interface ImageCropperProps {
  image: string;
  onCancel: () => void;
  onCropComplete: (croppedImage: string) => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCropper({
  image,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback(
    (_croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mx-auto flex h-[500px] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-2xl">
      <div className="relative flex-1 bg-neutral-900">
        <Cropper
          aspect={1}
          crop={crop}
          image={image}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
          zoom={zoom}
        />
      </div>

      <div className="space-y-6 bg-white p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-[11px] text-neutral-400 uppercase tracking-widest">
              Zoom
            </span>
            <span className="font-bold text-[11px] text-pink-500">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <input
            aria-labelledby="Zoom"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-100 accent-pink-500"
            max={3}
            min={1}
            onChange={(e) => setZoom(Number(e.target.value))}
            step={0.1}
            type="range"
            value={zoom}
          />
        </div>

        <div className="flex gap-3">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-neutral-100 py-3 font-bold text-[14px] text-neutral-500 transition-all hover:bg-neutral-50"
            onClick={onCancel}
            type="button"
          >
            <X className="size-4" />
            Cancel
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-pink-500 py-3 font-bold text-[14px] text-white shadow-lg shadow-pink-500/20 transition-all hover:bg-pink-600"
            onClick={createCroppedImage}
            type="button"
          >
            <Check className="size-4" />
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CropArea | null
): Promise<string> {
  if (!pixelCrop) {
    throw new Error("No pixelCrop provided");
  }
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Canvas is empty");
      }
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
    }, "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
