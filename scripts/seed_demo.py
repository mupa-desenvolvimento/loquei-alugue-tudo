"""
Popula a Loquei com anúncios de demonstração: 10 itens em cada uma das 12
categorias, distribuídos entre locadores fictícios em várias cidades.

    python scripts/seed_demo.py            # cria o que faltar
    python scripts/seed_demo.py --limpar   # remove os anúncios de demonstração

Usa só a chave anon do .env e passa pelas mesmas regras de RLS que o app —
por isso precisa criar usuários de verdade para serem donos dos anúncios.
Todos os emails seguem o padrão `loquei.seed.NN@gmail.com` e os anúncios
levam a marca DEMO_TAG na descrição, para dar para limpar depois.

Requer, no projeto Supabase, a confirmação de email DESLIGADA
(Authentication -> Sign In / Providers -> Email -> Confirm email).
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

DEMO_TAG = "[demo]"
SENHA = "LoqueiSeed!2026"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def carregar_env():
    caminho = os.path.join(ROOT, ".env")
    if not os.path.exists(caminho):
        sys.exit("Crie o .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY antes de rodar.")
    env = {}
    for linha in open(caminho, encoding="utf-8"):
        linha = linha.strip()
        if linha and not linha.startswith("#") and "=" in linha:
            chave, valor = linha.split("=", 1)
            env[chave] = valor
    return env


ENV = carregar_env()
URL = ENV["VITE_SUPABASE_URL"]
ANON = ENV["VITE_SUPABASE_ANON_KEY"]


def api(metodo, caminho, corpo=None, token=None, prefer=None):
    req = urllib.request.Request(URL + caminho, method=metodo)
    req.add_header("apikey", ANON)
    req.add_header("Authorization", "Bearer " + (token or ANON))
    req.add_header("Content-Type", "application/json")
    if prefer:
        req.add_header("Prefer", prefer)
    dados = json.dumps(corpo).encode() if corpo is not None else None
    try:
        with urllib.request.urlopen(req, dados) as res:
            bruto = res.read().decode()
            return res.status, (json.loads(bruto) if bruto else None)
    except urllib.error.HTTPError as e:
        bruto = e.read().decode()
        try:
            return e.code, json.loads(bruto)
        except ValueError:
            return e.code, bruto


IMAGENS = {
    "ferramentas": ["photo-1426927308491-6380b6a9936f", "photo-1504148455328-c376907d081c",
                    "photo-1572981779307-38b8cabb2407", "photo-1503387762-592deb58ef4e"],
    "construcao": ["photo-1541888946425-d81bb19240f5", "photo-1504307651254-35680f356dfd",
                   "photo-1504328345606-18bbc8c9d7d1", "photo-1503387762-592deb58ef4e"],
    "eletronicos": ["photo-1498050108023-c5249f4df085", "photo-1517694712202-14dd9538aa97",
                    "photo-1519389950473-47ba0277781c", "photo-1519494026892-80bbd2d6fd0d",
                    "photo-1522199755839-a2bacb67c546", "photo-1550009158-9ebf69173e03"],
    "foto-video": ["photo-1516035069371-29a1b244cc32", "photo-1526170375885-4d8ecf77b99f",
                   "photo-1527011046414-4781f1f94f8c", "photo-1471341971476-ae15ff5dd4ea",
                   "photo-1542038784456-1ea8e935640e", "photo-1579829366248-204fe8413f31"],
    "audio-musica": ["photo-1530124566582-a618bc2615dc", "photo-1511671782779-c97d3d27a1d4",
                     "photo-1545454675-3531b543be5d", "photo-1546435770-a3e426bf472b",
                     "photo-1484704849700-f032a568e944", "photo-1550745165-9bc0b252726f"],
    "festas": ["photo-1517457373958-b7bdd4587205", "photo-1530103862676-de8c9debad1d",
               "photo-1464366400600-7168b8af9bc3", "photo-1478147427282-58a87a120781",
               "photo-1527529482837-4698179dc6ce", "photo-1493225457124-a3eb161ffa5f"],
    "esportes": ["photo-1531722569936-825d3dd91b15", "photo-1502680390469-be75c86b636f",
                 "photo-1542291026-7eec264c27ff", "photo-1544367567-0f2fcb009e0b",
                 "photo-1461896836934-ffe607ba8211"],
    "camping": ["photo-1504280390367-361c6d9f38f4", "photo-1523987355523-c7b5b0dd90a7"],
    "casa-jardim": ["photo-1484101403633-562f891dc89a", "photo-1493663284031-b7e3aefcae8e",
                    "photo-1555041469-a586c61ea9bc", "photo-1560448204-e02f11c3d0e2",
                    "photo-1416879595882-3373a0480b5b", "photo-1590756254933-2873d72a83b6"],
    "mobilidade": ["photo-1485965120184-e220f721d03e", "photo-1532298229144-0ec0c57515c7",
                   "photo-1571068316344-75bc76f77890", "photo-1581235720704-06d3acfcb36f"],
    "bebe-infantil": ["photo-1519689680058-324335c77eba", "photo-1555252333-9f8e92e65df9",
                      "photo-1587654780291-39c9404d746b", "photo-1515488042361-ee00e0ddd4e4",
                      "photo-1596461404969-9ae70f2830c1", "photo-1516627145497-ae6968895b74"],
    "outros": ["photo-1513475382585-d06e58bcb0e0", "photo-1524805444758-089113d48a6d",
               "photo-1441986300917-64674bd600d8"],
}

CIDADES = [
    "Vila Madalena, São Paulo, SP", "Pinheiros, São Paulo, SP", "Copacabana, Rio de Janeiro, RJ",
    "Botafogo, Rio de Janeiro, RJ", "Savassi, Belo Horizonte, MG", "Batel, Curitiba, PR",
    "Moinhos de Vento, Porto Alegre, RS", "Barra, Salvador, BA", "Meireles, Fortaleza, CE",
    "Asa Norte, Brasília, DF", "Centro, Florianópolis, SC", "Boa Viagem, Recife, PE",
]

# (título, descrição, diária, caução)
CATALOGO = {
    "ferramentas": [
        ("Furadeira de Impacto Bosch 750W", "Furadeira de impacto com maleta e kit de 10 brocas para concreto, madeira e metal.", 25, 100),
        ("Parafusadeira Makita 18V", "Parafusadeira a bateria com duas baterias, carregador e kit de bits.", 30, 120),
        ("Serra Circular 1800W", "Serra circular com disco novo e guia paralela. Corta até 65mm.", 45, 200),
        ("Esmerilhadeira Angular 4.1/2", "Esmerilhadeira com discos de corte e desbaste inclusos.", 28, 100),
        ("Serra Tico-Tico Profissional", "Ideal para cortes curvos em madeira e MDF. Acompanha 5 lâminas.", 25, 90),
        ("Kit Chaves Completo 129 peças", "Maleta com catraca, soquetes, chaves fixas e allen.", 20, 80),
        ("Lixadeira Orbital 300W", "Para acabamento em madeira e massa corrida. Com 10 lixas.", 22, 80),
        ("Martelete Rompedor 1500W", "Martelete para demolição leve, com ponteiro e talhadeira.", 90, 400),
        ("Compressor de Ar 50 Litros", "Compressor com pistola de pintura e mangueira de 10m.", 70, 300),
        ("Nível a Laser Autonivelante", "Nível de linha cruzada com tripé. Alcance de 20 metros.", 40, 180),
    ],
    "construcao": [
        ("Betoneira 400 Litros", "Betoneira elétrica para obra pequena e média. Entrega combinada.", 120, 500),
        ("Andaime Tubular 2 Módulos", "Andaime com plataforma e rodízios. Altura útil de 3 metros.", 80, 350),
        ("Máquina de Solda Inversora 200A", "Solda eletrodo e TIG, com cabos, alicate e máscara automática.", 85, 400),
        ("Placa Vibratória Compactadora", "Compactação de solo e paver. Motor a gasolina 5.5HP.", 150, 600),
        ("Cortadora de Piso e Cerâmica 1200mm", "Corte reto e diagonal em porcelanato até 15mm.", 55, 250),
        ("Carrinho de Mão Reforçado", "Caçamba metálica 60 litros, pneu com câmara.", 15, 50),
        ("Escada Extensível 7 Metros", "Escada de alumínio com trava de segurança.", 45, 200),
        ("Guincho de Coluna 200kg", "Elevação de material em obra. Cabo de 30 metros.", 110, 500),
        ("Régua Vibratória para Concreto", "Nivelamento de laje e piso. Motor 4 tempos.", 95, 400),
        ("Gerador a Gasolina 3.5 kVA", "Gerador com partida manual, autonomia de 8 horas.", 130, 600),
    ],
    "eletronicos": [
        ("Notebook Dell i7 16GB SSD", "Notebook para trabalho e edição, com carregador e capa.", 120, 800),
        ("Monitor Ultrawide 34 LG", "Monitor curvo 34 polegadas com cabo HDMI e DisplayPort.", 80, 500),
        ("Projetor Full HD 3000 Lumens", "Projetor com HDMI, USB e tela retrátil de 100 polegadas.", 60, 300),
        ("iPad Pro 11 + Apple Pencil", "iPad para apresentação e desenho, com teclado e capa.", 110, 700),
        ("Console PlayStation 5", "PS5 com dois controles e três jogos. Ideal para fim de semana.", 90, 600),
        ("Impressora 3D Creality Ender 3", "Impressora calibrada, com 1kg de filamento incluso.", 75, 350),
        ("Kit Videoconferência Profissional", "Webcam 4K, microfone de mesa e luz de apoio.", 65, 300),
        ("Smart TV 55 4K Portátil com Pedestal", "TV para evento ou apresentação, com pedestal móvel.", 100, 600),
        ("Roteador Mesh 3 Pontos", "Cobertura wi-fi para eventos e casas grandes.", 45, 200),
        ("Tablet Gráfico Wacom Intuos Pro", "Mesa digitalizadora tamanho médio com caneta e cabos.", 55, 300),
    ],
    "foto-video": [
        ("Câmera Sony Alpha a7 III + 24-70mm", "Full frame com duas baterias, cartão 128GB e bolsa.", 150, 900),
        ("Canon EOS R6 Corpo", "Mirrorless full frame com duas baterias e cartão CFexpress.", 170, 1000),
        ("Lente 70-200mm f/2.8", "Teleobjetiva estabilizada para retrato e esporte.", 120, 800),
        ("Drone DJI Mini 3 Pro", "Drone com três baterias, controle com tela e case rígido.", 130, 800),
        ("Kit Iluminação Softbox 3 Pontos", "Três softboxes com tripés e lâmpadas de LED.", 70, 300),
        ("Gimbal DJI Ronin RS3", "Estabilizador para câmeras até 3kg, com maleta.", 90, 500),
        ("GoPro Hero 12 + Acessórios", "Action cam com bastão, cinta de peito e caixa estanque.", 60, 350),
        ("Câmera Instantânea Instax Wide", "Ideal para casamento e festa. Acompanha 40 filmes.", 45, 150),
        ("Fundo Infinito Branco 3x6m", "Fundo de papel com suporte para estúdio.", 40, 150),
        ("Slider Motorizado 80cm", "Movimento suave para vídeo, com controle e bateria.", 65, 300),
    ],
    "audio-musica": [
        ("Kit Som 1000W com 2 Caixas Ativas", "Mesa de som, duas caixas, tripés e microfone sem fio.", 180, 500),
        ("Guitarra Fender Stratocaster", "Guitarra com cabo, correia e afinador. Case incluso.", 70, 400),
        ("Violão Eletroacústico Takamine", "Violão com cordas novas, capa e afinador.", 50, 300),
        ("Teclado Yamaha PSR-E473", "Teclado de 61 teclas com suporte, pedal e fonte.", 65, 350),
        ("Bateria Eletrônica Roland TD-07", "Bateria com pad duplo, banco, fones e baquetas.", 120, 700),
        ("Microfone Shure SM7B + Interface", "Kit de podcast com pedestal e interface de áudio.", 80, 400),
        ("Mesa de Som Digital 16 Canais", "Mesa com efeitos e gravação multipista via USB.", 140, 800),
        ("Caixa Amplificada JBL PartyBox", "Caixa com bateria interna, bluetooth e microfone.", 90, 400),
        ("Contrabaixo Ativo 5 Cordas", "Baixo com cabo, correia e capa acolchoada.", 75, 400),
        ("Kit DJ Pioneer DDJ-400", "Controladora com notebook opcional e fones.", 110, 600),
    ],
    "festas": [
        ("Kit Mesa Posta para 20 Pessoas", "Louça, taças e talheres completos, já higienizados.", 130, 400),
        ("Máquina de Fumaça 1500W", "Máquina com controle remoto e 1 litro de fluido.", 55, 200),
        ("Painel de LED para Festa 2x2m", "Painel de fundo com controlador e efeitos.", 160, 700),
        ("Tenda 5x5m com Fechamento", "Tenda com estrutura de aço e cobertura impermeável.", 200, 800),
        ("Kit 50 Cadeiras e 10 Mesas", "Mobiliário completo para recepção. Entrega inclusa.", 250, 600),
        ("Chopeira Elétrica 50 Litros", "Chopeira com serpentina e cilindro de CO2.", 140, 500),
        ("Máquina de Algodão Doce", "Com 100 palitos e açúcar colorido incluso.", 80, 250),
        ("Totem de Fotos 360 Graus", "Plataforma giratória com iluminação e tablet.", 300, 1000),
        ("Kit Iluminação Cênica RGB", "Oito refletores de LED com mesa de controle.", 120, 500),
        ("Arco de Balões Desmontável", "Estrutura para painel de balões, 2,5m de altura.", 60, 200),
    ],
    "esportes": [
        ("Prancha de Surf Longboard 9'2\"", "Longboard estável para iniciante. Leash e capa inclusos.", 45, 250),
        ("Kit Stand Up Paddle Inflável", "SUP com remo, bomba, quilha e mochila de transporte.", 70, 400),
        ("Bicicleta Mountain Bike Aro 29", "MTB com 21 marchas, capacete e cadeado.", 55, 350),
        ("Kit Camping Escalada Completo", "Cordas, mosquetões, cadeirinha e capacete.", 65, 400),
        ("Esteira Ergométrica Dobrável", "Esteira até 120kg com painel digital. Entrega inclusa.", 90, 600),
        ("Kit Halteres e Anilhas 40kg", "Barra, anilhas e presilhas para treino em casa.", 40, 250),
        ("Caiaque Duplo com Remos", "Caiaque rígido para dois, com coletes salva-vidas.", 110, 600),
        ("Kit Beach Tennis 4 Raquetes", "Raquetes profissionais, bolas e rede portátil.", 50, 250),
        ("Skate Elétrico Longboard", "Autonomia de 25km, com controle e carregador.", 85, 500),
        ("Kit Mergulho Livre Completo", "Máscara, snorkel, nadadeiras e roupa de neoprene.", 45, 250),
    ],
    "camping": [
        ("Barraca Iglu 4 Pessoas", "Barraca impermeável com sobreteto e dois sacos de dormir.", 55, 250),
        ("Trailer Compacto para 2 Pessoas", "Trailer com cama, pia e geladeira. Engate universal.", 350, 2000),
        ("Kit Cozinha de Camping", "Fogareiro, panelas, botijão pequeno e utensílios.", 35, 150),
        ("Saco de Dormir -5°C", "Saco térmico para serra e alta altitude, com isolante.", 25, 100),
        ("Lampião Solar Recarregável", "Lampião LED com painel solar e power bank integrado.", 15, 60),
        ("Barraca de Teto Veicular", "Barraca instalada no rack do carro. Montagem em 2 minutos.", 180, 900),
        ("Cadeiras e Mesa Dobráveis (4 lugares)", "Kit compacto de camping em nylon reforçado.", 30, 120),
        ("Cooler Térmico 45 Litros", "Mantém gelo por até 3 dias. Com rodinhas.", 28, 120),
        ("Kit Trilha com Mochila 60L", "Mochila cargueira, bastões e capa de chuva.", 40, 200),
        ("Chuveiro Portátil de Camping", "Chuveiro pressurizado 20 litros com bomba manual.", 20, 80),
    ],
    "casa-jardim": [
        ("Lavadora de Alta Pressão 1800W", "Lava carro, calçada e fachada. Mangueira de 8 metros.", 50, 250),
        ("Cortador de Grama Elétrico", "Cortador com recolhedor e altura ajustável.", 55, 250),
        ("Aparador de Cerca Viva", "Aparador elétrico com lâmina de 60cm.", 35, 150),
        ("Extratora de Estofados", "Limpeza de sofá, colchão e carpete. Com produto incluso.", 90, 400),
        ("Ar-Condicionado Portátil 12.000 BTU", "Portátil com controle e kit de janela.", 80, 400),
        ("Escada Multifuncional 4x3", "Escada articulada de alumínio, até 3,5 metros.", 30, 150),
        ("Kit Jardinagem Completo", "Tesoura, pá, ancinho, regador e luvas.", 20, 80),
        ("Aspirador de Pó e Água 20L", "Aspirador para obra e limpeza pesada.", 45, 200),
        ("Furadeira de Bancada", "Para marcenaria e trabalhos de precisão.", 60, 300),
        ("Roçadeira a Gasolina", "Roçadeira lateral com fio de nylon e lâmina.", 70, 350),
    ],
    "mobilidade": [
        ("Bicicleta Elétrica Urbana 250W", "Autonomia de 45km, aro 29, com capacete e cadeado.", 90, 500),
        ("Patinete Elétrico 350W", "Autonomia de 30km, dobrável, com carregador.", 70, 400),
        ("Bicicleta Speed Carbono", "Bike de estrada com pedal clip e capacete.", 120, 900),
        ("Carretinha Reboque para Carro", "Carretinha 1,20x1,50m com lona e engate.", 100, 500),
        ("Bagageiro de Teto Rígido 400L", "Bagageiro com travas e barras transversais.", 60, 300),
        ("Cadeira de Rodas Dobrável", "Cadeira leve em alumínio, com almofada.", 45, 250),
        ("Rack para 3 Bicicletas", "Suporte de engate com trava e cintas.", 40, 200),
        ("Scooter Elétrica Assento Duplo", "Autonomia de 60km, com dois capacetes.", 130, 800),
        ("Bicicleta Infantil Aro 20", "Bike para criança de 6 a 10 anos, com rodinhas.", 30, 150),
        ("Triciclo de Carga Elétrico", "Para entrega e mudança leve, caçamba de 200 litros.", 160, 900),
    ],
    "bebe-infantil": [
        ("Carrinho de Bebê 3 em 1", "Carrinho com bebê conforto e base para carro.", 60, 350),
        ("Bebê Conforto com Base Isofix", "Aprovado pelo Inmetro, higienizado a cada locação.", 40, 250),
        ("Berço Portátil Desmontável", "Berço com colchão e mosquiteiro. Cabe no porta-malas.", 45, 200),
        ("Cadeirinha para Auto 9-36kg", "Cadeirinha reclinável para crianças de 1 a 10 anos.", 35, 200),
        ("Cercadinho de Segurança", "Cercado modular de 8 peças para sala.", 40, 180),
        ("Kit Festa Infantil Decoração", "Painel, arco de balões, mesa e itens temáticos.", 150, 500),
        ("Cama Elástica 3 Metros", "Pula-pula com rede de proteção. Montagem inclusa.", 180, 600),
        ("Piscina de Bolinhas com 500 Bolinhas", "Piscina cercada, higienizada, para até 6 crianças.", 120, 400),
        ("Banheira com Suporte", "Banheira ergonômica com termômetro e suporte dobrável.", 25, 100),
        ("Kit Brinquedos Educativos 0-3 anos", "Blocos, encaixe e livros sensoriais higienizados.", 30, 120),
    ],
    "outros": [
        ("Máquina de Costura Portátil", "Singer com 20 pontos, pedal e kit de linhas.", 40, 200),
        ("Mala de Viagem Grande 32kg", "Mala rígida com cadeado TSA e rodinhas 360.", 25, 150),
        ("Kit Ferramentas de Marcenaria", "Formões, serrote, grampos e plaina manual.", 45, 250),
        ("Balança Industrial 300kg", "Balança de plataforma com display digital.", 55, 250),
        ("Máquina de Cortar Cabelo Profissional", "Kit completo com pentes, tesoura e capa.", 30, 120),
        ("Caixa Térmica Profissional 120L", "Para eventos e transporte de alimentos.", 45, 200),
        ("Detector de Metais", "Detector com discriminação e fone de ouvido.", 60, 350),
        ("Telescópio Refletor 130mm", "Telescópio com tripé, oculares e mapa celeste.", 70, 400),
        ("Purificador de Ar HEPA", "Purificador para ambientes de até 40m2.", 35, 180),
        ("Kit Pintura Predial Completo", "Rolos, bandejas, extensor e lona de proteção.", 25, 100),
    ],
}

NOMES = [
    "Ricardo Oliveira", "Marina Costa", "Felipe Andrade", "Juliana Reis", "Camila Souza",
    "Bruno Martins", "Ana Beatriz Lima", "Rafael Nogueira", "Patrícia Gomes", "Thiago Ferreira",
]


def entrar_ou_criar(indice):
    """Cria o locador fictício; se já existir, faz login."""
    email = f"loquei.seed.{indice:02d}@gmail.com"
    status, corpo = api("POST", "/auth/v1/signup", {
        "email": email,
        "password": SENHA,
        "data": {"name": NOMES[indice], "type": "pf", "profile": "locador"},
    })
    if status == 200 and isinstance(corpo, dict) and corpo.get("access_token"):
        return corpo["access_token"], corpo["user"]["id"]

    status, corpo = api("POST", "/auth/v1/token?grant_type=password",
                        {"email": email, "password": SENHA})
    if status == 200 and corpo.get("access_token"):
        return corpo["access_token"], corpo["user"]["id"]

    print(f"  ! não consegui autenticar {email}: HTTP {status} {json.dumps(corpo)[:200]}")
    return None, None


def limpar():
    """Remove os anúncios de demonstração (as contas ficam: exigem service_role)."""
    total = 0
    for indice in range(len(NOMES)):
        token, uid = entrar_ou_criar(indice)
        if not token:
            continue
        status, _ = api("DELETE", f"/rest/v1/listings?owner_id=eq.{uid}", token=token)
        if status in (200, 204):
            total += 1
    print(f"Anúncios removidos dos {total} locadores de demonstração.")
    print("Para apagar as contas: dashboard -> Authentication -> Users -> filtre por 'loquei.seed'.")


def semear():
    status, categorias = api("GET", "/rest/v1/categories?select=slug")
    existentes = {c["slug"] for c in (categorias or [])}
    faltando = set(CATALOGO) - existentes
    if faltando:
        sys.exit(f"Faltam categorias no banco: {sorted(faltando)}.\n"
                 f"Rode antes a migração supabase/migrations/0003_admin_and_categories.sql.")

    sessoes = []
    print("Preparando locadores de demonstração...")
    for indice in range(len(NOMES)):
        token, uid = entrar_ou_criar(indice)
        if token:
            sessoes.append((token, uid))
    if not sessoes:
        sys.exit("Nenhum locador disponível — verifique a confirmação de email no projeto.")
    print(f"  {len(sessoes)} locadores prontos.\n")

    criados = 0
    pulados = 0
    contador = 0

    for slug, itens in CATALOGO.items():
        fotos = IMAGENS[slug]
        for posicao, (titulo, descricao, preco, caucao) in enumerate(itens):
            token, uid = sessoes[contador % len(sessoes)]

            status, existente = api(
                "GET", f"/rest/v1/listings?select=id&title=eq.{urllib.parse.quote(titulo)}", token=token)
            if existente:
                pulados += 1
                contador += 1
                continue

            # Duas fotos por anúncio, alternando dentro da categoria.
            imagens = [
                f"https://images.unsplash.com/{fotos[posicao % len(fotos)]}?auto=format&fit=crop&w=1200&q=80",
                f"https://images.unsplash.com/{fotos[(posicao + 1) % len(fotos)]}?auto=format&fit=crop&w=1200&q=80",
            ]

            status, corpo = api("POST", "/rest/v1/listings", {
                "owner_id": uid,
                "category_slug": slug,
                "title": titulo,
                "description": f"{descricao}\n\n{DEMO_TAG} anúncio de demonstração.",
                "price_per_day": preco,
                "deposit": caucao,
                "location": CIDADES[contador % len(CIDADES)],
                "images": imagens,
                "status": "active",
            }, token=token, prefer="return=minimal")

            if status in (200, 201, 204):
                criados += 1
            else:
                print(f"  ! {slug}/{titulo}: HTTP {status} {json.dumps(corpo)[:160]}")
            contador += 1
        print(f"  {slug}: ok")

    print(f"\n{criados} anúncios criados, {pulados} já existiam.")


if __name__ == "__main__":
    if "--limpar" in sys.argv:
        limpar()
    else:
        semear()
