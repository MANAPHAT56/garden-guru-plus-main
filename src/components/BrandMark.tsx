// โลโก้ถูกเปลี่ยนเป็นรูปภาพแล้ว

export function BrandMark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "size-8 rounded-xl",
    md: "size-11 rounded-2xl",
    lg: "size-16 rounded-[1.4rem]",
  };

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${sizes[size]} ${className}`}
      aria-label="สวนอัจฉริยะ"
    >
      <img src="/images/logo.png" alt="Logo" className="h-full w-full object-cover" />
    </span>
  );
}
