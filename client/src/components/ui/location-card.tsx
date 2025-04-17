import { cn } from "@/lib/utils";

interface LocationCardProps {
  image: string;
  name: string;
  propertyCount: number;
  className?: string;
}

export function LocationCard({ image, name, propertyCount, className }: LocationCardProps) {
  return (
    <div className={cn("relative rounded-lg overflow-hidden group shadow-md", className)}>
      <img 
        src={image} 
        alt={name} 
        className="w-full h-60 object-cover transition-transform duration-500 transform group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-white font-bold text-xl">{name}</h3>
        <p className="text-white opacity-90">{propertyCount} Properties</p>
      </div>
    </div>
  );
}
