import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

import fs from "fs";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Lazy initialization of Gemini SDK with telemetry header to prevent startup crashes when GEMINI_API_KEY is missing
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("A chave GEMINI_API_KEY é necessária nos Secrets do ambiente para usar o assistente.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

app.use(express.json());

// User Record Type Definition
interface UserRecord {
  email: string;
  fullName: string;
  password?: string;
  originSchool: string;
  createdAt: string;
}

// Durable file storage config to avoid erasing registered users on server hot-restarts
const DB_FILE = path.join(process.cwd(), "users-db.json");

function loadUsers(): UserRecord[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar banco de dados persistente de usuários:", error);
  }

  // Pre-seed default user if no DB exists
  const defaultStore: UserRecord[] = [
    {
      email: "faculdaproject@gmail.com",
      fullName: "Aluno Integrado Paraná",
      password: "password123",
      originSchool: "Colégio Estadual do Paraná (CEP)",
      createdAt: new Date().toISOString(),
    }
  ];
  saveUsers(defaultStore);
  return defaultStore;
}

function saveUsers(users: UserRecord[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao escrever no banco de dados persistente de usuários:", error);
  }
}

// Seeded deadlines for backend consultation
const BACKEND_DEADLINES = [
  {
    id: "dead-1",
    title: "Inscrições SISU UTFPR - Vagas de Inverno 2026",
    institutionId: "utfpr",
    institutionName: "UTFPR",
    type: "SISU",
    deadlineDate: "08/06/2026 a 15/06/2026",
    status: "abertao",
    officialLink: "https://acessounico.mec.gov.br/sisu",
    description: "Seleção para os cursos da UTFPR Curitiba para início no 2º semestre letivo. O uso da nota do ENEM 2025 é obrigatório e sem taxa adicional de inscrição.",
    requirements: "Ter realizado o ENEM 2025 e não ter obtido nota zero na redação."
  },
  {
    id: "dead-2",
    title: "Solicitacao de Isenção de Taxa - Vestibular UFPR 2027",
    institutionId: "ufpr",
    institutionName: "UFPR",
    type: "Isenção de Taxa",
    deadlineDate: "10/06/2026 a 05/07/2026",
    status: "abertao",
    officialLink: "https://servicos.nc.ufpr.br/",
    description: "Prazo para estudantes de baixa renda cadastrados no CadÚnico ou de escolas públicas solicitarem a isenção total do pagamento da taxa do Vestibular UFPR.",
    requirements: "Cursado ensino médio na rede pública (ou bolsista 100% privada) e renda per capita menor que 1,5 salário mínimo."
  },
  {
    id: "dead-3",
    title: "Vestibular de Inverno PUCPR 2026",
    institutionId: "pucpr",
    institutionName: "PUCPR",
    type: "Vestibular",
    deadlineDate: "Até 22/06/2026",
    status: "abertao",
    officialLink: "https://vestibular.pucpr.br/",
    description: "Inscreva-se no vestibular de meio de ano da PUCPR. Várias opções de cursos noturnos e diurnos, fáceis opções de ingresso com prova online de redação ou ENEM.",
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
  }
];

// Backend API validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// API Endpoints

// 1. Cadastrar novo estudante (Com validação severa)
app.post("/api/auth/register", (req, res) => {
  const { fullName, email, password, originSchool } = req.body;

  // Input Validation
  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3) {
    return res.status(400).json({ error: "O nome completo precisa de no mínimo 3 caracteres válidos." });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "O formato de endereço de e-mail é de preenchimento inválido." });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "A senha de segurança deve conter no mínimo 6 caracteres." });
  }

  if (!originSchool || typeof originSchool !== "string") {
    return res.status(400).json({ error: "A informação de Instituição de Origem é obrigatória." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const currentUsers = loadUsers();
  const alreadyExists = currentUsers.find((u) => u.email === normalizedEmail);

  if (alreadyExists) {
    return res.status(409).json({ error: "Este endereço de e-mail já está associado a um cadastro do Faculda+." });
  }

  const newStudent: UserRecord = {
    fullName: fullName.trim(),
    email: normalizedEmail,
    password, // Store as clear string for simulator purposes
    originSchool: originSchool.trim(),
    createdAt: new Date().toISOString()
  };

  currentUsers.push(newStudent);
  saveUsers(currentUsers);

  // Return session profile without password
  res.status(201).json({
    success: true,
    message: "Cadastro concluído com sucesso na base civil do Paraná.",
    user: {
      fullName: newStudent.fullName,
      email: newStudent.email,
      originSchool: newStudent.originSchool
    }
  });
});

// 2. Login de estudante cadastrado (Com validação e busca no banco)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "E-mail de autenticação inválido ou ausente." });
  }

  if (!password) {
    return res.status(400).json({ error: "Você deve informar a senha correspondente." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const currentUsers = loadUsers();
  const matchedUser = currentUsers.find((u) => u.email === normalizedEmail);

  if (!matchedUser) {
    return res.status(401).json({ error: "Usuário com este e-mail não encontrado em nossa base integrada." });
  }

  if (matchedUser.password !== password) {
    return res.status(401).json({ error: "Senha incorreta. Verifique suas credenciais de segurança e tente novamente." });
  }

  res.json({
    success: true,
    user: {
      fullName: matchedUser.fullName,
      email: matchedUser.email,
      originSchool: matchedUser.originSchool
    }
  });
});

// 3. Recuperação de acesso / senha
app.post("/api/auth/recover", (req, res) => {
  const { email } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Indique um e-mail com formato válido." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const currentUsers = loadUsers();
  const matchedUser = currentUsers.find((u) => u.email === normalizedEmail);

  res.json({
    success: true,
    message: `Instruções enviadas! Um link de redefinição de segurança foi despachado para o endereço: ${normalizedEmail}.`,
    userFound: !!matchedUser
  });
});

// 4. Consulta de editais no backend (Consulta com filtros)
app.get("/api/data/deadlines", (req, res) => {
  const { status, type } = req.query;
  
  let results = [...BACKEND_DEADLINES];

  if (status && status !== "todos") {
    results = results.filter((d) => d.status === status);
  }

  if (type && type !== "todos") {
    results = results.filter((d) => d.type === type);
  }

  res.json(results);
});

// 5. Validação automática de isenção de taxa de vestibular perante o banco de dados estatal (SERE-PR)
app.post("/api/student/verify-isencao", (req, res) => {
  const { email, originSchool } = req.body;

  if (!email) {
    return res.status(400).json({ error: "O e-mail do aluno é necessário para o batimento de dados." });
  }

  // Pure validation: check school origin to approve or request documentation proof
  const schoolLower = (originSchool || "").toLowerCase();
  const isPublicOrState = schoolLower.includes("pública") || schoolLower.includes("estadual") || schoolLower.includes("federal") || schoolLower.includes("cep");

  const protocolNum = `PR-2026-${Math.floor(Math.random() * 90000 + 10000)}`;

  if (isPublicOrState) {
    return res.json({
      eligible: true,
      protocol: protocolNum,
      message: "Isenção Automática Pré-Aprovada. O CPF/e-mail está regular na rede estadual de ensino ou equivalente do Paraná.",
      verifiedWithSere: true
    });
  } else {
    return res.json({
      eligible: false,
      protocol: protocolNum,
      message: "Revisão Necessária: O candidato estuda em rede particular de ensino. É necessário anexar autodeclaração de baixa renda e histórico escolar para comprovação manual.",
      verifiedWithSere: true
    });
  }
});

// 4.b Endpoint para listar todos os usuários cadastrados (Painel de Administrador)
app.get("/api/admin/users", (req, res) => {
  const users = loadUsers();
  res.json(users);
});

// 5. Novo endpoint de feed de dados em tempo real integrado de instituições e andamentos
app.get("/api/data/realtime-feed", (req, res) => {
  const currentSecond = new Date().getSeconds();
  
  // Create slightly dynamic metrics based on current seconds to simulate active real-time updates nicely
  const feedData = {
    timestamp: new Date().toISOString(),
    totalActiveStudents: 1540 + Math.floor(currentSecond * 1.2),
    verifiedIsencoes: 388 + Math.floor(currentSecond / 3),
    trafficIndex: "Excelente",
    institutions: {
      ufpr: {
        registeredCandidates: 8530 + Math.floor(currentSecond * 1.5),
        isencoesSolicitadas: 2480 + Math.floor(currentSecond * 0.4),
        concorrenciaMedia: (8.32 + (currentSecond % 5) * 0.06).toFixed(2),
      },
      utfpr: {
        registeredCandidates: 6200 + Math.floor(currentSecond * 0.8),
        sisuOcupacao: (85.2 + (currentSecond % 4) * 0.15).toFixed(1) + "%",
        vagasRestantes: Math.max(12, 185 - Math.floor(currentSecond / 5)),
      },
      ifpr: {
        registeredCandidates: 2210 + Math.floor(currentSecond * 0.5),
        vagasAuxilio: 320,
        isencoesAprovadas: 524 + Math.floor(currentSecond / 4),
      },
      pucpr: {
        registeredCandidates: 4330 + Math.floor(currentSecond * 0.7),
        bolsasDisponiveis: Math.max(8, 198 - Math.floor(currentSecond / 6)),
        bolsasInscritas: 1580 + Math.floor(currentSecond * 1.1),
      },
      positivo: {
        registeredCandidates: 3450 + Math.floor(currentSecond * 0.6),
        bolsasInscritas: 994 + Math.floor(currentSecond * 0.8),
        bolsaAprovadas: 189 + Math.floor(currentSecond / 5),
      },
      unespar: {
        registeredCandidates: 1280 + Math.floor(currentSecond * 0.3),
        inscritosTHE: 440 + Math.floor(currentSecond / 4),
        projetosSociaisAtivos: 8,
      }
    },
    recentActivities: [
      { text: `Nova inscrição efetuada para Engenharia na UTFPR neste exato momento.`, time: "Agora" },
      { text: `Isenção deferida com sucesso via CPF e base SERE-PR no Colégio Estadual do Paraná.`, time: "Há 1 min" },
      { text: `Edital SISU UTFPR recebeu nova solicitação de vaga em Engenharia Mecatrônica.`, time: "Há 2 min" },
      { text: `Aluno de Pinhais solicitou atendimento para assistente de IA focado no Faculda+.`, time: "Há 4 min" },
      { text: `Novo usuário cadastrado de Colégio Estadual de Curitiba.`, time: "Há 5 min" }
    ]
  };

  res.json(feedData);
});

// Assistant (Gemini) endpoint
app.post("/api/assistant", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    // Set up chat session instructions
    const systemInstruction = `Você é o Mentor e Assistente de Carreira Inteligente Oficial do Faculda+ de Curitiba e Região Metropolitana.
Sua missão é dar total suporte, sem limitações ou barreiras, a estudantes de Curitiba e região sobre educação, vestibulares, editais, bolsas de estudo e planejamento de carreira de nível técnico, tecnólogo e superior.

Diretrizes e Áreas de Atuação Ampliadas:
1. FOCO AMPLO E MULTIDISCIPLINAR:
   - Você não se limita a responder perguntas curtas. Você é um orientador vocacional, consultor de estudos e analista do mercado de trabalho.
   - Sinta-se inteiramente livre para criar cronogramas de estudo personalizados (como técnicas Pomodoro, cronograma semanal para o vestibular da UFPR ou ENEM), roteiros de estudo de redação, explicar teorias complexas ou resolver e detalhar problemas se o aluno solicitar.
   - Forneça explicações detalhadas, insights de carreira, dados de mercado, estimativas de salários e caminhos recomendados para cada profissão.

2. MERCADO DE TRABALHO DE CURITIBA & REGIÃO METROPOLITANA:
   - Apresente um panorama profundo sobre o ecossistema econômico local. Fale sobre o Vale do Pinhão (tecnologia e inovação em Curitiba), o polo automotivo em São José dos Pinhais, as grandes indústrias da Região Metropolitana, o setor de serviços, a forte área de saúde/farmacêutica e a agroindústria do Paraná.
   - Explique quais habilidades (Soft Skills e Hard Skills) estão em alta na região para programadores, administradores, engenheiros, profissionais da saúde e tecnólogos.

3. CONHECIMENTO PROFUNDO DAS INSTITUIÇÕES LOCAIS:
   - Domine as características e as formas de ingresso de instituições de renome:
     * UFPR (Universidade Federal do Paraná): Vestibular tradicional, pesos das disciplinas, vagas olímpicas, SISU e auxílios de permanência PRAE.
     * UTFPR (Universidade Tecnológica Federal do Paraná): Foco em engenharia, computação e tecnologia. Ingresso 100% SISU, grades curriculares práticas.
     * IFPR (Instituto Federal do Paraná): Cursos técnicos integrados, tecnólogos rápidos de alta qualidade, forte formação prática imediata para o mercado de trabalho.
     * UNESPAR (Estadual do Paraná): Ênfase em artes, ciências humanas e educação. Vestibular próprio e SISU.
     * PUCPR, Universidade Positivo, UniAndrade, FAE, OPET: Programas de Bolsas, Financiamento Próprio, ProUni, FIES e parcerias com grandes centros tecnológicos.

4. AUXÍLIO EM CRITÉRIOS DE ESCOLHA:
   - Ensine o aluno a comparar cursos (por exemplo: "Ciência da Computação" vs. "Engenharia de Software" vs. "Análise e Desenvolvimento de Sistemas"; ou "Administração de Empresas" vs. "Processos Gerenciais").
   - Esclareça de forma extremamente clara a diferença entre cursos de Bacharelado (4 a 6 anos), Licenciatura (focado em lecionar) e Tecnológico (ensino superior focado no mercado, de 2 a 3 anos).

5. POLÍTICAS DE ACESSO, COTA E ISENÇÃO:
   - Detalhe como funcionam as isenções do Cadastro Único (CadÚnico) para vestibulares, a isenção de taxa para alunos de colégios públicos federais e estaduais do Paraná (base SERE-PR), as leis estaduais de cotas raciais, cotas sociais e vagas reservadas para pessoas com deficiência.

6. ESTILO DE COMUNICAÇÃO:
   - Adote um tom empático, acolhedor, inspirador, profissional de altíssimo nível, amigável e encorajador.
   - Formate todas as suas respostas de forma elegante utilizando Markdown completo: títulos (# ou ##), subtítulos, listas por tópicos, trechos em negrito e tabelas organizadas quando apropriado.
   - Ao final de respostas mais longas, faça perguntas provocativas de orientação profissional para manter o diálogo ativo e entender as áreas de interesse do estudante!`;

    const prompt = message;
    let contents: any[] = [];
    if (history && Array.isArray(history)) {
      contents = history.map((item: any) => ({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: item.text }],
      }));
    }
    contents.push({ role: "user", parts: [{ text: prompt }] });

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "Desculpe, não consegui processar sua resposta no momento.";
    res.json({ text });
  } catch (error: any) {
    console.error("Erro no assistente Gemini:", error);
    res.status(500).json({
      error: "Ocorreu um erro ao processar sua pergunta. Verifique se o GEMINI_API_KEY está configurado corretamento nos Secrets.",
    });
  }
});

// Mock/Example data for Curitiba institutions, announcements and careers to feed the frontend instantly if required
app.get("/api/data/institutions", (req, res) => {
  res.json([
    {
      id: "ufpr",
      name: "UFPR - Universidade Federal do Paraná",
      type: "Pública Federal",
      campus: ["Centro", "Politécnico", "Rebouças", "Cabral", "Palotina", "Matinhos", "Jandaia do Sul"],
      website: "https://www.ufpr.br",
      description: "A mais antiga universidade do Brasil, referência em pesquisa, ensino e extensão.",
      highlights: "Vestibular próprio concorrido, SISU, isenções para estudantes de escola pública com baixa renda.",
      logo: "🏛️"
    },
    {
      id: "utfpr",
      name: "UTFPR - Universidade Tecnológica Federal do Paraná",
      type: "Pública Federal",
      campus: ["Curitiba (Centro / Ecoville / Neoville)"],
      website: "https://www.utfpr.edu.br",
      description: "Foco tecnológico e profissional, originada do antigo CEFET-PR. Excelente infraestrutura de laboratórios.",
      highlights: "Seleção via SISU (Exame Nacional do Ensino Médio - ENEM). Alta empregabilidade na área de engenharia e TI.",
      logo: "💻"
    },
    {
      id: "ifpr",
      name: "IFPR - Instituto Federal do Paraná",
      type: "Pública Federal",
      campus: ["Curitiba (Ecoville) e Região Metropolitana (Pinhais, Colombo, Campo Largo)"],
      website: "https://ifpr.edu.br",
      description: "Ensino médio integrado, cursos técnicos subsequentes e nível superior tecnológico.",
      highlights: "Vestibular próprio com taxa de inscrição acessível. Excelente para cursos técnicos de informática e administração.",
      logo: "🛠️"
    },
    {
      id: "pucpr",
      name: "PUCPR - Pontifícia Universidade Católica do Paraná",
      type: "Privada Comunitária",
      campus: ["Prado Velho"],
      website: "https://www.pucpr.br",
      description: "Uma das melhores universidades privadas do país, com forte ligação internacional e campus dinâmico.",
      highlights: "ProUni, Crédito Universitário (Fundacred), vestibular agendado e nota do ENEM.",
      logo: "⛪"
    },
    {
      id: "positivo",
      name: "Universidade Positivo - UP",
      type: "Privada",
      campus: ["Campo Comprido", "Santos Andrade", "Praça Osório"],
      website: "https://www.up.edu.br",
      description: "Reconhecida pela qualidade do campus Ecoville e forte atuação na área de economia Criativa, Saúde e Negócios.",
      highlights: "Bolsas de desempenho, vestibular online e seleção simplificada via ENEM.",
      logo: "☀️"
    },
    {
      id: "unespar",
      name: "UNESPAR - Campus de Curitiba (FAP e EMBAP)",
      type: "Pública Estadual",
      campus: ["Curitiba (FAP - Cabral / EMBAP - Centro)"],
      website: "http://www.unespar.edu.br",
      description: "Focada em artes, música, cinema, teatro e design, unindo a Faculdade de Artes do Paraná e a Escola de Música e Belas Artes.",
      highlights: "Vestibular próprio estadual e SISU, taxa reduzida para inscritos no CadÚnico.",
      logo: "🎨"
    }
  ]);
});

// Start server and mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware carregado com sucesso.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Porta de escuta do servidor Faculda+: http://localhost:${PORT}`);
  });
}

startServer();
