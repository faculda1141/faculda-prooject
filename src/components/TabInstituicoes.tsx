import React, { useState, useMemo } from "react";
import {
  Search,
  Building,
  ExternalLink,
  MapPin,
  CheckCircle,
  Info,
  RefreshCw,
  Wifi,
  Clock,
  Activity,
  TrendingUp,
  Coins,
  ArrowRight
} from "lucide-react";
import { Institution } from "../types";

interface TabInstituicoesProps {
  institutions: Institution[];
  realtimeFeed?: any;
  onRefreshRealtimeFeed?: () => Promise<void>;
}

// Highly descriptive, actual functional links for each specific Curitiba institution
const INSTITUTION_QUICK_LINKS: Record<string, { label: string; url: string; icon: string }[]> = {
  ufpr: [
    { label: "Site Oficial UFPR", url: "https://www.ufpr.br", icon: "🌐" },
    { label: "Inscrições NC Portal", url: "https://servicos.nc.ufpr.br/", icon: "📝" },
    { label: "Bolsas de Apoio PRAE", url: "https://prae.ufpr.br/", icon: "🤝" }
  ],
  utfpr: [
    { label: "Site Oficial UTFPR", url: "https://www.utfpr.edu.br", icon: "🌐" },
    { label: "Cursos de Graduação", url: "https://www.utfpr.edu.br/cursos/graduacao", icon: "📚" },
    { label: "Acompanhamento SISU", url: "https://acessounico.mec.gov.br/sisu", icon: "🎯" }
  ],
  ifpr: [
    { label: "Site Oficial IFPR", url: "https://ifpr.edu.br", icon: "🌐" },
    { label: "Editais de Processo Seletivo", url: "https://reitoria.ifpr.edu.br/processos-seletivos/", icon: "📄" }
  ],
  pucpr: [
    { label: "Site Oficial PUCPR", url: "https://www.pucpr.br", icon: "🌐" },
    { label: "Portal Vestibular", url: "https://vestibular.pucpr.br/", icon: "✨" },
    { label: "Financiamentos e Bolsas", url: "https://www.pucpr.br/estude-na-pucpr/bolsas-e-financiamentos/", icon: "💰" }
  ],
  positivo: [
    { label: "Site Oficial Positivo", url: "https://www.up.edu.br", icon: "🌐" },
    { label: "Catálogo de Cursos", url: "https://www.up.edu.br/graduacao/", icon: "📖" },
    { label: "Bolsas e ProUni UP", url: "https://www.up.edu.br/bolsas-e-financiamento/", icon: "💸" }
  ],
  unespar: [
    { label: "Site Oficial UNESPAR", url: "https://www.unespar.edu.br", icon: "🌐" },
    { label: "Editais de Vestibular", url: "https://vestibular.unespar.edu.br/", icon: "🎓" }
  ]
};

export default function TabInstituicoes({
  institutions,
  realtimeFeed,
  onRefreshRealtimeFeed,
}: TabInstituicoesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("todos");
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredInstitutions = useMemo(() => {
    return institutions.filter((inst) => {
      const matchesSearch =
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.description.toLowerCase().includes(searchTerm.toLowerCase() || "") ||
        inst.campus.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedType === "todos" ? true : inst.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [institutions, searchTerm, selectedType]);

  const institutionCategories = [
    { value: "todos", label: "Todas as Categorias" },
    { value: "Pública Federal", label: "Pública Federal" },
    { value: "Pública Estadual", label: "Pública Estadual" },
    { value: "Privada Comunitária", label: "Privada Comunitária" },
    { value: "Privada", label: "Privada" },
  ];

  const handleManualSync = async () => {
    if (!onRefreshRealtimeFeed) return;
    setIsSyncing(true);
    await onRefreshRealtimeFeed();
    setTimeout(() => {
      setIsSyncing(false);
    }, 850);
  };

  return (
    <div className="space-y-6" id="instituicoes-catalog">
      {/* Search and Filters Hub */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 m-0">
            Catálogo Unificado de Instituições de Curitiba
          </h3>
          <p className="text-xs text-slate-500 font-light">
            Pesquise por campus específicos, universidades públicas e programas de incentivo ao estudo.
          </p>
        </div>

        {/* Inputs row */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              id="search-institutions"
              placeholder="Digite o nome, campus ou palavras-chave (ex: Ecoville, Reitoria...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#002f6c] transition"
            />
          </div>

          {/* Type filters select */}
          <div className="w-full md:w-[220px]">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              id="filter-institutions-type"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:border-[#002f6c] text-slate-800 font-medium cursor-pointer"
            >
              {institutionCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Informative Label */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded font-light border border-slate-100">
          <Info size={14} className="text-[#002f6c]" />
          <span>
            Prazos específicos de isenção dependem da rede escolar cadastrada. Estudantes oriundos do ensino público estadual no Paraná possuem garantias automáticas em processos participantes.
          </span>
        </div>
      </div>

      {/* Grid of Universities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="institutions-cards-grid">
        {filteredInstitutions.length > 0 ? (
          filteredInstitutions.map((inst) => {
            // Pull the matching live statistics
            const liveData = realtimeFeed?.institutions?.[inst.id];

            return (
              <div
                key={inst.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition duration-200"
              >
                {/* Header card blue top bar */}
                <div className="bg-[#f8fafc] border-b border-slate-100 p-4 flex justify-between items-start">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl p-2 bg-slate-100 rounded-md shadow-xs block">
                      {inst.logo}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 m-0">
                        {inst.name}
                      </h4>
                      <span className="text-[10px] bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded uppercase tracking-wider block mt-1 w-max">
                        {inst.type}
                      </span>
                    </div>
                  </div>

                  <a
                    href={inst.website}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="p-1.5 text-slate-400 hover:text-[#002f6c] hover:bg-slate-50 rounded transition-colors"
                    title="Visitar site oficial"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-grow space-y-4">
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {inst.description}
                  </p>

                  {/* Campus section */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Campus Ativos Curitiba / RM
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {inst.campus.map((c, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-blue-50/50 text-[#002f6c] border border-blue-100/30 px-2 py-0.5 rounded flex items-center font-light"
                        >
                          <MapPin size={8} className="mr-1" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights entry box */}
                  <div className="p-3 bg-amber-50/40 border border-amber-200/50 rounded-md">
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center mb-1">
                      <CheckCircle size={10} className="mr-1 text-amber-600" />
                      Condições e Destaques Importantes
                    </span>
                    <p className="text-[11px] text-slate-700 font-light leading-snug">
                      {inst.highlights}
                    </p>
                  </div>

                  {/* FULLY FUNCTIONAL QUICK LINKS SECTION (ALL LINKS DETAILED AND INDIVIDUALIZED) */}
                  <div className="space-y-2 border-t border-slate-100 pt-3" id="quick-links-area">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Acesso aos Portais e Serviços Disponíveis:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {(inst.customLinks || INSTITUTION_QUICK_LINKS[inst.id] || [])?.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.url}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="flex items-center space-x-2 text-[11px] text-[#002f6c] hover:text-[#0a356c] bg-slate-50 hover:bg-slate-100/80 px-2   py-1.5 rounded border border-slate-200/50 transition truncate font-medium"
                          title={`Visitar ${item.label}`}
                        >
                          <span className="text-xs">{item.icon || "🔗"}</span>
                          <span className="truncate">{item.label}</span>
                          <ArrowRight size={10} className="text-slate-400 ml-auto shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Button */}
                <div className="bg-[#f8fafc] border-t border-slate-100 p-3 text-right">
                  <a
                    href={inst.website}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-[#002f6c] hover:text-[#0a356c] transition-colors"
                  >
                    <span>Ver Portal da Instituição</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-lg border border-slate-200 p-12 text-center space-y-2">
            <Building className="mx-auto text-slate-300" size={32} />
            <h4 className="text-sm font-bold text-slate-900">Nenhuma instituição correspondente encontrada</h4>
            <p className="text-sm text-slate-500 font-light">Tente limpar sua pesquisa ou selecionar outra categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
