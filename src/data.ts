import { Institution, EditalDeadline, CareerArea } from "./types";

export const CURITIBA_INSTITUTIONS: Institution[] = [
  {
    id: "ufpr",
    name: "UFPR - Universidade Federal do Paraná",
    type: "Pública Federal",
    campus: ["Centro (Reitoria, Santos Andrade)", "Politécnico (Jardim das Américas)", "Cabral", "Rebouças", "Matinhos", "Palotina"],
    website: "https://www.ufpr.br",
    description: "A mais antiga universidade do Brasil, fundada em 1912. Ícone educacional de Curitiba e do Paraná, altamente reconhecida por suas pesquisas, laboratórios de alto nível e forte prestígio acadêmico no mercado nacional.",
    highlights: "Entrada por vestibular unificado próprio de duas fases ou por transferência externa. Oferece auxílios estudantis robustos (alimentação, moradia) via PRAE.",
    logo: "🏛️"
  },
  {
    id: "utfpr",
    name: "UTFPR - Universidade Tecnológica Federal do Paraná",
    type: "Pública Federal",
    campus: ["Sede Centro (Av. Sete de Setembro)", "Sede Ecoville (Rua Dep. Heitor Alencar Furtado)", "Sede Neoville (Rua Pedro Gusso)"],
    website: "https://www.utfpr.edu.br",
    description: "Referência nacional de ensino tecnológico de ponta, derivada do CEFET-PR. Excelente foco na resolução prática de problemas, estreita conexão com o polo industrial de Curitiba e programas de empreendedorismo de ponta.",
    highlights: "Ingresso 100% pelo SISU (nota do ENEM). Fortes laços de pesquisa aplicada, desenvolvimento e alta aceitação de graduandos nas maiores empresas de tecnologia do país.",
    logo: "💻"
  },
  {
    id: "ifpr",
    name: "IFPR - Instituto Federal do Paraná",
    type: "Pública Federal",
    campus: ["Campus Curitiba (Ecoville / Neoville)", "RM Colombo", "RM Pinhais", "RM Campo Largo"],
    website: "https://ifpr.edu.br",
    description: "Oferece desde cursos técnicos integrados ao ensino médio até graduações tecnológicas de curta duração, além de licenciaturas voltadas para inserção veloz e qualificada no mercado profissional paranaense.",
    highlights: "Vestibular próprio anual e sorteio público para vagas remanescentes. Altamente prestigiado na capacitação produtiva regional de base industrial e de serviços.",
    logo: "🛠️"
  },
  {
    id: "pucpr",
    name: "PUCPR - Pontifícia Universidade Católica do Paraná",
    type: "Privada Comunitária",
    campus: ["Campus Principal (Prado Velho / Curitiba)", "Londrina", "Maringá", "Toledo"],
    website: "https://www.pucpr.br",
    description: "Reconhecida como uma das melhores universidades privadas e filantrópicas do Brasil. Possui um gigantesco ecossistema de inovação (Hotmilk) no Prado Velho, integrando startups e desenvolvimento tecnológico à formação acadêmica.",
    highlights: "Oferece bolsas integrais da Bolsa Social PUCPR, ProUni nacional, vestibular de redação online, aproveitamento do ENEM e financiamentos flexíveis.",
    logo: "⛪"
  },
  {
    id: "positivo",
    name: "Universidade Positivo - UP",
    type: "Privada",
    campus: ["Ecoville (Campus Sede)", "Praça Osório", "Santos Andrade (Pós-Graduação)"],
    website: "https://www.up.edu.br",
    description: "Destaca-se pela sua infraestrutura monumental no Campo Comprido e forte proximidade corporativa nas áreas de medicina, odontologia, arquitetura de vanguarda e ciências de negócios, além da agilidade do sistema EaD.",
    highlights: "Bolsas de mérito pelo ENEM de até 100%, Vestibular de Inverno agendado, e programas de incentivo à transição de carreira para adultos.",
    logo: "☀️"
  },
  {
    id: "unespar",
    name: "UNESPAR - Campus de Curitiba I (EMBAP) e II (FAP)",
    type: "Pública Estadual",
    campus: ["EMBAP (Centro / Comendador Araujo)", "FAP (Cabral)"],
    website: "https://www.unespar.edu.br",
    description: "Universidade Pública Estadual que abriga duas grandes escolas tradicionais de artes e cultura do Paraná: Escola de Música e Belas Artes (EMBAP) e a Faculdade de Artes do Paraná (FAP). Foco integral em formação artística.",
    highlights: "Ingresso pelo próprio Concurso Vestibular Estadual ou pelo Processo Informatizado SISU. Isenção garantida para portadores de CadÚnico PR.",
    logo: "🎨"
  }
];

export const CURITIBA_DEADLINES: EditalDeadline[] = [
  {
    id: "dead-1",
    title: "Matrículas e Lista de Espera SISU UTFPR - Inverno 2026",
    institutionId: "utfpr",
    institutionName: "UTFPR",
    type: "SISU",
    deadlineDate: "22/06/2026 a 29/06/2026",
    status: "abertao",
    officialLink: "https://acessounico.mec.gov.br/sisu",
    description: "Período de matrícula dos aprovados na chamada regular e envio de manifestação de interesse para a lista de espera do SISU de Inverno da UTFPR.",
    requirements: "Ter sido pré-selecionado na chamada regular ou manifestar interesse na lista de espera pelo portal unificado do MEC."
  },
  {
    id: "dead-2",
    title: "Solicitação de Isenção de Taxa - Vestibular UFPR 2027",
    institutionId: "ufpr",
    institutionName: "UFPR",
    type: "Isenção de Taxa",
    deadlineDate: "Encerrado em 20/07/2026",
    status: "encerrado",
    officialLink: "https://servicos.nc.ufpr.br/",
    description: "O prazo para solicitação de isenção de taxa para o Vestibular Geral UFPR 2027 foi encerrado em 20 de Julho de 2026. Acompanhe a publicação do edital geral em Agosto.",
    requirements: "Cursado ensino médio na rede pública (ou bolsista 100% privada) e renda per capita menor que 1,5 salário mínimo."
  },
  {
    id: "dead-3",
    title: "Vestibular de Verão PUCPR 2027 - Próximo Ciclo",
    institutionId: "pucpr",
    institutionName: "PUCPR",
    type: "Vestibular",
    deadlineDate: "Previsão de Abertura: Outubro/2026",
    status: "por_vir",
    officialLink: "https://vestibular.pucpr.br/",
    description: "O Vestibular de Inverno PUCPR 2026 está encerrado. O próximo ciclo de admissões da PUCPR será o Vestibular de Verão 2027, com opções de ingresso via Prova Geral Presencial, Prova Agendada Online ou aproveitamento da nota do ENEM.",
    requirements: "Candidatos portadores de certificado de conclusão do Ensino Médio."
  },
  {
    id: "dead-4",
    title: "Editais e Abertura do Vestibular Geral UFPR 2027",
    institutionId: "ufpr",
    institutionName: "UFPR",
    type: "Vestibular",
    deadlineDate: "Abertura em 15/08/2026",
    status: "por_vir",
    officialLink: "https://servicos.nc.ufpr.br/",
    description: "Lançamento oficial do edital completo com o guia de leituras literárias obrigatórias, distribuição de vagas por cotas e início do período de inscrições.",
    requirements: "Consulta aberta a todos. Leituras obrigatórias recomendadas: Machado de Assis, Helena Kolody, Clarice Lispector."
  },
  {
    id: "dead-5",
    title: "Bolsas Sociais de Estudo UniPositivo 2026.2",
    institutionId: "positivo",
    institutionName: "Universidade Positivo",
    type: "Bolsas & ProUni",
    deadlineDate: "Abertura em 01/07/2026",
    status: "por_vir",
    officialLink: "https://www.up.edu.br/bolsas-e-financiamento/",
    description: "Processo seletivo simplificado para concessão de bolsas de estudo de 50% e 100% em cursos de engenharia, arquitetura e tecnologia pelo ENEM.",
    requirements: "Notas médias do ENEM superiores a 600 pontos nos últimos 3 anos."
  },
  {
    id: "dead-6",
    title: "Isenção de Inscrição Vestibular de Elite IFPR",
    institutionId: "ifpr",
    institutionName: "IFPR",
    type: "Isenção de Taxa",
    deadlineDate: "Encerrado em 25/05/2026",
    status: "encerrado",
    officialLink: "https://reitoria.ifpr.edu.br/processos-seletivos/",
    description: "Período para submissão de documentos comprobatórios para dispensa de taxa nos cursos Superiores e de Especialização Tecnológica do IFPR.",
    requirements: "Documentação comprobatória de renda familiar ou declaração CadÚnico ativa."
  },
  {
    id: "dead-7",
    title: "Inscrições Vestibular Especial de Música EMBAP UNESPAR",
    institutionId: "unespar",
    institutionName: "UNESPAR (EMBAP)",
    type: "Vestibular",
    deadlineDate: "Encerrado em 30/04/2026",
    status: "encerrado",
    officialLink: "https://vestibular.unespar.edu.br/",
    description: "Provas de Habilidade Específica (THE) de instrumento e percepção musical para seleção de novos estudantes de Música Erudita e Canto Lírico.",
    requirements: "Necessário envio prévio de gravação de vídeo tocando a peça obrigatória."
  }
];

export const CAREER_AREAS: CareerArea[] = [
  {
    id: "car-1",
    name: "Engenharia de Software & TI",
    category: "Engenharias & TI",
    description: "Desenvolvimento de sistemas computacionais, inteligência artificial, segurança de dados e aplicações web. Curitiba é um dos maiores polos tecnológicos do país, contando com o Vale do Pinhão, dezenas de aceleradoras e centenas de startups que demandam milhares de desenvolvedores.",
    skills: ["Lógica de Programação", "Resolução de Problemas", "Trabalho em Equipe", "Inglês Técnico", "Familiaridade com Bancos de Dados"],
    salariesCuritiba: "R$ 3.800 (Júnior) a R$ 14.500 (Sênior)",
    institutionsOffering: ["UTFPR", "UFPR", "PUCPR", "OPET", "Universidade Positivo", "IFPR"],
    iconName: "Binary"
  },
  {
    id: "car-2",
    name: "Medicina, Biomedicina e Saúde Humana",
    category: "Saúde & Biológicas",
    description: "Diagnóstico, tratamento e prevenção de patologias, bem como pesquisa laboratorial e farmacêutica. Sendo Curitiba polo de excelência médica e com hospitais escola modelo (Hospital de Clínicas da UFPR, Hospital Pequeno Príncipe e Hospital Cajuru da PUCPR), a área tem altos índices de colocação.",
    skills: ["Empatia profunda", "Gosto por biologia e química", "Altíssima capacidade sob pressão", "Ética profissional", "Estudo vitalício"],
    salariesCuritiba: "R$ 8.500 (Início de carreira clínica) até R$ 22.000 (Especialistas)",
    institutionsOffering: ["UFPR", "PUCPR", "Universidade Positivo", "FPP (Faculdades Pequeno Príncipe)", "Evangélica Mackenzie"],
    iconName: "Stethoscope"
  },
  {
    id: "car-3",
    name: "Design de Animação e Cinema e Audiovisual",
    category: "Humanas & Artes",
    description: "Criação de marcas, design industrial, produção cinematográfica, animação digital e economia criativa. Curitiba é uma cidade muito reconhecida por sua identidade visual, design urbano e abriga festivais renomados (como Olhar de Cinema e Festival de Teatro de Curitiba).",
    skills: ["Sensibilidade e percepção visual", "Dominar softwares 3D/Adobe", "Criatividade extrema", "Storytelling", "Análise estética"],
    salariesCuritiba: "R$ 3.200 (Designer Pleno) a R$ 8.200 (Diretor de Arte)",
    institutionsOffering: ["UNESPAR (FAP)", "UFPR", "PUCPR", "Universidade Positivo", "UTFPR (Design Industrial)"],
    iconName: "Palette"
  },
  {
    id: "car-4",
    name: "Administração de Empresas e Finanças Corporativas",
    category: "Negócios & Ciências Sociais",
    description: "Gestão de recursos estratégicos, planejamento governamental, consultoria financeira, marketing digital e inteligência de negócios. Essencial para sustentar o pujante ecossistema empresarial e o setor de comércio e serviços curitibanos.",
    skills: ["Comunicação fluida", "Perfil orientado a metas", "Capacidade analítica e matemática", "Liderança", "Gestão de tempo"],
    salariesCuritiba: "R$ 4.000 (Analista Administrativo) a R$ 12.000 (Gerente Geral)",
    institutionsOffering: ["UFPR", "UTFPR", "PUCPR", "Universidade Positivo", "UniAndrade", "Fesp"],
    iconName: "TrendingUp"
  },
  {
    id: "car-5",
    name: "Arquitetura, Urbanismo e Mobilidade Sustentável",
    category: "Engenharias & TI",
    description: "Planejamento habitacional, paisagismo, design de interiores e mobilidade integrada. Característica histórica forte de Curitiba, referência em planejamento urbano sustentável no mundo com seu sistema de BRT (canaletas expressas e ônibus tubo).",
    skills: ["Desenho técnico e espacial", "Interesse em sustentabilidade", "Legislação urbana", "Domínio de CAD/BIM", "Aparato histórico e estético"],
    salariesCuritiba: "R$ 5.200 (Arquiteto sob sindicato) a R$ 10.500 (Coordenador de Projetos)",
    institutionsOffering: ["UFPR", "PUCPR", "Universidade Positivo", "UTPF-PR (Urbanismo)"],
    iconName: "Map"
  }
];
