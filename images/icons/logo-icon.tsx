interface LogoIconProps {
  height: string;
  width: string;
  pulse?: boolean;
}

export default function LogoIcon({ height, width, pulse }: LogoIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${pulse && "animate-pulse"}`}
    >
        <rect
          x="12"
          y="8"
          width="96"
          height="96"
          rx="48"
          fill="#35977D"
          shapeRendering="crispEdges"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M67.6886 29.1452C67.6886 24.7565 62.3562 22.5881 59.2934 25.7313L30.4996 55.2813C27.4794 58.3807 29.6755 63.5868 34.003 63.5868H52.3119V83.0503C52.3119 87.4389 57.6443 89.6073 60.7071 86.4641L89.501 56.9142C92.5211 53.8147 90.325 48.6086 85.9975 48.6086H67.6886V29.1452ZM67.6886 48.6086H52.3119V63.5868H59.4386C63.9949 63.5868 67.6886 59.8932 67.6886 55.3368V48.6086Z"
          fill="white"
        />
    </svg>
  );
}
