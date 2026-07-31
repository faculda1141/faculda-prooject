import React, { useState, useMemo } from "react";
import { Calendar, Search, Filter, ShieldCheck, ChevronRight, ExternalLink, RefreshCw, X, AlertOctagon } from "lucide-react";
import { EditalDeadline } from "../types";

interface TabEditaisProps {
  deadlines: EditalDeadline[];
  onSelectDeadline: (deadline: EditalDeadline) => void;
}

export default function TabEditais({ deadlines, onSelectDeadline }: TabEditaisProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("todos");
  const [selectedStatusTab, setSelectedStatusTab] = useState<"todos" | "abertao" | "por_vir" | "encerrado">("todos");

  const filteredDeadlines = useMemo(() => {
    return deadlines.filter((dead) => {
      const matchesSearch =
        dead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dead.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dead.institutionName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === "todos" ? true : dead.type === selectedType;
      const matchesStatus = selectedStatusTab === "todos" ? true : dead.status === selectedStatusTab;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [deadlines, searchTerm, selectedType, selectedStatusTab]);

  const deadtypes = ["todos", "Vestibular", "Isenção de Taxa", "SISU", "Bolsas & ProUni", "Transferência"];

  return (
    <div className="space-y-6" id="editais-calendario">
      {/* Intro section */}
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 m-0">
          Calendário Unificado de Editais & Prazos de Curitiba
        </h3>
        <p className="text-xs text-slate-500 font-light mt-1">
          Acompanhe todos os cronogramas críticos de vestibulares, isenções estudantis e chamamentos do SISU no Paraná. Clique em qualquer item para ver detalhes de submissão e links de canais oficiais.
        </p>

        {/* Tab Filters for Status */}
        <div className="flex border-b border-slate-200 mt-5 whitespace-nowrap overflow-x-auto scrollbar-none" id="status-tabs">
          <button
            onClick={() => setSelectedStatusTab("todos")}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              selectedStatusTab === "todos"
                ? "border-[#002f6c] text-[#002f6c]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Todos os Editais ({deadlines.length})
          </button>
          <button
            onClick={() => setSelectedStatusTab("abertao")}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              selectedStatusTab === "abertao"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Inscrições Abertas ({deadlines.filter((d) => d.status === "abertao").length})
          </button>
          <button
            onClick={() => setSelectedStatusTab("por_vir")}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              selectedStatusTab === "por_vir"
                ? "border-amber-500 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Próximos Editais ({deadlines.filter((d) => d.status === "por_vir").length})
          </button>
          <button
            onClick={() => setSelectedStatusTab("encerrado")}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              selectedStatusTab === "encerrado"
                ? "border-slate-500 text-slate-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Encerrados ({deadlines.filter((d) => d.status === "encerrado").length})
          </button>
        </div>

        {/* Controls row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              id="search-deadlines"
              placeholder="Filtrar editais por título ou universidade do Paraná..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#002f6c] transition"
            />
          </div>

          {/* Type dropdown filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              id="filter-deadlines-type"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-slate-55 focus:outline-none focus:border-[#002f6c] text-slate-800 font-medium"
            >
              <option value="todos">Todas as Modalidades</option>
              <option value="Vestibular">Vestibular</option>
              <option value="Isenção de Taxa">Isenção de Taxa</option>
              <option value="SISU">Seleção SISU</option>
              <option value="Bolsas & ProUni">Bolsas & ProUni</option>
              <option value="Transferência">Vagas e Transferências</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main timeline listing */}
      <div className="space-y-4" id="deadlines-timeline-list">
        {filteredDeadlines.length > 0 ? (
          filteredDeadlines.map((item) => {
            // Pick corresponding badge styles based on status
            let borderStyle = "border-l-4 border-slate-200";
            let pillStyle = "bg-slate-100 text-slate-700";
            let statusLabel = "Encerrado";

            if (item.status === "abertao") {
              borderStyle = "border-l-4 border-emerald-600 bg-white hover:bg-emerald-50/20";
              pillStyle = "bg-emerald-100 text-emerald-800";
              statusLabel = "Inscrições Abertas";
            } else if (item.status === "por_vir") {
              borderStyle = "border-l-4 border-amber-500 bg-white hover:bg-amber-50/10";
              pillStyle = "bg-amber-100 text-amber-800";
              statusLabel = "Próximo / Em prévia";
            } else {
              borderStyle = "border-l-4 border-slate-400 bg-slate-50 opacity-75";
            }

            return (
              <div
                key={item.id}
                onClick={() => onSelectDeadline(item)}
                className={`p-4 rounded-lg border border-slate-200 ${borderStyle} transition duration-150 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-105 text-blue-900 px-2 py-0.5 rounded">
                      {item.institutionName}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${pillStyle}`}>
                      {statusLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-100 px-1.5 py-0.2 rounded">
                      {item.type}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 m-0">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 font-light truncate max-w-xl">
                    {item.description}
                  </p>
                </div>

                {/* Right block with action call and date details */}
                <div className="text-left md:text-right shrink-0 space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                    Período / Cronograma
                  </span>
                  <span className="text-xs font-bold text-slate-900 block bg-slate-50 px-2 py-1 border border-slate-200 rounded font-mono">
                    {item.deadlineDate}
                  </span>
                  <span className="text-[10px] text-blue-800 hover:underline font-bold flex items-center justify-end">
                    <span>Ver Requisitos</span>
                    <ChevronRight size={12} className="ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-2">
            <AlertOctagon className="mx-auto text-slate-400" size={32} />
            <h4 className="text-sm font-bold text-slate-900">Nenhum edital correspondente encontrado</h4>
            <p className="text-xs text-slate-500 font-light">Tente reconfigurar seus filtros de busca ou aba de status.</p>
          </div>
        )}
      </div>
    </div>
  );
}
