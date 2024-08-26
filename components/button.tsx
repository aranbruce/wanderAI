import Link from "next/link";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium";
  href?: string;
  iconOnly?: boolean;
}

export default function Button({
  type = "button",
  variant = "primary",
  size = "medium",
  children,
  onClick,
  href,
  iconOnly,
  ...props
}: ButtonProps) {
  const baseClasses =
    "transition inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide cursor-pointer outline-none flex-shrink-0 text-nowrap focus-visible:ring-[3px] focus-visible:ring-green-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white focus-visible:outline-none";
  const primaryClasses =
    "bg-green-400 text-white hover:bg-green-300 active:bg-green-500 shadow-medium ";
  const secondaryClasses =
    "bg-white text-black border border-gray-200 hover:bg-gray-100 active:bg-gray-200 shadow-medium ";
  const tertiaryClasses =
    "bg-transparent text-black hover:bg-gray-100 active:bg-gray-200";
  const smallClasses = `text-sm ${iconOnly ? "px-3" : "px-4"} py-3`;
  const mediumClasses = `text-md ${iconOnly ? "px-3" : "px-5"} py-3`;

  const buttonClasses = `${baseClasses}, ${variant === "tertiary" ? tertiaryClasses : variant === "secondary" ? secondaryClasses : primaryClasses}, ${size === "small" ? smallClasses : mediumClasses}`;

  return href ? (
    <Link href={href} className={buttonClasses}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} type={type} className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
