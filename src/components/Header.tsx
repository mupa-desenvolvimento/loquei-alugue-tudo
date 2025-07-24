import { Search, User, Menu, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
              Loquei
            </span>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por categoria, local ou item..."
                className="pl-10 pr-4 py-2 w-full border-2 border-border focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Anunciar
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Como funciona
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary relative">
              <Heart className="h-4 w-4 mr-2" />
              Favoritos
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary relative">
              <MessageCircle className="h-4 w-4 mr-2" />
              Mensagens
            </Button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Entrar
            </Button>
            <Button size="sm" className="hidden sm:flex bg-gradient-to-r from-brand-blue to-brand-purple text-white border-0 hover:from-brand-blue-dark hover:to-brand-purple">
              Cadastrar
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
            <Input
              type="text"
              placeholder="Buscar itens para alugar..."
              className="pl-10 pr-4 py-2 w-full border-2 border-border focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;