import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Home, Menu, PlusSquare, User } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getUserInitials = () => {
    if (!user || !user.fullName) return "U";
    return user.fullName.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const navLinks = [
    { name: "Buy", href: "/properties?listingType=sale" },
    { name: "Rent", href: "/properties?listingType=rent" },
    { name: "Sell", href: "/post-listing" },
    { name: "About", href: "/about" }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
                <Home className="text-primary h-6 w-6 mr-2" />
                <span className="font-bold text-secondary text-xl">AfriHome</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className={`font-medium hover:text-primary transition-colors ${location === link.href ? 'text-primary' : ''}`}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/post-listing">
                  <Button variant="default" className="hidden md:flex items-center bg-accent2 hover:bg-accent2/80">
                    <PlusSquare className="mr-2 h-4 w-4" /> Post Listing
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/post-listing" className="cursor-pointer w-full">Post Listing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="hidden md:block hover:text-primary transition-colors">
                    Login
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="default" className="hidden md:block bg-primary hover:bg-primary/80">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className={`font-medium py-2 hover:text-primary transition-colors ${location === link.href ? 'text-primary' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <hr className="border-gray-200" />
                  {user ? (
                    <>
                      <Link 
                        href="/profile"
                        className="font-medium py-2 hover:text-primary transition-colors flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                      <Link 
                        href="/post-listing"
                        className="font-medium py-2 hover:text-primary transition-colors flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <PlusSquare className="mr-2 h-4 w-4" /> Post Listing
                      </Link>
                      <Button 
                        variant="default" 
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth">
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
