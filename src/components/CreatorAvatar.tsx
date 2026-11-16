"use client";

import React, { useState, useMemo } from "react";
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

const GRADIENT_PALETTES = [
  "from-emerald-500/20 to-teal-900/40 text-emerald-300 border-emerald-500/30",
  "from-cyan-500/20 to-blue-900/40 text-cyan-300 border-cyan-500/30",
  "from-purple-500/20 to-indigo-900/40 text-purple-300 border-purple-500/30",
  "from-amber-500/20 to-orange-900/40 text-amber-300 border-amber-500/30",
  "from-rose-500/20 to-pink-900/40 text-rose-300 border-rose-500/30",
  "from-violet-500/20 to-fuchsia-900/40 text-violet-300 border-violet-500/30",
  "from-sky-500/20 to-indigo-900/40 text-sky-300 border-sky-500/30",
];

function getNameHash(str: string): number {
  if (!str || typeof str !== "string") return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Resilient CreatorAvatar component for MotionRadar:
 * - Deterministic, high-contrast gradient initials styling (zero broken UI states)
 * - Safe photo loading with instant graceful fallback on network / CDN failures
 * - Zero state mutations during render body for 100% React 19 safety
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
  const resolvedName = String(creator?.name || name || "");
  const resolvedHandle =
    handle ||
    creator?.handle ||
    getCreatorHandle(creator || { name, xUrl }) ||
    (typeof propInitials === "string" ? getCreatorHandle(propInitials) : undefined);

  const displayInitials = getInitials(resolvedName, propInitials);
  const altText = alt || resolvedName || (resolvedHandle ? `@${resolvedHandle}` : "Creator avatar");

  const [failedHandle, setFailedHandle] = useState<string | null>(null);
  const isImageFailed = Boolean(resolvedHandle && failedHandle === resolvedHandle);

  const palette = useMemo(() => {
    const idx = getNameHash(resolvedName || "Motion") % GRADIENT_PALETTES.length;
    return GRADIENT_PALETTES[idx];
  }, [resolvedName]);

  const hasCustomSize = Boolean(className && (className.includes("w-") || className.includes("h-")));
  const baseSize = hasCustomSize ? "" : "w-7 h-7";

  const fallbackClasses = `rounded-full bg-gradient-to-br ${palette} border flex items-center justify-center font-bold font-mono tracking-tight select-none shrink-0 ${baseSize} ${className || ""}`.trim();
  const imgClasses = `rounded-full object-cover border border-white/10 shrink-0 bg-[#18181C] ${baseSize} ${className || ""}`.trim();

  // If handle is present and hasn't errored, attempt unavatar
  if (resolvedHandle && !isImageFailed) {
    const photoUrl = `https://unavatar.io/x/${resolvedHandle}`;

    return (
      <div className="relative shrink-0">
        <img
          src={photoUrl}
          alt={altText}
          width={28}
          height={28}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => {
            if (resolvedHandle) setFailedHandle(resolvedHandle);
          }}
          className={imgClasses}
        />
      </div>
    );
  }

  // Resilient, pristine fallback avatar
  return (
    <div
      className={fallbackClasses}
      title={resolvedName ? `${resolvedName}${resolvedHandle ? ` (@${resolvedHandle})` : ""}` : undefined}
      aria-label={altText}
    >
      <span>{displayInitials}</span>
    </div>
  );
}

export default CreatorAvatar;
