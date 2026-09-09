import PaginaLegal from "@/components/legal/PaginaLegal";
import {
  SERVICE_FEE_RATE,
  PROTECTION_RATE,
  OWNER_COMMISSION_RATE,
} from "@/lib/pricing";

const pct = (taxa: number) => `${Math.round(taxa * 100)}%`;

/**
 * Termos de uso.
 *
 * As taxas vêm de `pricing.ts`, a mesma fonte que a plataforma usa para
 * cobrar — assim o documento não descreve um preço diferente do praticado.
 */
const Termos = () => (
  <PaginaLegal
    titulo="Termos de Uso"
    atualizadoEm="8 de setembro de 2026"
    resumo={
      "a Loquei aproxima quem tem um item de quem precisa usá-lo. Quem aluga e quem " +
      "empresta fecham o negócio entre si; a Loquei cuida do anúncio, do pagamento das " +
      "taxas e da mediação, mas não é dona dos itens nem seguradora."
    }
  >
    <h2>1. Quem somos e o que fazemos</h2>
    <p>
      A Loquei é uma plataforma que conecta pessoas que possuem itens ociosos
      (locadores) a pessoas que precisam usá-los por um período (locatários).
    </p>
    <p>
      <strong>
        A Loquei não é proprietária, vistoriadora, depositária ou seguradora dos
        itens anunciados, e não é parte do contrato de locação.
      </strong>{" "}
      O contrato se forma diretamente entre locador e locatário. Nosso papel é
      oferecer o ambiente, os meios de pagamento das taxas e a mediação prevista
      no item 9.
    </p>

    <h2>2. Quem pode usar</h2>
    <ul>
      <li>Pessoas com 18 anos ou mais, capazes de contratar;</li>
      <li>Pessoas jurídicas regularmente constituídas, por meio de representante.</li>
    </ul>
    <p>
      Você é responsável pela veracidade dos dados que informa e por manter a
      senha em sigilo. Cada pessoa deve ter uma única conta.
    </p>

    <h2>3. Obrigações do locador</h2>
    <ul>
      <li>
        Anunciar apenas itens de que seja legítimo possuidor e cuja locação seja
        lícita;
      </li>
      <li>
        Descrever o item com honestidade, incluindo defeitos, desgaste e o que
        acompanha;
      </li>
      <li>Usar fotos reais do próprio item, não imagens de catálogo;</li>
      <li>Entregar o item em condições de uso e na data combinada;</li>
      <li>Devolver a caução quando o item retornar sem danos além do uso normal.</li>
    </ul>
    <p>
      É proibido anunciar armas, medicamentos, itens roubados, produtos que exijam
      licença que você não tenha, e qualquer bem cuja locação seja vedada por lei.
    </p>

    <h2>4. Obrigações do locatário</h2>
    <ul>
      <li>Usar o item conforme a finalidade dele e as instruções do locador;</li>
      <li>Devolver na data, no local e nas condições combinadas;</li>
      <li>
        Comunicar imediatamente ao locador qualquer dano, defeito, furto ou perda;
      </li>
      <li>
        Arcar com danos que excedam o desgaste natural de uso, além de multas e
        despesas geradas durante o período da locação.
      </li>
    </ul>

    <h2>5. Preços, taxas e repasses</h2>
    <p>O locador define a diária. Sobre ela incidem:</p>
    <ul>
      <li>
        <strong>Taxa de serviço de {pct(SERVICE_FEE_RATE)}</strong>, paga pelo
        locatário — é a remuneração da Loquei pelo uso da plataforma;
      </li>
      <li>
        <strong>Taxa de proteção de {pct(PROTECTION_RATE)}</strong>, paga pelo
        locatário — ver item 8;
      </li>
      <li>
        <strong>Comissão de {pct(OWNER_COMMISSION_RATE)}</strong>, descontada do
        repasse ao locador.
      </li>
    </ul>
    <p>
      Todos os valores aparecem discriminados antes da confirmação. A caução,
      quando houver, é retida e devolvida após a devolução sem danos — ela não é
      receita da Loquei.
    </p>

    <h2>6. Reservas</h2>
    <p>
      A solicitação do locatário só vira reserva quando o locador aceita. O
      locador pode recusar sem justificativa. Enquanto a reserva estiver
      pendente, o item continua disponível para outros interessados.
    </p>

    <h2>7. Cancelamento</h2>
    <ul>
      <li>
        <strong>Pelo locatário</strong>, até 24 horas antes da retirada: devolução
        integral do valor pago, exceto a taxa de serviço;
      </li>
      <li>
        <strong>Pelo locatário</strong>, com menos de 24 horas: o locador pode
        reter até uma diária;
      </li>
      <li>
        <strong>Pelo locador</strong>, a qualquer momento: devolução integral ao
        locatário, incluindo a taxa de serviço. Cancelamentos recorrentes podem
        levar à suspensão do anúncio.
      </li>
    </ul>

    <h2>8. O que a taxa de proteção cobre — e o que não cobre</h2>
    <p>
      <strong>
        A taxa de proteção não é seguro e a Loquei não é sociedade seguradora.
      </strong>{" "}
      Ela remunera o processo de mediação descrito no item 9 e a retenção da
      caução.
    </p>
    <p>Em caso de dano ou não devolução:</p>
    <ul>
      <li>
        a caução retida é usada para ressarcir o locador, no limite do valor
        retido;
      </li>
      <li>
        o que exceder a caução é de responsabilidade do locatário, que responde
        civilmente perante o locador;
      </li>
      <li>
        a Loquei não indeniza prejuízos com recursos próprios e não garante o
        pagamento pelo locatário.
      </li>
    </ul>
    <p>
      Para itens de valor elevado, recomendamos que o locador contrate seguro
      próprio.
    </p>

    <h2>9. Disputas</h2>
    <p>
      Havendo divergência, as partes devem tentar resolver diretamente pelo chat
      da plataforma. Persistindo, qualquer uma pode acionar a Loquei em até 7
      dias corridos da devolução prevista. Analisaremos as evidências (fotos,
      mensagens, histórico) e decidiremos sobre a destinação da caução retida.
      Essa decisão se limita à caução e não impede as partes de buscarem seus
      direitos pelas vias próprias.
    </p>

    <h2>10. Promoções pagas</h2>
    <p>
      O locador pode contratar destaque, topo de categoria, banner ou o Plano Pro.
      São serviços de visibilidade e de condição comercial, com prazo determinado
      e cobrança à vista.{" "}
      <strong>Não garantem locações, visitas ou qualquer resultado.</strong> Não
      há devolução proporcional por desistência após a ativação, salvo falha
      atribuível à Loquei.
    </p>

    <h2>11. Condutas proibidas</h2>
    <ul>
      <li>Combinar pagamento fora da plataforma para burlar as taxas;</li>
      <li>Criar contas falsas, avaliações falsas ou anúncios fictícios;</li>
      <li>Assediar, discriminar ou ameaçar outras pessoas;</li>
      <li>Raspar dados, automatizar acessos ou tentar burlar controles de segurança.</li>
    </ul>

    <h2>12. Suspensão e encerramento</h2>
    <p>
      Podemos suspender ou encerrar contas que descumpram estes termos, com aviso
      sempre que possível e imediatamente em casos de fraude, risco a terceiros ou
      ordem judicial. Você pode encerrar sua conta a qualquer momento; obrigações
      de locações em andamento permanecem.
    </p>

    <h2>13. Limitação de responsabilidade</h2>
    <p>
      A Loquei responde pelos serviços que efetivamente presta: disponibilidade da
      plataforma, processamento correto das taxas e mediação. Não respondemos pela
      qualidade, procedência, segurança ou legalidade dos itens anunciados, nem
      pelo cumprimento das obrigações entre locador e locatário.
    </p>
    <p>
      Nada aqui afasta direitos assegurados pelo Código de Defesa do Consumidor
      quando ele for aplicável à relação entre você e a Loquei.
    </p>

    <h2>14. Alterações</h2>
    <p>
      Podemos alterar estes termos. Mudanças relevantes serão avisadas pela
      plataforma com pelo menos 15 dias de antecedência. Continuar usando a Loquei
      após a vigência significa concordar com a nova versão.
    </p>

    <h2>15. Lei aplicável e foro</h2>
    <p>
      Aplica-se a lei brasileira. Fica eleito o foro do domicílio do consumidor
      para as relações de consumo e, nas demais, o foro da comarca da sede da
      Loquei.
    </p>

    <h2>16. Contato</h2>
    <p>
      Dúvidas, denúncias e solicitações:{" "}
      <a href="mailto:contato@loquei.com.br">contato@loquei.com.br</a>.
    </p>
  </PaginaLegal>
);

export default Termos;
