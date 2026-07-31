import React from "react";
import { Bell, Calendar, Award, Building2, ChevronRight, UserCheck, BookOpen, AlertCircle } from "lucide-react";
import { EditalDeadline, Institution } from "../types";

interface TabInicioProps {
  deadlines: EditalDeadline[];
  institutions: Institution[];
  onNavigateTab: (tab: "inicio" | "instituicoes" | "editais" | "orientacao") => void;
  onOpenLogin: () => void;
  isAuthenticated: boolean;
  onSelectDeadline: (deadline: EditalDeadline) => void;
  realtimeFeed?: any;
}

export default function TabInicio({
  deadlines,
  institutions,
  onNavigateTab,
  onOpenLogin,
  isAuthenticated,
  onSelectDeadline,
  realtimeFeed,
}: TabInicioProps) {
  // We want to extract the open and coming deadlines
  const activeDeadlines = deadlines.filter((d) => d.status === "abertao");
  const upcomingDeadlines = deadlines.filter((d) => d.status === "por_vir");

  return (
    <div className="space-y-6" id="dashboard-inicio">
      {/* Visual Header / Welcome Hero */}
      <div className="bg-[#002f6c] bg-radial from-[#003d8d] to-[#001f4c] text-white p-6 md:p-8 rounded-lg shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 w-full relative z-10">
          <span className="bg-amber-400 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded inline-block">
            Portal Unificado Regional — Atualizado em 25/06/2026
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight m-0">
            Navegue com precisão pelo seu futuro acadêmico em Curitiba.
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed font-light">
            Centralizamos editais complexos, vagas de bolsas, prazos cruciais e catálogos das melhores universidades federais, estaduais e comunitárias da capital paranaense.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => onNavigateTab("editais")}
              className="px-4 py-2 bg-amber-400 text-slate-950 text-xs font-bold rounded hover:bg-amber-500 transition duration-150 shadow shadow-amber-400/20 cursor-pointer"
            >
              Ver Editais Ativos
            </button>
            <button
              onClick={() => onNavigateTab("orientacao")}
              className="px-4 py-2 bg-[#0b4885] border border-slate-500/50 hover:bg-[#083562] text-white text-xs font-semibold rounded transition duration-150 cursor-pointer"
            >
              Conversar com Assistente IA
            </button>
          </div>
        </div>
      </div>

      {/* Grid Counters / Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center space-x-3 shadow-xs">
          <div className="p-3 bg-blue-50 text-[#002f6c] rounded-lg">
            <Calendar size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Editais Abertos</span>
            <span className="text-xl font-bold text-[#002f6c]" id="stat-active-deadlines">
              {activeDeadlines.length} Editais
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center space-x-3 shadow-xs">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
            <Building2 size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Instituições Registradas</span>
            <span className="text-xl font-bold text-slate-800">
              {institutions.length} Polos
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center space-x-3 shadow-xs">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
            <Award size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Modalidades Promovidas</span>
            <span className="text-xl font-bold text-slate-800">5 Categorias</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center space-x-3 shadow-xs">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg">
            <UserCheck size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Status Perfil Aluno</span>
            <span className="text-sm font-semibold text-slate-700">
              {isAuthenticated ? "Perfil Verificado" : "Acesso Visitante"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main: Announcements and Priority Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active alerts panel */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Bell size={18} className="text-amber-500 animate-bounce" />
              <h3 className="text-base font-bold text-slate-900 m-0">
                Avisos e Transmissões Urgentes de Curitiba
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border-l-4 border-slate-500 rounded flex items-start space-x-3">
                <AlertCircle size={16} className="text-slate-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 font-light">
                  <p className="font-bold text-slate-800">Isenções e Inscrições UFPR Encerradas</p>
                  O Cadastramento de Pedidos de Isenção para o vestibular geral UFPR encerrou-se no dia <span className="font-semibold text-slate-950">20/07</span>. Fique atento às próximas atualizações e datas das provas na aba "Editais" para acompanhar o andamento dos editais de homologação de inscritos.
                </div>
              </div>

              <div className="p-3 bg-blue-50 border-l-4 border-[#002f6c] rounded flex items-start space-x-3">
                <AlertCircle size={16} className="text-[#002f6c] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 font-light">
                  <p className="font-bold text-slate-800">PUCPR — Foco no Vestibular de Verão 2027</p>
                  O Vestibular de Inverno PUCPR 2026 e o seu programa de bolsas respectivo já estão encerrados. O próximo grande certame será o tradicional <span className="font-semibold text-blue-950">Vestibular de Verão PUCPR 2027</span>, cujas inscrições iniciarão em breve (previsão para Outubro/2026).
                </div>
              </div>
            </div>
          </div>

          {/* Quick deadlines picker */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen size={18} className="text-[#002f6c]" />
                <h3 className="text-base font-bold text-slate-900 m-0">
                  Prazos Relevantes Abertos no Momento
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab("editais")}
                className="text-xs text-[#002f6c] hover:underline hover:text-[#0c1f40] font-semibold flex items-center"
              >
                <span>Ver todos os editais</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {activeDeadlines.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50 px-2 rounded-md transition duration-150 cursor-pointer"
                  onClick={() => onSelectDeadline(item)}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                      {item.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 block m-0">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-light block">
                      Responsável: <span className="font-semibold text-slate-700">{item.institutionName}</span>
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] text-slate-400 block">Encerramento</span>
                    <span className="text-xs font-bold text-[#002f6c]">{item.deadlineDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar: Destaques Culturais e Acadêmicos / Curitiba Info */}
        <div className="space-y-6">
          {/* Connection Call to Action for Student */}
          {!isAuthenticated && (
            <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-amber-400 text-slate-900 p-5 rounded-lg shadow-sm space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider m-0">
                Acesse o Painel Unificado
              </h4>
              <p className="text-xs leading-relaxed font-light">
                Conecte sua Conta Google para sincronizar suas informações escolares da rede pública estadual de Curitiba e solicitar isenções automáticas de vestibular com 1 clique.
              </p>
              <button
                onClick={onOpenLogin}
                className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-white rounded font-bold text-xs uppercase tracking-wider shadow"
              >
                Conectar Agora
              </button>
            </div>
          )}

          {/* Curitiba Context Box */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <h4 className="text-xs font-bold text-[#002f6c] tracking-widest uppercase border-b border-slate-100 pb-2 m-0">
              Educação & Integração Curitibana
            </h4>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                  Vale do Pinhão
                </span>
                <p className="text-xs text-slate-800 font-semibold mt-1">
                  Espaço de Inovação de Curitiba
                </p>
                <p className="text-[11px] text-slate-500 font-light">
                  A prefeitura promove periodicamente editais de incentivo à residência técnica júnior para estudantes de TI curitibanos, subsidiando capacitações de alto nível.
                </p>
              </div>

              <div className="h-[1px] bg-slate-100"></div>

              <div>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                  Teatro Guaíra
                </span>
                <p className="text-xs text-slate-800 font-semibold mt-1">
                  Bolsas Culturais Unespar
                </p>
                <p className="text-[11px] text-slate-500 font-light">
                  A UNESPAR disponibiliza anualmente auxílios para estudantes dos cursos de dança e artes cênicas acompanharem montagens profissionais no palco de Curitiba.
                </p>
              </div>

              <div className="h-[1px] bg-slate-100"></div>

              <div>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                  Passe VIP Escolar
                </span>
                <p className="text-xs text-slate-800 font-semibold mt-1">
                  Apoio ao Estudante Curitiba
                </p>
                <p className="text-[11px] text-slate-500 font-light">
                  A URBS disponibiliza o passe livre estudantil (meia passagem ou isenção de tarifa técnica de ônibus) para matriculados regularmente em escolas em Curitiba.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
