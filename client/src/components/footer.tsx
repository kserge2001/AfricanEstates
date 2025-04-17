import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin, Home, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Home className="text-primary h-6 w-6 mr-2" />
              <span className="font-bold text-xl">AfriHome</span>
            </div>
            <p className="text-gray-300 mb-4">Africa's premier real estate marketplace connecting buyers, sellers, and renters across the continent.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?listingType=sale" className="text-gray-300 hover:text-primary transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link href="/properties?listingType=rent" className="text-gray-300 hover:text-primary transition-colors">
                  Properties for Rent
                </Link>
              </li>
              <li>
                <Link href="/post-listing" className="text-gray-300 hover:text-primary transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Locations */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Locations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?country=Nigeria&city=Lagos" className="text-gray-300 hover:text-primary transition-colors">
                  Lagos, Nigeria
                </Link>
              </li>
              <li>
                <Link href="/properties?country=Kenya&city=Nairobi" className="text-gray-300 hover:text-primary transition-colors">
                  Nairobi, Kenya
                </Link>
              </li>
              <li>
                <Link href="/properties?country=South Africa&city=Cape Town" className="text-gray-300 hover:text-primary transition-colors">
                  Cape Town, South Africa
                </Link>
              </li>
              <li>
                <Link href="/properties?country=Ghana&city=Accra" className="text-gray-300 hover:text-primary transition-colors">
                  Accra, Ghana
                </Link>
              </li>
              <li>
                <Link href="/properties?country=Egypt&city=Cairo" className="text-gray-300 hover:text-primary transition-colors">
                  Cairo, Egypt
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-primary" />
                <span>123 Business Avenue, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <span>+234 123 4567 890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary" />
                <span>info@afrihome.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <form className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="rounded-r-none text-gray-800"
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/80 rounded-l-none"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 AfriHome. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
