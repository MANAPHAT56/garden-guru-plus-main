// โลโก้ถูกเปลี่ยนเป็นรูปภาพแล้ว

export function BrandMark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-9 w-auto rounded-xl",
    md: "h-12 w-auto rounded-2xl",
    lg: "h-16 w-auto rounded-[1.4rem]",
  };

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${sizes[size]} ${className}`}
      aria-label="สวนอัจฉริยะ"
    >
      <img src="/images/logo.png" alt="Logo" className="h-full w-auto object-contain drop-shadow-sm" />
    </span>
  );
}
