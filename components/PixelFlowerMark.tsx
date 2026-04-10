import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
  priority?: boolean;
  "aria-hidden"?: boolean;
};

export function PixelFlowerMark({
  size = 60,
  className = "",
  priority = false,
  ...rest
}: Props) {
  return (
    <Image
      src="/images/pixel-flower.svg"
      alt=""
      width={size}
      height={Math.round((size * 84) / 60)}
      className={className}
      priority={priority}
      {...rest}
    />
  );
}
