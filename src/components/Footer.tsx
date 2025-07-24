import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-3xl font-bold text-background">Loquei</span>
            </div>
            <p className="text-background/80 leading-relaxed">
              A maior plataforma de locação P2P do Brasil. Conectamos quem tem com quem precisa 
              de forma segura e eficiente.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-background">Para Locatários</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Como alugar</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Todas as categorias</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Meus favoritos</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Minhas locações</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Central de ajuda</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-background">Para Locadores</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Anunciar item</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Como funciona</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Dicas para locadores</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Meus anúncios</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Painel financeiro</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-background">Fique por dentro</h3>
            <p className="text-background/80">
              Receba as melhores ofertas e novidades da Loquei direto no seu e-mail.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="bg-background/10 border-background/30 text-background placeholder:text-background/60"
              />
              <Button className="w-full bg-gradient-to-r from-brand-blue to-brand-green text-white border-0">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-brand-blue" />
              <span className="text-background/80">contato@loquei.com.br</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-brand-blue" />
              <span className="text-background/80">(11) 4000-0000</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-brand-blue" />
              <span className="text-background/80">São Paulo, Brasil</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-background/60 text-sm">
              © 2024 Loquei. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Cookies
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;