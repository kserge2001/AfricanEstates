import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CTASection() {
  return (
    <section className="py-16 px-4 bg-secondary relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-15 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E67E22' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="container mx-auto text-center relative z-10">
        <h2 className="font-bold text-2xl md:text-3xl text-white mb-4">
          Ready to Find Your Dream Home in Africa?
        </h2>
        <p className="text-white opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who found their perfect property through AfriHome
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/properties">
            <Button className="bg-primary hover:bg-primary/80 text-white">
              Start Browsing
            </Button>
          </Link>
          <Link href="/post-listing">
            <Button variant="outline" className="bg-white text-secondary hover:bg-gray-100">
              List Your Property
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
