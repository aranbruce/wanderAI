import Image from "next/image";

interface TextAndImageProps {
  title: string;
  description: string;
  imgSrc: string;
  imgAlt: string;
  classNames?: string;
}

const TextAndImage = ({
  title,
  description,
  imgSrc,
  imgAlt,
  classNames,
}: TextAndImageProps) => {
  return (
    <div
      className={`flex flex-col items-center gap-8 md:flex-row ${classNames}`}
    >
      <div className="relative h-80 w-full overflow-hidden rounded-lg bg-[url('/assets/map.png')] bg-cover bg-no-repeat">
        <Image src={imgSrc} alt={imgAlt} fill={true} />
      </div>
      <div className="flex w-full flex-col gap-3">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-gray-800">{description}</p>
      </div>
    </div>
  );
};

export default TextAndImage;
