import { Search, User, Menu, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/6494e490-9033-4592-aa5e-f864c755286a.png" 
              alt="Loquei" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Link to="/buscar" className="w-full">
                <Input
                  type="text"
                  placeholder="Procurar por categoria, local ou item..."
                  className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 rounded-full hover:border-gray-300 focus:border-primary transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  readOnly
                />
              </Link>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2 font-medium transition-all duration-200" asChild>
              <Link to="/anunciar">Anunciar</Link>
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2 font-medium transition-all duration-200" asChild>
              <Link to="/como-funciona">Como funciona</Link>
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2 font-medium transition-all duration-200 relative" asChild>
              <Link to="/favoritos">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
              </Link>
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2 font-medium transition-all duration-200 relative" asChild>
              <Link to="/mensagens">
                <MessageCircle className="h-4 w-4 mr-2" />
                Mensagens
              </Link>
            </Button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-700 hover:bg-gray-100 rounded-full font-medium" asChild>
              <Link to="/entrar">Entrar</Link>
            </Button>
            <Button size="sm" className="hidden sm:flex bg-gradient-to-r from-primary to-red-500 text-white rounded-full px-6 py-2 font-medium hover:shadow-lg hover:scale-105 transition-all duration-200" asChild>
              <Link to="/cadastrar">Cadastrar</Link>
            </Button>
            
            {/* User Avatar */}
            <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
              <User className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="p-2 md:hidden rounded-full hover:bg-gray-100 transition-all duration-200">
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Link to="/buscar" className="w-full">
              <Input
                type="text"
                placeholder="Buscar itens para alugar..."
                className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 rounded-full hover:border-gray-300 focus:border-primary transition-all duration-200 cursor-pointer shadow-sm"
                readOnly
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;