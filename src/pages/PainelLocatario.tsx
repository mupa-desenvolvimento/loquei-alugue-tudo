import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Clock, 
  Package, 
  Star, 
  MessageSquare, 
  Calendar,
  MapPin,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

const PainelLocatario = () => {
  const favoriteItems = [
    {
      id: 1,
      name: "Furadeira Professional",
      category: "Ferramentas",
      price: 25,
      rating: 4.8,
      location: "São Paulo, SP",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Câmera DSLR Canon",
      category: "Eletrônicos",
      price: 80,
      rating: 4.9,
      location: "Rio de Janeiro, RJ",
      image: "/placeholder.svg"
    }
  ];

  const activeRentals = [
    {
      id: 1,
      item: "Furadeira Professional",
      owner: "Carlos Silva",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      totalValue: 125,
      status: "Em andamento",
      daysLeft: 3
    },
    {
      id: 2,
      item: "Serra Circular",
      owner: "Ana Costa",
      startDate: "2024-01-10",
      endDate: "2024-01-17",
      totalValue: 210,
      status: "Finalizada",
      daysLeft: 0
    }
  ];

  const rentalHistory = [
    {
      id: 1,
      item: "Máquina de Solda",
      owner: "João Ferreira",
      period: "05/01 - 12/01",
      value: 280,
      status: "Concluída",
      rating: 5
    },
    {
      id: 2,
      item: "Compressor de Ar",
      owner: "Maria Santos",
      period: "28/12 - 03/01",
      value: 150,
      status: "Concluída",
      rating: 4
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em andamento":
        return <Clock className="h-4 w-4" />;
      case "Finalizada":
      case "Concluída":
        return <CheckCircle className="h-4 w-4" />;
      case "Cancelada":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "Finalizada":
      case "Concluída":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "Cancelada":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meu Painel</h1>
          <p className="text-muted-foreground">Gerencie suas locações e favoritos</p>
        </div>

        <Tabs defaultValue="locacoes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="locacoes">Minhas Locações</TabsTrigger>
            <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="perfil">Meu Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="locacoes" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Locações Ativas</h2>
            </div>

            <div className="grid gap-4">
              {activeRentals.map((rental) => (
                <Card key={rental.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{rental.item}</h3>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {rental.owner}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {rental.startDate} - {rental.endDate}
                            </span>
                            {rental.daysLeft > 0 && (
                              <span className="text-blue-600 font-medium">
                                {rental.daysLeft} dias restantes
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">R$ {rental.totalValue}</p>
                        <Badge className={`mt-2 ${getStatusColor(rental.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(rental.status)}
                            {rental.status}
                          </span>
                        </Badge>
                        <div className="mt-2 space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Conversar
                          </Button>
                          {rental.status === "Finalizada" && (
                            <Button size="sm">
                              Avaliar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favoritos" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Meus Favoritos</h2>
              <p className="text-muted-foreground mb-6">
                Produtos que você salvou para alugar depois
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted rounded-t-xl flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-primary">R$ {item.price}/dia</p>
                        <Button size="sm">
                          Alugar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="historico" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Histórico de Locações</h2>
            </div>

            <div className="space-y-4">
              {rentalHistory.map((rental) => (
                <Card key={rental.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{rental.item}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {rental.owner}
                          </p>
                          <p className="text-sm text-muted-foreground">{rental.period}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R$ {rental.value}</p>
                        <Badge className={getStatusColor(rental.status)}>
                          {rental.status}
                        </Badge>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rental.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Gerencie suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-lg">JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">João Silva</h3>
                    <p className="text-muted-foreground">joao.silva@email.com</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Editar Perfil
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Estatísticas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Locações realizadas</span>
                        <span className="font-medium">15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avaliação média</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">4.8</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Membro desde</span>
                        <span className="font-medium">Jan 2024</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Configurações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Métodos de Pagamento
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Notificações
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Privacidade
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default PainelLocatario;