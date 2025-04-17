import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Search, Home, Key } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="font-bold text-2xl md:text-3xl text-secondary text-center mb-3">
          How It Works
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Simple steps to find your dream property or list your own
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center px-4">
            <div className="bg-primary bg-opacity-10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Search className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Search Properties</h3>
            <p className="text-gray-600">
              Browse thousands of properties across African countries using our advanced search filters.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="text-center px-4">
            <div className="bg-primary bg-opacity-10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Home className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Find Your Match</h3>
            <p className="text-gray-600">
              Discover properties that match your requirements and schedule viewings with agents.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="text-center px-4">
            <div className="bg-primary bg-opacity-10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Key className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Close the Deal</h3>
            <p className="text-gray-600">
              Finalize your purchase or rental with confidence using our trusted process.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/properties">
              <Button className="bg-primary hover:bg-primary/80 text-white">
                Start Searching
              </Button>
            </Link>
            <Link href="/post-listing">
              <Button variant="secondary">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
