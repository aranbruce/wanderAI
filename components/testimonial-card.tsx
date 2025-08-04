import Image from "next/image";

interface TestimonialCardProps {
  testimonial: string;
  author: string;
  imgSrc: string;
}

export default function TestimonialCard({
  testimonial,
  author,
  imgSrc,
}: TestimonialCardProps) {
  return (
    <div className="shadow-light flex flex-col items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white p-6">
      <Image src={imgSrc} alt="author of testimonial" width={56} height={56} />
      <h4 className="text-lg">{testimonial}</h4>
      <p className="text-sm leading-5 text-gray-800">{author}</p>
    </div>
  );
}
