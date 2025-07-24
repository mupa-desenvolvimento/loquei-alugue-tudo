import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, CreditCard, Star, Shield, Users } from "lucide-react";

const ComoFunciona = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-20">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Como Funciona a Loquei
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra como é simples alugar ou disponibilizar itens na maior plataforma 
            de locação P2P do Brasil
          </p>
        </section>

        {/* Para Locatários */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="bg-brand-blue/10 text-brand-blue mb-4">
              Para quem quer alugar
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Como alugar um item
            </h2>
            <p className="text-muted-foreground">
              Em 4 passos simples, você tem o que precisa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-brand-blue" />
                </div>
                <h3 className="font-semibold mb-2">1. Busque</h3>
                <p className="text-sm text-muted-foreground">
                  Encontre o item que precisa usando nossos filtros de localização, preço e categoria
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-brand-blue" />
                </div>
                <h3 className="font-semibold mb-2">2. Converse</h3>
                <p className="text-sm text-muted-foreground">
                  Entre em contato com o locador, tire suas dúvidas e combine os detalhes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-brand-blue" />
                </div>
                <h3 className="font-semibold mb-2">3. Reserve e Pague</h3>
                <p className="text-sm text-muted-foreground">
                  Faça sua reserva e pague com segurança através da plataforma
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-brand-blue" />
                </div>
                <h3 className="font-semibold mb-2">4. Avalie</h3>
                <p className="text-sm text-muted-foreground">
                  Após a devolução, avalie sua experiência e ajude outros usuários
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Para Locadores */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="bg-brand-green/10 text-brand-green mb-4">
                Para quem quer alugar seus itens
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Como ganhar dinheiro alugando
              </h2>
              <p className="text-muted-foreground">
                Transforme seus itens parados em renda extra
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-brand-green">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Cadastre seu item</h3>
                  <p className="text-sm text-muted-foreground">
                    Adicione fotos, descrição, preço e disponibilidade do seu item
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-brand-green">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Receba solicitações</h3>
                  <p className="text-sm text-muted-foreground">
                    Interessados entrarão em contato e você decide aceitar ou não
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-brand-green">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Receba seu pagamento</h3>
                  <p className="text-sm text-muted-foreground">
                    O dinheiro cai na sua conta após a confirmação da devolução
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Segurança */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Sua segurança em primeiro lugar
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Na Loquei, oferecemos múltiplas camadas de proteção para locadores e locatários
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Pagamento Seguro</h3>
              <p className="text-sm text-muted-foreground">
                Todos os pagamentos são processados com criptografia de ponta
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Perfis Verificados</h3>
              <p className="text-sm text-muted-foreground">
                Sistema de verificação de identidade e avaliações da comunidade
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Suporte 24/7</h3>
              <p className="text-sm text-muted-foreground">
                Nossa equipe está sempre disponível para resolver qualquer problema
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ComoFunciona;