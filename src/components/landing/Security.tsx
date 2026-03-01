
import { ShieldCheck, UserCheck, FileText, Lock } from "lucide-react";

const Security = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Confiança Total</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
            Sua segurança é nossa prioridade zero
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Desenvolvemos um ecossistema protegido para que você possa alugar com tranquilidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pagamento Protegido</h3>
            <p className="text-gray-600 text-sm">
              O valor fica retido conosco e só é liberado após a confirmação de que tudo correu bem.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Usuários Verificados</h3>
            <p className="text-gray-600 text-sm">
              Checamos documentos e identidade de todos os participantes da plataforma.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Contrato Digital</h3>
            <p className="text-gray-600 text-sm">
              Geramos um contrato automático para cada locação, com validade jurídica.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Dados Criptografados</h3>
            <p className="text-gray-600 text-sm">
              Suas informações pessoais e bancárias são protegidas com criptografia de ponta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
