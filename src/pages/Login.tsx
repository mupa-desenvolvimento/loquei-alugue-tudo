import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProgressSteps, type Step } from "@/components/ui/progress-steps";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const loginSteps: Step[] = [
  { id: "welcome", title: "Boas-vindas", description: "Início" },
  { id: "credentials", title: "Credenciais", description: "Login" },
  { id: "verification", title: "Verificação", description: "Segurança" }
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState("welcome");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNextStep = (stepId: string) => {
    setCompletedSteps(prev => [...prev, currentStep]);
    setCurrentStep(stepId);
  };

  const handlePreviousStep = (stepId: string) => {
    setCurrentStep(stepId);
    setCompletedSteps(prev => prev.filter(id => id !== stepId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profile = await login({ email, password });
    if (!profile) return;

    handleNextStep("verification");
    // A rota de origem vence; sem ela, cai no painel do perfil do usuário.
    const from = (location.state as { from?: string } | null)?.from;
    const painel = profile.profile === "locador" ? "/painel-locador" : "/painel-locatario";
    navigate(from ?? painel, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
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
          <h2 className="text-3xl font-bold text-foreground mb-2">Entrar na Loquei</h2>
          <p className="text-muted-foreground">
            Acesse sua conta para alugar ou anunciar
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps
          steps={loginSteps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        <Card className="border-0 shadow-elevated rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {currentStep === "welcome" && (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">Bem-vindo de volta!</CardTitle>
                  <CardDescription>
                    Que bom te ver novamente. Vamos acessar sua conta?
                  </CardDescription>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={() => handleNextStep("credentials")} 
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-accent shadow-modern"
                  >
                    Continuar com email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Separator className="my-6" />

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-2">
                      Continuar com Google
                    </Button>
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-2">
                      Continuar com Facebook
                    </Button>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link to="/cadastrar" className="text-primary hover:underline font-medium">
                      Cadastre-se aqui
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {currentStep === "credentials" && (
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
                    <CardTitle className="text-xl">Digite suas credenciais</CardTitle>
                    <CardDescription>
                      Informe seu email e senha para continuar
                    </CardDescription>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                        required
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

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
                      Esqueci minha senha
                    </Link>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent shadow-modern"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        Entrar na minha conta
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}

            {currentStep === "verification" && (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">Login realizado!</CardTitle>
                  <CardDescription>
                    Redirecionando você para a plataforma...
                  </CardDescription>
                </div>

                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

export default Login;