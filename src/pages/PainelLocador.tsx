import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Package, 
  Star, 
  Eye, 
  MessageSquare, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Users,
  Crown,
  Zap
} from "lucide-react";

const PainelLocador = () => {
  const [selectedPromotion, setSelectedPromotion] = useState<string>("");

  const mockItems = [
    {
      id: 1,
      name: "Furadeira Professional",
      category: "Ferramentas",
      price: 25,
      views: 342,
      likes: 18,
      messages: 5,
      status: "Ativo",
      promoted: false
    },
    {
      id: 2,
      name: "Câmera DSLR Canon",
      category: "Eletrônicos",
      price: 80,
      views: 567,
      likes: 45,
      messages: 12,
      status: "Ativo",
      promoted: true
    }
  ];

  const promotionPlans = [
    {
      id: "destaque",
      name: "Destaque Principal",
      price: 29.90,
      duration: "7 dias",
      benefits: ["Banner principal", "Primeiro nos resultados", "Badge especial"],
      icon: <Crown className="h-6 w-6" />
    },
    {
      id: "premium",
      name: "Premium",
      price: 19.90,
      duration: "7 dias",
      benefits: ["Destaque nas categorias", "3x mais visibilidade"],
      icon: <Zap className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Painel do Locador</h1>
          <p className="text-muted-foreground">Gerencie seus anúncios e promova seus produtos</p>
        </div>

        <Tabs defaultValue="produtos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="produtos">Meus Produtos</TabsTrigger>
            <TabsTrigger value="promocoes">Promoções</TabsTrigger>
            <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="produtos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Meus Produtos</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </div>

            <div className="grid gap-4">
              {mockItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-muted-foreground">{item.category}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {item.views}
                            </span>
                            <span className="text-sm flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {item.likes}
                            </span>
                            <span className="text-sm flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {item.messages}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">R$ {item.price}/dia</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={item.status === "Ativo" ? "default" : "secondary"}>
                            {item.status}
                          </Badge>
                          {item.promoted && (
                            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                              <Crown className="h-3 w-3 mr-1" />
                              Promovido
                            </Badge>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="promocoes" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Promover Produtos</h2>
              <p className="text-muted-foreground mb-6">
                Aumente a visibilidade dos seus produtos e apareça em destaque no marketplace
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {promotionPlans.map((plan) => (
                <Card key={plan.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {plan.icon}
                      </div>
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.duration}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-primary">
                        R$ {plan.price}
                      </div>
                      <ul className="space-y-2">
                        {plan.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" onClick={() => setSelectedPromotion(plan.id)}>
                            Promover Agora
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Promover Produto</DialogTitle>
                            <DialogDescription>
                              Selecione o produto que deseja promover com o plano {plan.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="product-select">Produto</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockItems.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-xl">
                              <h4 className="font-semibold mb-2">Resumo do Plano</h4>
                              <div className="text-sm space-y-1">
                                <p>Plano: {plan.name}</p>
                                <p>Duração: {plan.duration}</p>
                                <p className="font-semibold">Total: R$ {plan.price}</p>
                              </div>
                            </div>
                            <Button className="w-full">
                              Confirmar Promoção
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mensagens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens Recentes</CardTitle>
                <CardDescription>Conversas com locatários interessados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">João Silva</h4>
                      <p className="text-sm text-muted-foreground">Interesse em: Câmera DSLR Canon</p>
                      <p className="text-xs text-muted-foreground">Há 2 horas</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Responder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 1.245,00</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Locações Ativas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +3 novas esta semana
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23.5%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default PainelLocador;