import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, MapPin, Camera, DollarSign } from "lucide-react";

const Anunciar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Anuncie seu item
            </h1>
            <p className="text-xl text-muted-foreground">
              Ganhe dinheiro alugando o que você não usa
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-brand-blue" />
                    <span>Informações do Item</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título do anúncio</label>
                    <Input placeholder="Ex: Furadeira de impacto Bosch profissional" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <Textarea 
                      placeholder="Descreva seu item, estado de conservação, acessórios inclusos..."
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Selecione a categoria</option>
                        <option>Ferramentas e Equipamentos</option>
                        <option>Eletrônicos</option>
                        <option>Esportes e Lazer</option>
                        <option>Eventos e Festas</option>
                        <option>Automóveis</option>
                        <option>Casa e Jardim</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Estado</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Novo</option>
                        <option>Seminovo</option>
                        <option>Usado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                      <Camera className="h-4 w-4" />
                      <span>Fotos do item (mínimo 3)</span>
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Clique para fazer upload ou arraste suas fotos aqui
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Localização</span>
                    </label>
                    <Input placeholder="Digite seu CEP ou endereço" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-brand-green" />
                    <span>Preços</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço por dia</label>
                    <Input placeholder="R$ 0,00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço por semana</label>
                    <Input placeholder="R$ 0,00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço por mês</label>
                    <Input placeholder="R$ 0,00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Caução (opcional)</label>
                    <Input placeholder="R$ 0,00" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="terms" className="rounded" />
                      <label htmlFor="terms" className="text-sm">
                        Aceito os termos de uso
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="insurance" className="rounded" />
                      <label htmlFor="insurance" className="text-sm">
                        Quero proteção contra danos
                      </label>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6 bg-gradient-to-r from-brand-blue to-brand-green text-white">
                    Publicar Anúncio
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Anunciar;