import { SearchBar } from "@/components/ui/searchbar";

export function HeroSection() {
  return (
    <div className="relative py-12 md:py-24 px-4 overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1489370321024-e0410ad08da4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-secondary bg-opacity-80"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6">
          Find Your Perfect Home in Africa
        </h1>
        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
          Explore thousands of properties across African countries, from urban apartments to rural estates
        </p>
        
        <SearchBar className="max-w-4xl mx-auto" />
      </div>
    </div>
  );
}
