import React, { useState, useMemo } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  Coins, 
  ThumbsUp, 
  Compass, 
  ArrowRight, 
  Binary, 
  Stethoscope, 
  Palette, 
  TrendingUp, 
  Map, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Lightbulb,
  Search,
  HelpCircle,
  FileText,
  ClipboardList
} from "lucide-react";
import { CareerArea } from "../types";

// Dynamic map to translate string icons to Lucide components
const IconMap: { [key: string]: React.ComponentType<any> } = {
  Binary: Binary,
  Stethoscope: Stethoscope,
  Palette: Palette,
  TrendingUp: TrendingUp,
  Map: Map,
};

interface TabOrientacaoProps {
  careerAreas: CareerArea[];
  initialChatHistory?: any[]; // Ignored, kept for prop compatibility
  onSendMessage?: (message: string) => Promise<string>; // Ignored, kept for prop compatibility
}

export default function TabOrientacao({ careerAreas }: TabOrientacaoProps) {
  const [selectedCareer, setSelectedCareer] = useState<CareerArea | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"quiz" | "dicas">("quiz");

  // Quiz State
  const [quizStep, setQuizStep] = useState<"welcome" | 1 | 2 | 3 | "result">("welcome");
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});

  const filteredCareers = useMemo(() => {
    return careerAreas.filter((career) =>
      career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [careerAreas, searchTerm]);

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      question: "Qual o seu estilo favorito para resolver problemas cotidianos?",
      options: [
        { label: "Projetar lógicas, programar ou mexer com ferramentas digitais complexas.", value: "Engenharias & TI" },
        { label: "Cuidar do bem-estar das pessoas, biologia ou pesquisar a cura de enfermidades.", value: "Saúde & Biológicas" },
        { label: "Expressar ideias artisticamente, criar designs, filmar ou escrever narrativas.", value: "Humanas & Artes" },
        { label: "Gerenciar projetos, analisar finanças, liderar equipes ou traçar estratégias.", value: "Negócios & Ciências Sociais" },
      ],
    },
    {
      id: 2,
      question: "Qual seria o seu ambiente profissional mais estimulante?",
      options: [
        { label: "Uma startup inovadora de TI ou espaço de desenvolvimento moderno.", value: "Engenharias & TI" },
        { label: "Um hospital universitário, clínica médica de ponta ou centro de pesquisas.", value: "Saúde & Biológicas" },
        { label: "Um estúdio criativo, agência de publicidade, teatro ou set de filmagem.", value: "Humanas & Artes" },
        { label: "O centro corporativo de uma grande empresa ou assessoria de investimentos.", value: "Negócios & Ciências Sociais" },
      ],
    },
    {
      id: 3,
      question: "Se pudesse dominar uma grande habilidade hoje, qual escolheria?",
      options: [
        { label: "Arquitetura de sistemas integrados, código limpo e inteligência artificial.", value: "Engenharias & TI" },
        { label: "Diagnóstico preciso, empatia com o paciente e procedimentos biológicos.", value: "Saúde & Biológicas" },
        { label: "Direção de arte, computação gráfica, design espacial ou narrativa visual.", value: "Humanas & Artes" },
        { label: "Liderança corporativa, finanças aplicadas, negociação e metas globais.", value: "Negócios & Ciências Sociais" },
      ],
    },
  ];

  const handleAnswerSelect = (questionId: number, value: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (questionId < 3) {
      setQuizStep((questionId + 1) as any);
    } else {
      setQuizStep("result");
    }
  };

  const getQuizResult = () => {
    // Count occurrences of categories chosen
    const counts: { [key: string]: number } = {};
    (Object.values(quizAnswers) as string[]).forEach((cat) => {
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Find the category with maximum score
    let bestCategory = "Engenharias & TI";
    let maxCount = 0;
    Object.entries(counts).forEach(([cat, val]) => {
      if (val > maxCount) {
        maxCount = val;
        bestCategory = cat;
      }
    });

    // Match with one career in that category
    const matchingCareers = careerAreas.filter(c => c.category === bestCategory);
    return matchingCareers.length > 0 ? matchingCareers[0] : careerAreas[0];
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizStep("welcome");
  };

  // Static Local Tips for Vestibular
  const studyTips = [
    {
      title: "Dominando as Obras Literárias UFPR",
      desc: "A UFPR cobra anualmente uma lista específica de leituras obrigatórias. Não dependa apenas de resumos rápidos: faça fichamentos comparativos dos temas sociais e políticos abordados por autores clássicos e contemporâneos indicados pelo edital.",
      tag: "UFPR",
      color: "border-blue-200 bg-blue-50 text-blue-800"
    },
    {
      title: "Foco nas Provas Discursivas e Redação",
      desc: "Na segunda fase da UFPR e nos principais vestibulares do PR, a redação e as questões discursivas de disciplinas específicas têm peso altíssimo. Pratique a síntese de respostas científicas e argumentações claras de no máximo 5 a 10 linhas.",
      tag: "Técnica",
      color: "border-amber-200 bg-amber-50 text-amber-800"
    },
    {
      title: "Isenções e CadÚnico no Paraná",
      desc: "Tanto UFPR quanto UTFPR e UNESPAR possuem janelas exclusivas de isenção de taxa para inscritos no Cadastro Único federal ou estudantes de escolas públicas com renda per capita baixa. Atente-se aos prazos que abrem semanas antes da inscrição geral!",
      tag: "Finanças",
      color: "border-emerald-200 bg-emerald-50 text-emerald-800"
    },
    {
      title: "Familiarize-se com o Modelo de Prova UTFPR",
      desc: "A UTFPR voltou a realizar vestibular próprio recentemente com um modelo focado em raciocínio analítico, ciências exatas e redação estruturada. Revise as últimas 3 provas anteriores para mapear a distribuição de temas cobrados.",
      tag: "UTFPR",
      color: "border-purple-200 bg-purple-50 text-purple-800"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="orientacao-panel">
      {/* Intro Header Card */}
      <div className="bg-gradient-to-r from-[#002f6c] to-[#0c234a] p-6 rounded-lg text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight m-0 text-white flex items-center gap-2">
            <Compass className="text-amber-400" size={24} />
            Guia de Orientação Profissional & Planejamento de Carreira
          </h2>
          <p className="text-slate-300 text-xs font-light mt-1.5 max-w-2xl leading-relaxed">
            Analise salários médios locais de Curitiba, mapeie as principais universidades paranaenses públicas e comunitárias, descubra habilidades recomendadas e monte seu cronograma de estudos focado no seu perfil acadêmico.
          </p>
        </div>
        <div className="shrink-0">
          <button 
            onClick={resetQuiz} 
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs transition shadow-sm flex items-center gap-1.5"
          >
            <ClipboardList size={14} />
            Refazer Teste Vocacional
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: List of Careers (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col h-full">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 m-0 flex items-center gap-2">
                <Briefcase className="text-[#002f6c]" size={16} />
                Áreas Estratégicas em Curitiba
              </h3>
              <p className="text-[11px] text-slate-500 font-light mt-1">
                Selecione uma área abaixo para ver o relatório completo de mercado, salários e faculdades recomendadas.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar áreas por título ou categoria..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#002f6c] transition"
              />
              <Search className="absolute left-3 top-2 text-slate-400" size={14} />
            </div>

            {/* Careers List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1" id="careers-list">
              {filteredCareers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-light">
                  Nenhuma área de carreira encontrada com os termos digitados.
                </div>
              ) : (
                filteredCareers.map((career) => {
                  const CustomIcon = IconMap[career.iconName] || Compass;
                  const isSelected = selectedCareer?.id === career.id;

                  return (
                    <div
                      key={career.id}
                      onClick={() => setSelectedCareer(career)}
                      className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "border-[#002f6c] bg-[#002f6c]/5 ring-1 ring-[#002f6c]"
                          : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded transition-colors ${
                          isSelected ? "bg-[#002f6c] text-white" : "bg-slate-100 text-[#002f6c] group-hover:bg-slate-200"
                        }`}>
                          <CustomIcon size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 m-0 group-hover:text-[#002f6c] transition-colors">
                            {career.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-light mt-0.5 block">
                            {career.category}
                          </span>
                        </div>
                      </div>
                      <ArrowRight 
                        size={12} 
                        className={`text-slate-400 group-hover:translate-x-0.5 transition-transform ${
                          isSelected ? "text-[#002f6c]" : ""
                        }`} 
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Clear Selection helper if selected */}
            {selectedCareer && (
              <button
                onClick={() => setSelectedCareer(null)}
                className="mt-4 w-full py-1.5 border border-dashed border-slate-200 hover:border-slate-400 text-slate-600 rounded text-[11px] font-medium transition text-center"
              >
                Voltar para o Painel Inicial / Teste de Afinidade
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Panel / Career Detail (lg:col-span-7) */}
        <div className="lg:col-span-7">
          {selectedCareer ? (
            /* DETAILED VIEW */
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-5 animate-scale-up h-full">
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#002f6c]/10 text-[#002f6c] px-2 py-0.5 rounded">
                    {selectedCareer.category}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-2 mb-1">
                  Ficha de Orientação: {selectedCareer.name}
                </h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  {selectedCareer.description}
                </p>
              </div>

              {/* Grid 1: Local Salaries & Study Locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Salaries Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center space-x-2 text-[#002f6c] font-bold text-xs">
                    <Coins size={15} />
                    <span>Média Salarial Local (Curitiba)</span>
                  </div>
                  <p className="text-xs font-extrabold text-[#0b4885] font-mono">
                    {selectedCareer.salariesCuritiba}
                  </p>
                  <span className="text-[9px] text-slate-400 block font-light">
                    *Média engloba contratações CLT na região metropolitana de Curitiba e Vale do Pinhão.
                  </span>
                </div>

                {/* Institutions Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center space-x-2 text-indigo-950 font-bold text-xs">
                    <GraduationCap size={15} />
                    <span>Onde cursar em Curitiba</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedCareer.institutionsOffering.map((inst, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-700"
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-400 block font-light">
                    Opções públicas com isenção total e privadas com acesso facilitado pelo ProUni/Fies.
                  </span>
                </div>
              </div>

              {/* Skills Card */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Habilidades & Competências Mais Valorizadas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCareer.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-emerald-50/50 border border-emerald-100 p-2 rounded text-xs text-slate-700">
                      <CheckCircle2 className="text-emerald-600 shrink-0" size={13} />
                      <span className="font-light">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by Step Action Plan for Vestibulando */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-500 animate-pulse" />
                  Plano de Ação Sugerido para Ingressar nesta Área
                </h4>
                
                <ol className="text-xs text-slate-600 space-y-2.5 list-decimal list-inside pl-1 font-light leading-relaxed">
                  <li>
                    <strong className="text-slate-800 font-semibold">Mapeie as Provas de Inverno e Verão:</strong> Confira na aba <span className="font-semibold text-[#002f6c] underline">Editais</span> se a UFPR ou a UTFPR estão com inscrições de vestibular próprio abertas ou se o SISU será a principal porta de entrada.
                  </li>
                  <li>
                    <strong className="text-slate-800 font-semibold">Solicite Isenção Preventiva:</strong> Fique de olho no período de CadÚnico de cada universidade (geralmente meses antes da aplicação da prova oficial) para economizar na taxa de inscrição.
                  </li>
                  <li>
                    <strong className="text-slate-800 font-semibold">Foque em Conteúdos Específicos:</strong> Se a sua área exige segunda fase (ex: Matemática e Física para Engenharia de Software, ou Biologia e Química para Medicina), comece a resolver provas anteriores desde já para dominar o padrão discursivo paranaense.
                  </li>
                </ol>
              </div>

              <div className="bg-amber-50 rounded border border-amber-200/60 p-3 text-amber-900 text-[11px] font-light flex gap-2">
                <span className="text-base select-none">📌</span>
                <p className="m-0 leading-relaxed">
                  Para sanar dúvidas adicionais específicas de cada instituição ou baixar apostilas e provas anteriores resolvidas, consulte o site oficial da universidade de sua escolha clicando na aba de <span className="font-bold underline">Instituições</span> do portal.
                </p>
              </div>
            </div>
          ) : (
            /* ONBOARDING PANEL WITH QUIZ / ADVICE TABS */
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full min-h-[500px]">
              {/* Tabs selector */}
              <div className="flex border-b border-slate-100 bg-slate-50 text-xs">
                <button
                  onClick={() => setActiveTab("quiz")}
                  className={`flex-1 py-3 text-center font-bold tracking-wide transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                    activeTab === "quiz"
                      ? "border-[#002f6c] text-[#002f6c] bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                  }`}
                >
                  <ClipboardList size={14} />
                  Teste de Afinidade Profissional
                </button>
                <button
                  onClick={() => setActiveTab("dicas")}
                  className={`flex-1 py-3 text-center font-bold tracking-wide transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                    activeTab === "dicas"
                      ? "border-[#002f6c] text-[#002f6c] bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                  }`}
                >
                  <BookOpen size={14} />
                  Dicas e Planejamento Acadêmico
                </button>
              </div>

              {/* Panel body */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                {activeTab === "quiz" ? (
                  /* QUIZ CARD */
                  <div className="space-y-4 animate-fade-in flex flex-col justify-between h-full">
                    {quizStep === "welcome" && (
                      <div className="text-center py-6 space-y-4 my-auto">
                        <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 text-[#002f6c] flex items-center justify-center animate-bounce">
                          <HelpCircle size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 m-0">
                            Não tem certeza de qual carreira seguir?
                          </h4>
                          <p className="text-xs text-slate-500 font-light max-w-md mx-auto leading-relaxed">
                            Responda a 3 perguntas rápidas e encontre a área profissional em nosso guia que mais combina com seu perfil e objetivos acadêmicos.
                          </p>
                        </div>
                        <button
                          onClick={() => setQuizStep(1)}
                          className="px-6 py-2 bg-[#002f6c] hover:bg-[#001d44] text-white text-xs font-bold rounded shadow-sm transition"
                        >
                          Iniciar Teste Rápido
                        </button>
                      </div>
                    )}

                    {typeof quizStep === "number" && (
                      <div className="space-y-4 my-auto animate-fade-in">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                            Questão {quizStep} de 3
                          </span>
                          <div className="flex gap-1">
                            {[1, 2, 3].map((step) => (
                              <div 
                                key={step} 
                                className={`w-4 h-1.5 rounded-full ${
                                  step === quizStep 
                                    ? "bg-[#002f6c]" 
                                    : step < quizStep 
                                      ? "bg-slate-300" 
                                      : "bg-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <h4 className="text-xs font-extrabold text-slate-850 leading-relaxed block border-l-2 border-[#002f6c] pl-2.5">
                          {quizQuestions[quizStep - 1].question}
                        </h4>

                        <div className="space-y-2 pt-2">
                          {quizQuestions[quizStep - 1].options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleAnswerSelect(quizStep, opt.value)}
                              className="w-full text-left p-3 border border-slate-150 rounded-lg text-xs hover:border-[#002f6c] hover:bg-slate-50/50 cursor-pointer transition font-light text-slate-700 flex items-center justify-between group"
                            >
                              <span>{opt.label}</span>
                              <ArrowRight size={12} className="text-slate-300 group-hover:text-[#002f6c] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {quizStep === "result" && (
                      <div className="text-center py-4 space-y-4 my-auto animate-scale-up">
                        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <Award size={24} />
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400">
                            Perfil Identificado!
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 m-0">
                            Área Recomendada: <span className="text-[#002f6c]">{getQuizResult().category}</span>
                          </h4>
                          <p className="text-xs text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
                            Seu estilo de resolução de problemas e aspirações alinham-se fortemente com carreiras focadas em <strong className="text-slate-700">{getQuizResult().name}</strong>.
                          </p>
                        </div>

                        <div className="flex justify-center gap-2 pt-2">
                          <button
                            onClick={resetQuiz}
                            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded transition"
                          >
                            Tentar Outra Vez
                          </button>
                          <button
                            onClick={() => setSelectedCareer(getQuizResult())}
                            className="px-4 py-2 bg-[#002f6c] hover:bg-[#001d44] text-white text-xs font-bold rounded shadow-sm transition flex items-center gap-1"
                          >
                            <span>Ver Ficha Completa</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* EXPERT LOCAL TIPS PANEL */
                  <div className="space-y-4 animate-fade-in flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {studyTips.map((tip, idx) => (
                        <div 
                          key={idx} 
                          className="p-4 rounded-lg border border-slate-100 bg-white shadow-xs space-y-2 hover:border-slate-200 transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${tip.color}`}>
                              {tip.tag}
                            </span>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-800 m-0">
                            {tip.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                            {tip.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100/60 text-slate-600 text-xs font-light flex items-center gap-2.5">
                      <FileText className="text-[#002f6c]" size={16} />
                      <p className="m-0">
                        <strong className="text-slate-800 font-semibold">Dica Extra:</strong> Use as abas do menu superior para navegar e cruzar dados de editais de isenção de taxa com a universidade que oferece sua vaga ideal!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
