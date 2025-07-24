import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Building, Phone } from "lucide-react";
// Logo será implementado quando disponível

const Cadastrar = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    console.log("Register attempt:", { ...formData, userType });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Loquei
              </span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-foreground">Criar conta na Loquei</h2>
          <p className="text-muted-foreground mt-2">
            Junte-se à maior plataforma de locação do Brasil
          </p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Cadastro</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label>Tipo de cadastro</Label>
                <RadioGroup value={userType} onValueChange={setUserType} className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pf" id="pf" />
                    <Label htmlFor="pf">Pessoa Física</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pj" id="pj" />
                    <Label htmlFor="pj">Pessoa Jurídica</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {userType === "pf" ? "Nome completo" : "Nome do responsável"}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={userType === "pf" ? "Seu nome completo" : "Nome do responsável"}
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* PJ Specific Fields */}
              {userType === "pj" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da empresa</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Nome da sua empresa"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="cnpj"
                        type="text"
                        placeholder="00.000.000/0000-00"
                        value={formData.cnpj}
                        onChange={(e) => handleInputChange("cnpj", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone/WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Digite novamente"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  Aceito os{" "}
                  <Link to="/termos" className="text-primary hover:underline">
                    termos de uso
                  </Link>{" "}
                  e{" "}
                  <Link to="/privacidade" className="text-primary hover:underline">
                    política de privacidade
                  </Link>
                </Label>
              </div>

              {/* Register Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-secondary"
                disabled={!acceptTerms}
              >
                Criar minha conta
              </Button>
            </form>

            <Separator />

            {/* Social Register */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Cadastrar com Google
              </Button>
              <Button variant="outline" className="w-full">
                Cadastrar com Facebook
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/entrar" className="text-primary hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cadastrar;