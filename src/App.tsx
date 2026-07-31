import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import TabInicio from "./components/TabInicio";
import TabInstituicoes from "./components/TabInstituicoes";
import TabEditais from "./components/TabEditais";
import TabOrientacao from "./components/TabOrientacao";
import TabAdmin from "./components/TabAdmin";

import { CURITIBA_INSTITUTIONS, CURITIBA_DEADLINES, CAREER_AREAS } from "./data";
import { Institution, EditalDeadline, CareerArea, ChatMessage, UserSession } from "./types";
import { ShieldCheck, Info, X, ExternalLink, RefreshCw, Send, CheckCircle2 } from "lucide-react";

export default function App() {
  // Page routing
  const [activeTab, setActiveTab] = useState<"inicio" | "instituicoes" | "editais" | "orientacao" | "admin">("inicio");
  
  // Accessibility
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);

  // Authentication State with LocalStorage memory persistence
  const [userSession, setUserSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem("guiaestudantil_session");
      if (saved) {
        return { isAuthenticated: true, user: JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Erro ao resgatar session local", e);
    }
    return { isAuthenticated: false, user: null };
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Dynamic institutions state (with local storage persistence)
  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    try {
      const saved = localStorage.getItem("faculda_institutions");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Erro ao resgatar instituicoes locais", e);
    }
    return CURITIBA_INSTITUTIONS;
  });

  const [trashInstitutions, setTrashInstitutions] = useState<Institution[]>(() => {
    try {
      const saved = localStorage.getItem("faculda_trash_institutions");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Erro ao resgatar lixeira local", e);
    }
    return [];
  });

  const handleAddInstitution = (newInst: Institution) => {
    const updated = [...institutions, newInst];
    setInstitutions(updated);
    try {
      localStorage.setItem("faculda_institutions", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInstitution = (id: string) => {
    const instToDelete = institutions.find((inst) => inst.id === id);
    if (!instToDelete) return;
    const updatedActive = institutions.filter((inst) => inst.id !== id);
    const updatedTrash = [...trashInstitutions, instToDelete];
    setInstitutions(updatedActive);
    setTrashInstitutions(updatedTrash);
    try {
      localStorage.setItem("faculda_institutions", JSON.stringify(updatedActive));
      localStorage.setItem("faculda_trash_institutions", JSON.stringify(updatedTrash));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestoreInstitution = (id: string) => {
    const instToRestore = trashInstitutions.find((inst) => inst.id === id);
    if (!instToRestore) return;
    const updatedTrash = trashInstitutions.filter((inst) => inst.id !== id);
    const updatedActive = [...institutions, instToRestore];
    setInstitutions(updatedActive);
    setTrashInstitutions(updatedTrash);
    try {
      localStorage.setItem("faculda_institutions", JSON.stringify(updatedActive));
      localStorage.setItem("faculda_trash_institutions", JSON.stringify(updatedTrash));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePermanentDeleteInstitution = (id: string) => {
    const updatedTrash = trashInstitutions.filter((inst) => inst.id !== id);
    setTrashInstitutions(updatedTrash);
    try {
      localStorage.setItem("faculda_trash_institutions", JSON.stringify(updatedTrash));
    } catch (e) {
      console.error(e);
    }
  };

  // Dynamic state loaded from backend endpoints
  const [deadlines, setDeadlines] = useState<EditalDeadline[]>(CURITIBA_DEADLINES);

  // Modal inspection of Editais
  const [activeDeadlineModal, setActiveDeadlineModal] = useState<EditalDeadline | null>(null);
  
  // Real intelligent application simulation state calling backend validation
  const [submittingIsencao, setSubmittingIsencao] = useState(false);
  const [isencaoSuccess, setIsencaoSuccess] = useState(false);
  const [isencaoResult, setIsencaoResult] = useState<{ protocol: string; message: string; eligible: boolean } | null>(null);

  // Load deadlines dynamically from consultation backend to practice real backend query (consulta de dados)
  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await fetch("/api/data/deadlines");
        if (response.ok) {
          const data = await response.json();
          setDeadlines(data);
        }
      } catch (err) {
        console.error("Erro ao carregar consulta de prazos no backend:", err);
      }
    };
    fetchDeadlines();
  }, []);

  // Real-time updates feed state
  const [realtimeFeed, setRealtimeFeed] = useState<any>({
    timestamp: new Date().toISOString(),
    totalActiveStudents: 1540,
    verifiedIsencoes: 388,
    trafficIndex: "Excelente",
    institutions: {
      ufpr: { registeredCandidates: 8530, isencoesSolicitadas: 2480, concorrenciaMedia: "8.32" },
      utfpr: { registeredCandidates: 6200, sisuOcupacao: "85.2%", vagasRestantes: 185 },
      ifpr: { registeredCandidates: 2210, vagasAuxilio: 320, isencoesAprovadas: 524 },
      pucpr: { registeredCandidates: 4330, bolsasDisponiveis: 198, bolsasInscritas: 1580 },
      positivo: { registeredCandidates: 3450, bolsasInscritas: 994, bolsaAprovadas: 189 },
      unespar: { registeredCandidates: 1280, inscritosTHE: 440, projetosSociaisAtivos: 8 }
    },
    recentActivities: [
      { text: "Conectado com sucesso na base de dados estatal do Paraná.", time: "Agora" }
    ]
  });

  const fetchRealtimeFeed = async () => {
    try {
      const response = await fetch("/api/data/realtime-feed");
      if (response.ok) {
        const data = await response.json();
        setRealtimeFeed(data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados em tempo real do backend:", err);
    }
  };

  // Loop to poll realtime feed updates from backend in real-time every 5 seconds
  useEffect(() => {
    fetchRealtimeFeed(); // initial load
    const interval = setInterval(fetchRealtimeFeed, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load chat initial greeting
  const initialChatHistory: ChatMessage[] = [
    {
      id: "greet-1",
      sender: "assistant",
      text: "Olá! Seja bem-vindo ao portal unificado Faculda+ de Curitiba e Região.\nSua busca por editais, vestibulares públicos, isenção de taxas e escolhas de carreira termina aqui.\n\nComo posso ajudar você hoje em sua jornada de estudos?",
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    },
  ];

  // Callback to communicate server-side Gemini API
  const handleChatSendMessage = async (text: string): Promise<string> => {
    try {
      // Reconstruct simple history representing last 4 messages to optimize token budget
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro de rede no servidor");
      }

      const data = await response.json();
      return data.text;
    } catch (error: any) {
      console.error("Erro na comunicação com o assistente:", error);
      throw error;
    }
  };

  const handleLoginSuccess = (user: { email: string; fullName: string; originSchool?: string }) => {
    const sessionData = {
      email: user.email,
      fullName: user.fullName,
      originSchool: user.originSchool || "Geral",
    };
    try {
      localStorage.setItem("guiaestudantil_session", JSON.stringify(sessionData));
    } catch (e) {
      console.error(e);
    }
    setUserSession({
      isAuthenticated: true,
      user: sessionData,
    });
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("guiaestudantil_session");
    } catch (e) {
      console.error(e);
    }
    setUserSession({
      isAuthenticated: false,
      user: null,
    });
  };

  // Accessibility controllers
  const toggleContrast = () => {
    setHighContrast(!highContrast);
  };

  const adjustFontSize = (direction: "up" | "down" | "reset") => {
    if (direction === "up") {
      setFontSizeMultiplier((prev) => Math.min(prev + 0.1, 1.3));
    } else if (direction === "down") {
      setFontSizeMultiplier((prev) => Math.max(prev - 0.1, 0.9));
    } else {
      setFontSizeMultiplier(1.0);
    }
  };

  // Smart application simulation
  const handleSimulateIsencao = async () => {
    if (!userSession.isAuthenticated || !userSession.user) return;
    setSubmittingIsencao(true);
    try {
      const response = await fetch("/api/student/verify-isencao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userSession.user.email,
          originSchool: userSession.user.originSchool,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao comunicar com o validador estatal.");
      }

      const data = await response.json();
      setIsencaoResult(data);
      setIsencaoSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingIsencao(false);
    }
  };

  // Reset smart application state when closing modal
  const handleCloseDeadlineModal = () => {
    setActiveDeadlineModal(null);
    setIsencaoSuccess(false);
    setSubmittingIsencao(false);
    setIsencaoResult(null);
  };

  return (
    <div className={`min-h-screen flex flex-col ${highContrast ? "high-contrast" : ""}`} style={{ fontSize: `${fontSizeMultiplier}rem` }}>
      {/* Upper Navigation Header */}
      <Header
        currentTab={activeTab}
        onTabChange={setActiveTab}
        userSession={userSession}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        highContrast={highContrast}
        onToggleContrast={toggleContrast}
        fontSizeMultiplier={fontSizeMultiplier}
        onAdjustFontSize={adjustFontSize}
      />

      {/* Main Body Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        <div id="content-container" className="animate-fade-in">
          {activeTab === "inicio" && (
            <TabInicio
              deadlines={deadlines}
              institutions={institutions}
              onNavigateTab={setActiveTab}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              isAuthenticated={userSession.isAuthenticated}
              onSelectDeadline={setActiveDeadlineModal}
              realtimeFeed={realtimeFeed}
            />
          )}

          {activeTab === "instituicoes" && (
            <TabInstituicoes
              institutions={institutions}
              realtimeFeed={realtimeFeed}
              onRefreshRealtimeFeed={fetchRealtimeFeed}
            />
          )}

          {activeTab === "editais" && (
            <TabEditais
              deadlines={deadlines}
              onSelectDeadline={setActiveDeadlineModal}
            />
          )}

          {activeTab === "orientacao" && (
            <TabOrientacao
              careerAreas={CAREER_AREAS}
              initialChatHistory={initialChatHistory}
              onSendMessage={handleChatSendMessage}
            />
          )}

          {activeTab === "admin" && (
            <TabAdmin
              institutions={institutions}
              trashInstitutions={trashInstitutions}
              onAddInstitution={handleAddInstitution}
              onDeleteInstitution={handleDeleteInstitution}
              onRestoreInstitution={handleRestoreInstitution}
              onPermanentDeleteInstitution={handlePermanentDeleteInstitution}
            />
          )}
        </div>
      </main>

      {/* Official Reassuring footer */}
      <Footer />

      {/* MODAL 1: Authenticação Unificada PR */}
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          // Utilizing user mail reference in parameters
          userEmailFromMetadata="faculdaproject@gmail.com"
        />
      )}

      {/* MODAL 2: Rich Inspectors for Specific Deadlines */}
      {activeDeadlineModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-scale-up" id="deadline-inspect-modal">
            {/* Header */}
            <div className="bg-[#002f6c] text-white px-5 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] inline-block uppercase font-bold tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded">
                  {activeDeadlineModal.type}
                </span>
                <span className="text-xs text-slate-200 font-light hidden sm:inline-block">
                  • Edital {activeDeadlineModal.institutionId.toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleCloseDeadlineModal}
                className="text-slate-300 hover:text-white transition duration-150 p-1 hover:bg-[#001d44] rounded"
              >
                <X size={18} />
              </button>
            </div>

            {/* Inspect Body */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {activeDeadlineModal.title}
                </h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Instituição parceira: <span className="font-semibold text-slate-700">{activeDeadlineModal.institutionName}</span>
                </p>
              </div>

              {/* Deadline alert card */}
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md">
                <span className="text-xs font-bold text-slate-700 block">Cronograma de Submissão:</span>
                <span className="text-xs font-bold text-[#002f6c] bg-white border border-blue-200 px-2 py-0.5 rounded font-mono">
                  {activeDeadlineModal.deadlineDate}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {activeDeadlineModal.description}
                </p>

                {activeDeadlineModal.requirements && (
                  <div className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Requisitos Mínimos Necessários
                    </span>
                    <p className="text-xs text-slate-700 font-light">
                      {activeDeadlineModal.requirements}
                    </p>
                  </div>
                )}
              </div>

              {/* INTEGRATED INTELLIGENT SOLICITATION FLOW */}
              {activeDeadlineModal.type === "Isenção de Taxa" && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  {userSession.isAuthenticated && userSession.user ? (
                    <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3.5 space-y-3">
                      <div className="flex items-start space-x-2.5">
                        <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                            Solicitação Integrada de Isenção PR
                          </span>
                          <p className="text-[10px] text-slate-600 leading-normal font-light">
                            Verificamos que você concluiu o Ensino Médio na instituição: <span className="font-semibold text-slate-800">"{userSession.user.originSchool}"</span>. Essa origem garante isenção automática perante o banco de dados da SEED-PR.
                          </p>
                        </div>
                      </div>

                      {isencaoSuccess && isencaoResult ? (
                        <div className={`p-3 rounded text-xs font-semibold flex flex-col space-y-1.5 animate-fade-in ${isencaoResult.eligible ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}>
                          <div className="flex items-center space-x-1.5 font-bold">
                            <CheckCircle2 size={14} />
                            <span>{isencaoResult.eligible ? "Processado com Sucesso" : "Verificação Necessária"}</span>
                          </div>
                          <p className="text-[10px] font-light leading-relaxed">
                            {isencaoResult.message}
                          </p>
                          <span className="text-[9px] font-mono bg-white/20 px-1.5 py-0.5 rounded self-start mt-1">
                            Protocolo: {isencaoResult.protocol}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={handleSimulateIsencao}
                          disabled={submittingIsencao}
                          className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-805 text-white rounded text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
                        >
                          {submittingIsencao ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              <span>Validando junto ao SERE-PR...</span>
                            </>
                          ) : (
                            <span>Requisitar Isenção Automática Única</span>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Isenção Integrada</span>
                        <span className="text-[11px] text-slate-600 font-light block">Conecte sua conta de estudante PR para solicitar automaticamente.</span>
                      </div>
                      <button
                        onClick={() => {
                          handleCloseDeadlineModal();
                          setIsLoginModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-[#002f6c] text-white text-[10px] font-bold rounded uppercase tracking-wider"
                      >
                        Conectar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Redirects */}
            <div className="bg-slate-50 border-t border-slate-100 p-3 flex justify-between items-center gap-2">
              <span className="text-[9px] text-slate-400 font-light">
                Verifique sempre o adendo oficial da instituição.
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleCloseDeadlineModal}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                >
                  Fechar Painel
                </button>
                <a
                  href={activeDeadlineModal.officialLink}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="px-3 py-1.5 bg-[#002f6c] hover:bg-[#001d44] text-white rounded text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <span className="text-white">Acessar Edital Oficial</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
