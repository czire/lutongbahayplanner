import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export default function Logo({ size = 100, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/images/logo-bg.png"
        alt="Lutong Bahay Planner"
        width={size}
        height={size}
        className="object-cover rounded-full shadow-lg"
        priority
      />
    </div>
  );
}
