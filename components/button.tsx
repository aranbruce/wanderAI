import Link from "next/link";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  size?: "small" | "medium";
  children?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

const Button = ({
  type = "button",
  variant = "primary",
  size = "medium",
  children,
  onClick,
  href,
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold cursor-pointer shadow-sm outline-none flex-shrink-0 text-nowrap focus-visible:ring-[3px] focus-visible:ring-green-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white focus-visible:outline-none";
  const primaryClasses =
    "bg-green-400 text-white hover:bg-green-300 active:bg-green-500";
  const secondaryClasses =
    "bg-white border border-gray-200 hover:bg-gray-100 active:bg-gray-200 text-black";
  const smallClasses = "text-sm px-4 py-3";
  const mediumClasses = "text-md px-6 py-3";

  const buttonClasses = `${baseClasses}, ${variant === "secondary" ? secondaryClasses : primaryClasses}, ${size === "small" ? smallClasses : mediumClasses}`;

  return href ? (
    <Link href={href} onClick={onClick} className={buttonClasses}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} type={type} className={buttonClasses}>
      {children}
    </button>
  );
};

export default Button;
