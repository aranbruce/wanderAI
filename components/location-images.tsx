interface LocationImagesProps {
  isLoaded: boolean;
  photoUrls: string[];
  openModal: (photoUri: string) => void;
}

export default function LocationImages({
  isLoaded,
  photoUrls,
  openModal,
}: LocationImagesProps) {
  return (
    <div className="flex w-full snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-scroll px-4 md:grid md:snap-y md:grid-cols-2 md:overflow-y-scroll md:px-8">
      {!isLoaded
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 w-full min-w-[128px] animate-pulse snap-start overflow-hidden rounded-xl bg-gray-300 object-cover"
            />
          ))
        : photoUrls?.map((photoUri) => (
            <div
              className="bg-gray-30 relative h-32 w-full min-w-32 snap-start overflow-hidden rounded-xl"
              key={photoUri}
            >
              <img
                key={photoUri}
                src={photoUri}
                alt="Location image"
                className="h-full w-full min-w-[120px] cursor-pointer rounded-xl bg-gray-300 object-cover"
                onClick={() => openModal(photoUri)}
              />
            </div>
          ))}
    </div>
  );
}
