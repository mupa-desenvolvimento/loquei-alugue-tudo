import { Search, MessageCircle, CreditCard, Star, CheckCircle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Search,
    title: "Encontre o que precisa",
    description: "Busque por categoria, localização ou palavra-chave. Filtre por preço, avaliação e disponibilidade.",
    color: "from-brand-blue to-brand-blue/80"
  },
  {
    icon: MessageCircle,
    title: "Converse com o locador",
    description: "Tire suas dúvidas, combine detalhes da entrega e confirme a disponibilidade do item.",
    color: "from-brand-purple to-brand-purple/80"
  },
  {
    icon: CreditCard,
    title: "Faça a reserva",
    description: "Pagamento seguro com cartão, PIX ou boleto. Valor retido até a confirmação da entrega.",
    color: "from-brand-orange to-brand-orange/80"
  },
  {
    icon: CheckCircle,
    title: "Receba e aproveite",
    description: "Combine local e horário. Confira o item, use com responsabilidade e devolva no prazo.",
    color: "from-brand-green to-brand-green/80"
  }
];

const benefits = [
  {
    icon: Users,
    title: "Comunidade confiável",
    description: "Sistema de avaliações e verificação de identidade para sua segurança"
  },
  {
    icon: Star,
    title: "Qualidade garantida",
    description: "Todos os itens são verificados e avaliados pela nossa comunidade"
  },
  {
    icon: CreditCard,
    title: "Pagamento protegido",
    description: "Transações seguras com proteção ao comprador e liberação automática"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">Funciona</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alugar na Loquei é simples, seguro e rápido. Veja como em 4 passos:
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-brand-blue to-brand-purple"></div>
                    <div className="absolute -right-1 -top-1 w-3 h-3 bg-brand-purple rounded-full transform rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Por que escolher a <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">Loquei?</span>
            </h3>
            <p className="text-muted-foreground">
              Conectamos pessoas de forma segura e inteligente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;