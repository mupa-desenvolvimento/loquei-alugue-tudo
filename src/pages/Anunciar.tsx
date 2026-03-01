import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { storageService } from "@/services/storage";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  X, 
  Loader2, 
  Camera, 
  MapPin, 
  DollarSign, 
  Tag, 
  Info,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Anunciar = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    location: "",
    images: [] as string[]
  });

  const categories = [
    { id: "ferramentas", name: "Ferramentas", icon: "🔧" },
    { id: "eletronicos", name: "Eletrônicos", icon: "📷" },
    { id: "esportes", name: "Esportes", icon: "⚽" },
    { id: "festas", name: "Festas", icon: "🎉" },
    { id: "camping", name: "Camping", icon: "⛺" },
    { id: "outros", name: "Outros", icon: "📦" },
  ];

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Arquivo ${file.name} é muito grande (max 5MB)`);
          continue;
        }
        
        const url = await storageService.uploadImage(file, "items");
        newUrls.push(url);
      }
      
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
      toast.success(`${newUrls.length} imagem(ns) carregada(s)!`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao fazer upload das imagens");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (step === 1 && !formData.category) {
      toast.error("Selecione uma categoria");
      return;
    }
    if (step === 2 && (!formData.title || !formData.description)) {
      toast.error("Preencha título e descrição");
      return;
    }
    if (step === 3 && formData.images.length === 0) {
      toast.error("Adicione pelo menos uma foto");
      return;
    }
    if (step === 4 && !formData.location) {
      toast.error("Informe a localização");
      return;
    }
    if (step === 5) {
      // Final submit
      if (!formData.price) {
        toast.error("Defina um preço");
        return;
      }
      toast.success("Anúncio criado com sucesso!");
      navigate("/painel-locador");
      return;
    }

    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold">O que você vai anunciar?</h2>
            <p className="text-muted-foreground text-lg">Escolha a categoria que melhor descreve seu item.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {categories.map((cat) => (
                <Card 
                  key={cat.id}
                  className={`cursor-pointer transition-all hover:border-primary ${formData.category === cat.id ? 'border-2 border-primary bg-primary/5' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 h-32">
                    <span className="text-4xl mb-2">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold">Descreva seu item</h2>
            <p className="text-muted-foreground text-lg">Dê um título atraente e conte os detalhes.</p>
            
            <div className="space-y-4 mt-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">Título do anúncio</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: Furadeira de Impacto Bosch Professional" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg py-6"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">Descrição completa</Label>
                <Textarea 
                  id="description" 
                  placeholder="Conte sobre o estado de conservação, acessórios inclusos, voltagem, etc..." 
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="text-lg resize-none"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold">Adicione fotos</h2>
            <p className="text-muted-foreground text-lg">Fotos de qualidade aumentam suas chances de alugar.</p>

            <div className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border bg-muted">
                    <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-md">
                        Capa
                      </div>
                    )}
                  </div>
                ))}
                
                <label className="border-2 border-dashed border-muted-foreground/25 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground font-medium">Adicionar fotos</span>
                    </>
                  )}
                </label>
              </div>
              <p className="text-sm text-muted-foreground">Você pode adicionar até 10 fotos. A primeira será a capa.</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold">Onde está seu item?</h2>
            <p className="text-muted-foreground text-lg">Sua localização aproximada será mostrada aos interessados.</p>

            <div className="space-y-4 mt-8">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base">Endereço ou Cidade</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="location" 
                    placeholder="Ex: Centro, São Paulo - SP" 
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="pl-10 text-lg py-6"
                  />
                </div>
              </div>
              {/* Map placeholder */}
              <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center border">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Mapa será exibido aqui</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold">Defina o valor</h2>
            <p className="text-muted-foreground text-lg">Quanto você quer cobrar por dia de aluguel?</p>

            <div className="mt-12 max-w-sm mx-auto">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-bold text-muted-foreground">R$</span>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="pl-20 text-5xl font-bold py-12 h-auto text-center"
                />
              </div>
              <p className="text-center text-muted-foreground mt-4">por dia</p>
            </div>

            <div className="mt-12 bg-muted/30 p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Resumo do anúncio</h3>
              <div className="flex gap-4">
                <div className="h-24 w-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {formData.images[0] ? (
                    <img src={formData.images[0]} className="h-full w-full object-cover" alt="Capa" />
                  ) : (
                    <ImageIcon className="h-full w-full p-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-lg line-clamp-1">{formData.title || "Sem título"}</h4>
                  <p className="text-muted-foreground">{formData.location || "Sem localização"}</p>
                  <p className="font-bold mt-1">R$ {formData.price || "0"} <span className="text-sm font-normal text-muted-foreground">/ dia</span></p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="h-20 px-4 md:px-8 flex items-center justify-between border-b bg-background sticky top-0 z-10">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/46d0dc9e-74fd-49cf-8e73-306a25807b36.png" 
            alt="Loquei" 
            className="h-8 w-auto"
          />
        </Link>
        <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          Sair sem salvar
        </Button>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side - Input */}
        <div className="w-full lg:w-1/2 overflow-y-auto">
           <div className="max-w-xl mx-auto px-6 py-12 min-h-full flex flex-col justify-center">
             {renderStepContent()}
           </div>
        </div>

        {/* Right Side - Visual/Preview (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/5 to-primary/10 items-center justify-center p-12 border-l relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 pattern-grid-lg text-primary" />
           
           <div className="relative z-10 max-w-md text-center">
             {step === 1 && <Tag className="h-32 w-32 mx-auto text-primary/20 mb-6" />}
             {step === 2 && <Info className="h-32 w-32 mx-auto text-primary/20 mb-6" />}
             {step === 3 && <Camera className="h-32 w-32 mx-auto text-primary/20 mb-6" />}
             {step === 4 && <MapPin className="h-32 w-32 mx-auto text-primary/20 mb-6" />}
             {step === 5 && <DollarSign className="h-32 w-32 mx-auto text-primary/20 mb-6" />}
             
             <h3 className="text-2xl font-bold mb-4 text-foreground/80">
               {step === 1 && "Categorize para ser encontrado"}
               {step === 2 && "Detalhes importam"}
               {step === 3 && "Uma imagem vale mais que mil palavras"}
               {step === 4 && "A localização ajuda na logística"}
               {step === 5 && "Defina um preço justo"}
             </h3>
             <p className="text-muted-foreground">
               {step === 1 && "Escolher a categoria correta ajuda locatários a encontrarem seu item mais rápido."}
               {step === 2 && "Seja específico sobre marca, modelo e condição do item."}
               {step === 3 && "Mostre detalhes e ângulos diferentes do seu produto."}
               {step === 4 && "Não se preocupe, o endereço exato só é compartilhado após a reserva."}
               {step === 5 && "Você pode alterar o preço a qualquer momento."}
             </p>
           </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="h-20 px-4 md:px-8 border-t flex items-center justify-between bg-background z-10">
         <Button 
           variant="ghost" 
           onClick={prevStep} 
           disabled={step === 1}
           className="text-base font-medium"
         >
           Voltar
         </Button>
         
         <div className="hidden md:flex gap-2">
           {Array.from({ length: totalSteps }).map((_, i) => (
             <div 
               key={i} 
               className={`h-2 w-2 rounded-full transition-colors ${i + 1 === step ? 'bg-primary' : i + 1 < step ? 'bg-primary/50' : 'bg-muted'}`} 
             />
           ))}
         </div>

         <Button 
           onClick={nextStep} 
           size="lg"
           className="px-8 font-semibold text-lg"
         >
           {step === totalSteps ? "Publicar Anúncio" : "Próximo"}
         </Button>
      </footer>
    </div>
  );
};

export default Anunciar;
