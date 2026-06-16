type BrandLogoProps = {
  variant?: "wordmark" | "wordmark-footer" | "full";
  className?: string;
  priority?: boolean;
};

const LOGO = {
  wordmark: {
    src: "/logo-wordmark.svg",
    width: 1086,
    height: 388,
  },
  "wordmark-footer": {
    src: "/logo-wordmark-footer.svg",
    width: 1086,
    height: 388,
  },
  full: {
    src: "/logo-full.svg",
    width: 1119,
    height: 949,
  },
} as const;

export function BrandLogo({
  variant = "wordmark",
  className,
  priority = false,
}: BrandLogoProps) {
  const { src, width, height } = LOGO[variant];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      aria-hidden="true"
      className={className}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      height={height}
      src={src}
      width={width}
    />
  );
}
