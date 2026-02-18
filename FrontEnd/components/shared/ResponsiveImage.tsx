"use client";

import Image from "next/image";

interface ResponsiveImageProps {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

export default function ResponsiveImage({
  desktopSrc,
  mobileSrc,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
}: ResponsiveImageProps) {
  const mobile = mobileSrc || desktopSrc;
  const shared = {
    className,
    sizes,
    priority,
  };

  if (fill) {
    return (
      <>
        <Image
          src={mobile}
          alt={alt}
          {...shared}
          fill
          className={`${className || ""} block md:hidden`}
        />
        <Image
          src={desktopSrc}
          alt={alt}
          {...shared}
          fill
          className={`${className || ""} hidden md:block`}
        />
      </>
    );
  }

  if (!width || !height) {
    return null;
  }

  return (
    <>
      <Image
        src={mobile}
        alt={alt}
        {...shared}
        width={width}
        height={height}
        className={`${className || ""} block md:hidden`}
      />
      <Image
        src={desktopSrc}
        alt={alt}
        {...shared}
        width={width}
        height={height}
        className={`${className || ""} hidden md:block`}
      />
    </>
  );
}
