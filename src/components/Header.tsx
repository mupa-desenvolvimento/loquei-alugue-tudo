import { Search, User, Menu, Heart, MessageCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/46d0dc9e-74fd-49cf-8e73-306a25807b36.png" 
              alt="Loquei" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Search Bar - Centered Pill */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <Link to="/buscar" className="w-full max-w-md">
              <div className="flex items-center justify-between border rounded-full py-2.5 px-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-background">
                <div className="flex divide-x text-sm">
                  <span className="px-4 font-semibold text-foreground">Qualquer item</span>
                  <span className="px-4 font-semibold text-foreground">Qualquer data</span>
                  <span className="px-4 text-muted-foreground">Localização?</span>
                </div>
                <div className="bg-primary rounded-full p-2 text-primary-foreground">
                  <Search className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden md:flex text-sm font-semibold rounded-full hover:bg-muted" asChild>
              <Link to="/anunciar">Anunciar item</Link>
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden md:flex rounded-full hover:bg-muted">
              <Globe className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 rounded-full border shadow-sm hover:shadow-md px-2 py-5 ml-1">
                  <Menu className="h-4 w-4" />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 mt-2" align="end" forceMount>
                {!user ? (
                  <>
                    <DropdownMenuItem className="font-semibold py-3" asChild>
                      <Link to="/entrar">Entrar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3" asChild>
                      <Link to="/cadastrar">Cadastrar-se</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="py-3" asChild>
                      <Link to="/anunciar">Anunciar seu item</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3" asChild>
                      <Link to="/como-funciona">Central de Ajuda</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="font-semibold py-3" asChild>
                      <Link to="/mensagens">Mensagens</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-semibold py-3" asChild>
                      <Link to="/favoritos">Favoritos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-semibold py-3" asChild>
                      <Link to="/painel-locatario">
                        Minhas locações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-semibold py-3" asChild>
                      <Link to="/painel-locador">
                        Gerenciar anúncios
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="py-3" asChild>
                      <Link to="/anunciar">Anunciar item</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3" asChild>
                      <Link to="/perfil">
                        Conta
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="py-3" asChild>
                      <Link to="/como-funciona">Central de Ajuda</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3" onClick={logout}>
                      Sair
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <Link to="/buscar">
            <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-full border shadow-sm">
              <Search className="h-5 w-5 ml-2" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">O que você procura?</span>
                <span className="text-xs text-muted-foreground">Encontre ferramentas, eletrônicos e mais</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;