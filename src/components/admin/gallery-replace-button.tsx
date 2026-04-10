"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type GalleryReplaceButtonProps = {
  productId: number;
  currentMediaId: number;
};

export function GalleryReplaceButton({
  productId,
  currentMediaId,
}: GalleryReplaceButtonProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPending(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.set("file", file);

      const uploadResponse = await fetch("/api/uploads/image", {
        method: "POST",
        body: uploadFormData,
      });
      const uploadResult = (await uploadResponse.json()) as {
        id?: number;
      };

      if (!uploadResponse.ok || !uploadResult.id) {
        return;
      }

      await fetch("/api/admin/products/replace-asset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          targetType: "gallery",
          currentMediaId,
          newMediaId: uploadResult.id,
        }),
      });

      router.refresh();
    } finally {
      setPending(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        ref={inputRef}
        type="file"
      />
      <button
        className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-700 disabled:opacity-60"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {pending ? "鏇挎崲涓?.." : "鏇挎崲鍥剧墖"}
      </button>
    </div>
  );
}
