import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Shield, CreditCard, Bell, Wrench, Package } from "lucide-react";
import { Link } from "react-router-dom";

const Perfil = () => {
  const { user } = useAuth();

  const sections = [
    {
      icon: <User className="h-8 w-8 mb-4 text-primary" />,
      title: "Dados pessoais",
      description: "Forneça seus dados pessoais e como podemos entrar em contato com você.",
      link: "/perfil/dados-pessoais" 
    },
    {
      icon: <Shield className="h-8 w-8 mb-4 text-primary" />,
      title: "Login e segurança",
      description: "Atualize sua senha e proteja sua conta.",
      link: "/perfil/seguranca"
    },
    {
      icon: <CreditCard className="h-8 w-8 mb-4 text-primary" />,
      title: "Pagamentos e recebimentos",
      description: "Revise pagamentos, recebimentos, cupons e cartões de presente.",
      link: "/perfil/pagamentos"
    },
    {
      icon: <Wrench className="h-8 w-8 mb-4 text-primary" />,
      title: "Ferramentas de locador",
      description: "Gerencie seus anúncios, reservas recebidas e ganhos.",
      link: "/painel-locador"
    },
    {
      icon: <Package className="h-8 w-8 mb-4 text-primary" />,
      title: "Minhas locações",
      description: "Veja seus itens alugados, histórico e status de devolução.",
      link: "/painel-locatario"
    },
    {
      icon: <Bell className="h-8 w-8 mb-4 text-primary" />,
      title: "Notificações",
      description: "Escolha as preferências de notificação e como você quer ser contatado.",
      link: "/perfil/notificacoes"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Conta</h1>
          <div className="text-lg">
            <span className="font-semibold">{user?.name || "Usuário"}</span>
            <span className="text-muted-foreground"> · {user?.email || "email@exemplo.com"} · </span>
            <Link to="/perfil/ver" className="underline font-semibold hover:text-primary">Ir para o perfil</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <Link to={section.link} key={index} className="block h-full">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-muted-foreground/20">
                <CardHeader>
                  {section.icon}
                  <CardTitle className="text-lg mb-1">{section.title}</CardTitle>
                  <CardDescription className="text-base">{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Perfil;
