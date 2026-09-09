import PaginaLegal from "@/components/legal/PaginaLegal";

/**
 * Política de privacidade, escrita para a LGPD (Lei 13.709/2018).
 *
 * Descreve o tratamento que a plataforma realmente faz hoje: Supabase como
 * banco e autenticação, Mercado Pago como meio de pagamento, e nada além
 * disso. Se entrar analytics, e-mail marketing ou outro processador, esta
 * página precisa ser atualizada junto.
 */
const Privacidade = () => (
  <PaginaLegal
    titulo="Política de Privacidade"
    atualizadoEm="8 de setembro de 2026"
    resumo={
      "coletamos o necessário para você anunciar, alugar e ser pago. Não vendemos " +
      "seus dados. Você pode pedir acesso, correção ou exclusão a qualquer momento."
    }
  >
    <h2>1. Quem trata seus dados</h2>
    <p>
      A Loquei é a controladora dos dados pessoais tratados na plataforma.
      Encarregado pelo tratamento (DPO):{" "}
      <a href="mailto:privacidade@loquei.com.br">privacidade@loquei.com.br</a>.
    </p>

    <h2>2. Que dados coletamos</h2>
    <h3>Você nos fornece</h3>
    <ul>
      <li>
        <strong>Cadastro:</strong> nome, e-mail, telefone, tipo de pessoa (física
        ou jurídica) e, para PJ, razão social e CNPJ;
      </li>
      <li>
        <strong>Anúncios:</strong> fotos, descrição, preço e localização
        aproximada do item;
      </li>
      <li>
        <strong>Comunicação:</strong> mensagens trocadas na plataforma e contatos
        de suporte.
      </li>
    </ul>
    <h3>Coletamos pelo uso</h3>
    <ul>
      <li>Histórico de reservas, favoritos e avaliações;</li>
      <li>Dados técnicos de acesso, como endereço IP e tipo de navegador;</li>
      <li>Registros de segurança, como tentativas de login.</li>
    </ul>
    <h3>Não coletamos</h3>
    <p>
      <strong>Dados de cartão não passam pela Loquei.</strong> O pagamento é feito
      nas telas do Mercado Pago; recebemos de volta apenas o resultado da
      transação e um identificador.
    </p>

    <h2>3. Para que usamos, e com qual base legal</h2>
    <table>
      <thead>
        <tr>
          <th>Finalidade</th>
          <th>Base legal (LGPD)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Criar e manter sua conta</td>
          <td>Execução de contrato (art. 7º, V)</td>
        </tr>
        <tr>
          <td>Publicar anúncios e viabilizar reservas</td>
          <td>Execução de contrato (art. 7º, V)</td>
        </tr>
        <tr>
          <td>Cobrar taxas e promoções</td>
          <td>Execução de contrato (art. 7º, V)</td>
        </tr>
        <tr>
          <td>Prevenir fraude e abuso</td>
          <td>Legítimo interesse (art. 7º, IX)</td>
        </tr>
        <tr>
          <td>Cumprir obrigações fiscais e responder autoridades</td>
          <td>Obrigação legal (art. 7º, II)</td>
        </tr>
        <tr>
          <td>Enviar novidades e ofertas</td>
          <td>Consentimento (art. 7º, I) — revogável a qualquer momento</td>
        </tr>
      </tbody>
    </table>

    <h2>4. O que fica visível para outras pessoas</h2>
    <p>
      Seu <strong>nome</strong>, <strong>foto de perfil</strong>, mês de entrada e
      avaliações recebidas aparecem publicamente nos seus anúncios. A{" "}
      <strong>localização exibida é aproximada</strong>: o endereço exato só é
      compartilhado com a outra parte depois da reserva confirmada. Seu e-mail e
      telefone não são exibidos publicamente.
    </p>

    <h2>5. Com quem compartilhamos</h2>
    <ul>
      <li>
        <strong>Com a outra parte da locação:</strong> o necessário para a
        combinação (nome, contato e endereço de retirada, após a confirmação);
      </li>
      <li>
        <strong>Supabase</strong> — banco de dados, autenticação e armazenamento
        de imagens;
      </li>
      <li>
        <strong>Mercado Pago</strong> — processamento de pagamentos;
      </li>
      <li>
        <strong>Autoridades</strong>, mediante requisição legal.
      </li>
    </ul>
    <p>
      <strong>Não vendemos dados pessoais</strong> e não os cedemos para
      publicidade de terceiros.
    </p>

    <h2>6. Transferência internacional</h2>
    <p>
      Nossa infraestrutura fica hospedada no Supabase, com servidores nos{" "}
      <strong>Estados Unidos</strong>. Isso significa que seus dados são
      armazenados fora do Brasil, com as garantias contratuais do fornecedor,
      conforme os artigos 33 e 34 da LGPD.
    </p>

    <h2>7. Por quanto tempo guardamos</h2>
    <ul>
      <li>
        <strong>Conta ativa:</strong> enquanto você mantiver o cadastro;
      </li>
      <li>
        <strong>Após o encerramento:</strong> removemos ou anonimizamos, salvo o
        que a lei exigir manter;
      </li>
      <li>
        <strong>Registros de transações:</strong> 5 anos, por obrigação fiscal e
        para defesa em eventual disputa;
      </li>
      <li>
        <strong>Registros de acesso:</strong> 6 meses, conforme o Marco Civil da
        Internet.
      </li>
    </ul>

    <h2>8. Seus direitos</h2>
    <p>A LGPD garante a você (art. 18):</p>
    <ul>
      <li>saber se tratamos seus dados e acessar uma cópia;</li>
      <li>corrigir dados incompletos ou desatualizados;</li>
      <li>pedir anonimização, bloqueio ou eliminação de dados desnecessários;</li>
      <li>solicitar a portabilidade;</li>
      <li>revogar consentimento;</li>
      <li>se opor a tratamentos baseados em legítimo interesse.</li>
    </ul>
    <p>
      Escreva para{" "}
      <a href="mailto:privacidade@loquei.com.br">privacidade@loquei.com.br</a>.
      Respondemos em até 15 dias.
    </p>

    <h2>9. Cookies</h2>
    <p>
      Usamos apenas armazenamento local necessário para manter você conectado e
      lembrar preferências da interface. Não usamos cookies de rastreamento
      publicitário nem compartilhamos identificadores com redes de anúncios.
    </p>

    <h2>10. Segurança</h2>
    <p>
      Tráfego criptografado, senhas armazenadas apenas como hash, controle de
      acesso por linha no banco e credenciais de pagamento mantidas fora do
      navegador. Nenhum sistema é infalível: se ocorrer incidente com risco
      relevante, comunicaremos você e a ANPD, como manda o art. 48 da LGPD.
    </p>

    <h2>11. Crianças e adolescentes</h2>
    <p>
      A plataforma é destinada a maiores de 18 anos. Não coletamos
      intencionalmente dados de menores; identificando um cadastro assim, a conta
      é removida.
    </p>

    <h2>12. Alterações</h2>
    <p>
      Ao alterar esta política, avisaremos pela plataforma e atualizaremos a data
      no topo. Mudanças que ampliem o uso dos seus dados dependerão de novo
      consentimento quando a lei exigir.
    </p>
  </PaginaLegal>
);

export default Privacidade;
