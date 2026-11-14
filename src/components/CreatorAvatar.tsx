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
 * Resilient CreatorAvatar component for MotionRadar.
 * 1. Primary: https://unavatar.io/x/${handle}
 * 2. Secondary fallback on error: https://unavatar.io/twitter/${handle}
 * 3. Final fallback: styled 2-letter initials circle
 * Uses loading="lazy" and referrerPolicy="no-referrer" to prevent rate-limits and CORS/hotlink blocks.
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

  // Try X avatar endpoints before falling back to initials
  if (resolvedHandle && sourceStep < 2) {
    const src =
      sourceStep === 0
        ? `https://unavatar.io/x/${resolvedHandle}`
        : `https://unavatar.io/twitter/${resolvedHandle}`;

    return (
      <img
        src={src}
        alt={altText}
        loading="lazy"
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
