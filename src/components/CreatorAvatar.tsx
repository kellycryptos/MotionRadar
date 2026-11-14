"use client";

import React, { useState } from "react";
import { getCreatorHandle, getInitials } from "@/lib/creator-handles";

export interface CreatorAvatarProps {
  name?: string;
  handle?: string;
  xUrl?: string;
  creator?: {
    name?: string;
    handle?: string;
    xUrl?: string;
  };
  initials?: string;
  className?: string;
  alt?: string;
}

/**
 * Resilient CreatorAvatar component for MotionRadar:
 * 1. Primary: https://unavatar.io/twitter/${handle} (with automatic fallback parameter)
 * 2. Secondary: https://unavatar.io/x/${handle}
 * 3. Tertiary: https://api.dicebear.com/7.x/initials/svg (Zero rate-limit vector SVG)
 * 4. Final: High-contrast styled initials container
 */
export function CreatorAvatar({
  name,
  handle,
  xUrl,
  creator,
  initials: propInitials,
  className,
  alt,
}: CreatorAvatarProps) {
  const resolvedName = creator?.name || name || "";
  const resolvedHandle =
    handle ||
    creator?.handle ||
    getCreatorHandle(creator || { name, xUrl }) ||
    (propInitials ? getCreatorHandle(propInitials) : undefined);

  const displayInitials = getInitials(resolvedName, propInitials);
  const altText = alt || resolvedName || (resolvedHandle ? `@${resolvedHandle}` : "Creator avatar");

  const [sourceStep, setSourceStep] = useState<number>(0);
  const [currentHandle, setCurrentHandle] = useState<string | undefined>(resolvedHandle);

  // Sync state if handle changes
  if (currentHandle !== resolvedHandle) {
    setCurrentHandle(resolvedHandle);
    setSourceStep(0);
  }

  const handleError = () => {
    setSourceStep((prev) => prev + 1);
  };

  const hasCustomSize = Boolean(className && (className.includes("w-") || className.includes("h-")));
  const baseSize = hasCustomSize ? "" : "w-7 h-7";

  const imgClasses = `rounded-full object-cover border border-white/10 shrink-0 bg-[#18181C] ${baseSize} ${className || ""}`.trim();
  const fallbackClasses = `rounded-full bg-[#18181C] border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-200 shrink-0 font-mono ${baseSize} ${className || ""}`.trim();

  const diceBearUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    resolvedName || "Motion"
  )}&radius=50&backgroundColor=18181b,27272a,0f172a,134e4a,312e81,3f3f46&textColor=f4f4f5,e4e4e7,34d399,a78bfa&fontSize=42&fontWeight=600`;

  // Determine current image src based on fallback steps
  let src: string | null = null;
  if (resolvedHandle && sourceStep === 0) {
    src = `https://unavatar.io/twitter/${resolvedHandle}?fallback=${encodeURIComponent(diceBearUrl)}`;
  } else if (resolvedHandle && sourceStep === 1) {
    src = `https://unavatar.io/x/${resolvedHandle}`;
  } else if (sourceStep <= 2) {
    src = diceBearUrl;
  }

  if (src) {
    return (
      <img
        src={src}
        alt={altText}
        width={28}
        height={28}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={handleError}
        className={imgClasses}
      />
    );
  }

  return (
    <div
      className={fallbackClasses}
      title={resolvedName ? `${resolvedName}${resolvedHandle ? ` (@${resolvedHandle})` : ""}` : undefined}
    >
      {displayInitials}
    </div>
  );
}

export default CreatorAvatar;
