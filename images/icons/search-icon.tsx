interface SearchIconProps {
  height?: string;
  width?: string;
}

export default function SearchIcon({
  height = "24",
  width = "24",
}: SearchIconProps) {
  return (
    // <svg
    //   width={width}
    //   height={height}
    //   viewBox="0 0 24 24"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M14.3849 15.4457C11.7346 17.5684 7.8552 17.4013 5.39842 14.9445C2.76238 12.3085 2.76238 8.03464 5.39842 5.3986C8.03445 2.76256 12.3083 2.76256 14.9444 5.3986C17.4011 7.85538 17.5682 11.7348 15.4456 14.3851L20.6012 19.5407C20.8941 19.8336 20.8941 20.3085 20.6012 20.6014C20.3083 20.8943 19.8334 20.8943 19.5405 20.6014L14.3849 15.4457ZM6.45908 13.8839C4.40882 11.8336 4.40882 8.50951 6.45908 6.45926C8.50933 4.40901 11.8334 4.40901 13.8837 6.45926C15.9324 8.50801 15.9339 11.8287 13.8882 13.8794C13.8867 13.8809 13.8852 13.8823 13.8837 13.8839C13.8822 13.8854 13.8807 13.8869 13.8792 13.8884C11.8286 15.9341 8.50783 15.9326 6.45908 13.8839Z"
    //     fill="currentColor"
    //   />
    // </svg>
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M21 21L16.6569 16.6569M16.6569 16.6569C18.1046 15.2091 19 13.2091 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C13.2091 19 15.2091 18.1046 16.6569 16.6569Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
