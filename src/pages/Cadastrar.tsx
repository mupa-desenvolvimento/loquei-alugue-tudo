import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressSteps, Step } from "@/components/ui/progress-steps";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Building, Phone, ArrowRight, ArrowLeft } from "lucide-react";

const registerSteps: Step[] = [
  { id: "welcome", title: "Boas-vindas", description: "Início" },
  { id: "profile", title: "Perfil", description: "Locador ou Locatário" },
  { id: "type", title: "Tipo", description: "PF ou PJ" },
  { id: "basic", title: "Dados", description: "Informações" },
  { id: "security", title: "Segurança", description: "Senha" },
  { id: "terms", title: "Termos", description: "Aceitar" }
];

const Cadastrar = () => {
  const [currentStep, setCurrentStep] = useState("welcome");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userProfile, setUserProfile] = useState(""); // locatario ou locador
  const [userType, setUserType] = useState("pf");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    cnpj: "",
    companyName: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = (stepId: string) => {
    setCompletedSteps(prev => [...prev, currentStep]);
    setCurrentStep(stepId);
  };

  const handlePreviousStep = (stepId: string) => {
    setCurrentStep(stepId);
    setCompletedSteps(prev => prev.filter(id => id !== stepId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Senhas não coincidem!");
      return;
    }
    if (!acceptTerms) {
      alert("Aceite os termos de uso para continuar!");
      return;
    }
    // TODO: Implementar lógica de cadastro
    console.log("Register attempt:", { ...formData, userType, userProfile });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <img 
                src="/lovable-uploads/46d0dc9e-74fd-49cf-8e73-306a25807b36.png" 
                alt="Loquei" 
                className="h-12 w-auto"
              />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-foreground mb-2">Criar conta na Loquei</h2>
          <p className="text-muted-foreground">
            Junte-se à maior plataforma de locação do Brasil
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps
          steps={registerSteps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        <Card className="border-0 shadow-elevated rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {currentStep === "welcome" && (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">Bem-vindo à Loquei!</CardTitle>
                  <CardDescription>
                    Vamos criar sua conta em alguns passos simples
                  </CardDescription>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={() => handleNextStep("profile")} 
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-accent shadow-modern"
                  >
                    Começar cadastro
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Separator className="my-6" />

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-2">
                      Cadastrar com Google
                    </Button>
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-2">
                      Cadastrar com Facebook
                    </Button>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link to="/entrar" className="text-primary hover:underline font-medium">
                      Faça login aqui
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {currentStep === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviousStep("welcome")}
                    className="p-2 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-xl">Qual é o seu objetivo?</CardTitle>
                    <CardDescription>
                      Escolha como deseja usar a plataforma
                    </CardDescription>
                  </div>
                </div>

                <RadioGroup value={userProfile} onValueChange={setUserProfile} className="space-y-4">
                  <div className="flex items-center space-x-3 p-6 border-2 rounded-2xl hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="locatario" id="locatario" />
                    <Label htmlFor="locatario" className="flex-1 cursor-pointer">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">Sou Locatário</p>
                          <p className="text-sm text-muted-foreground">
                            Quero alugar produtos e equipamentos de outras pessoas
                          </p>
                          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                            <li>• Encontrar produtos para alugar</li>
                            <li>• Salvar favoritos</li>
                            <li>• Conversar com locadores</li>
                          </ul>
                        </div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-6 border-2 rounded-2xl hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="locador" id="locador" />
                    <Label htmlFor="locador" className="flex-1 cursor-pointer">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Building className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">Sou Locador</p>
                          <p className="text-sm text-muted-foreground">
                            Quero disponibilizar meus produtos para locação e ganhar dinheiro
                          </p>
                          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                            <li>• Anunciar produtos</li>
                            <li>• Gerenciar locações</li>
                            <li>• Promover anúncios</li>
                          </ul>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <Button 
                  onClick={() => handleNextStep("type")} 
                  disabled={!userProfile}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent disabled:opacity-50"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {currentStep === "type" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviousStep("profile")}
                    className="p-2 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-xl">Tipo de conta</CardTitle>
                    <CardDescription>
                      {userProfile === "locador" 
                        ? "Como locador, informe se é pessoa física ou jurídica" 
                        : "Escolha o tipo de conta que deseja criar"
                      }
                    </CardDescription>
                  </div>
                </div>

                <RadioGroup value={userType} onValueChange={setUserType} className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-2xl hover:border-primary transition-colors">
                    <RadioGroupItem value="pf" id="pf" />
                    <Label htmlFor="pf" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">Pessoa Física</p>
                        <p className="text-sm text-muted-foreground">
                          {userProfile === "locador" ? "Para locadores individuais" : "Para uso pessoal"}
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-2xl hover:border-primary transition-colors">
                    <RadioGroupItem value="pj" id="pj" />
                    <Label htmlFor="pj" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">Pessoa Jurídica</p>
                        <p className="text-sm text-muted-foreground">
                          {userProfile === "locador" ? "Para empresas de locação" : "Para empresas"}
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <Button 
                  onClick={() => handleNextStep("basic")} 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {currentStep === "basic" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviousStep("type")}
                    className="p-2 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-xl">Informações básicas</CardTitle>
                    <CardDescription>
                      Preencha seus dados pessoais
                    </CardDescription>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      {userType === "pf" ? "Nome completo" : "Nome do responsável"}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={userType === "pf" ? "Seu nome completo" : "Nome do responsável"}
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Telefone/WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* PJ Specific Fields */}
                  {userType === "pj" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-sm font-medium">Nome da empresa</Label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            id="companyName"
                            type="text"
                            placeholder="Nome da sua empresa"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                            className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cnpj" className="text-sm font-medium">CNPJ</Label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            id="cnpj"
                            type="text"
                            placeholder="00.000.000/0000-00"
                            value={formData.cnpj}
                            onChange={(e) => handleInputChange("cnpj", e.target.value)}
                            className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Button 
                  onClick={() => handleNextStep("security")} 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {currentStep === "security" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviousStep("basic")}
                    className="p-2 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-xl">Segurança da conta</CardTitle>
                    <CardDescription>
                      Crie uma senha segura para sua conta
                    </CardDescription>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-12 pr-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Digite novamente"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-12 pr-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleNextStep("terms")} 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {currentStep === "terms" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviousStep("security")}
                    className="p-2 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-xl">Termos e condições</CardTitle>
                    <CardDescription>
                      Aceite os termos para finalizar seu cadastro
                    </CardDescription>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-3 p-4 border-2 rounded-2xl">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      Aceito os{" "}
                      <Link to="/termos" className="text-primary hover:underline">
                        termos de uso
                      </Link>{" "}
                      e{" "}
                      <Link to="/privacidade" className="text-primary hover:underline">
                        política de privacidade
                      </Link>{" "}
                      da Loquei. Estou ciente de que meus dados serão utilizados conforme descrito na política de privacidade.
                    </Label>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={!acceptTerms}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent disabled:opacity-50"
                  >
                    Criar minha conta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cadastrar;