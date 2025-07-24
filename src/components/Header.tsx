import { Search, User, Menu, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/src/assets/loquei-logo.png" 
              alt="Loquei" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Link to="/buscar" className="w-full">
                <Input
                  type="text"
                  placeholder="Buscar por categoria, local ou item..."
                  className="pl-10 pr-4 py-2 w-full border-2 border-border focus:border-primary transition-colors cursor-pointer"
                  readOnly
                />
              </Link>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
              <Link to="/anunciar">Anunciar</Link>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
              <Link to="/como-funciona">Como funciona</Link>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary relative" asChild>
              <Link to="/favoritos">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
              </Link>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary relative" asChild>
              <Link to="/mensagens">
                <MessageCircle className="h-4 w-4 mr-2" />
                Mensagens
              </Link>
            </Button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
              <Link to="/entrar">Entrar</Link>
            </Button>
            <Button size="sm" className="hidden sm:flex bg-gradient-to-r from-primary to-secondary text-white border-0 hover:opacity-90" asChild>
              <Link to="/cadastrar">Cadastrar</Link>
            </Button>
            
            {/* User Avatar */}
            <Button variant="ghost" size="sm" className="p-2">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="p-2 md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Link to="/buscar" className="w-full">
              <Input
                type="text"
                placeholder="Buscar itens para alugar..."
                className="pl-10 pr-4 py-2 w-full border-2 border-border focus:border-primary transition-colors cursor-pointer"
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