import React from "react";
import { Landmark, ExternalLink, ShieldCheck, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111c2c] text-slate-300 border-t-4 border-amber-400 mt-auto">
      {/* Upper footer links and sections */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About section */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-1 px-2 bg-amber-400 rounded text-slate-900 font-bold text-sm">
              PR
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Portal Faculda+
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Iniciativa de transparência pública, orientada ao saneamento de dúvidas sobre o acesso ao ensino superior e técnico em Curitiba e Região Metropolitana.
          </p>
          <div className="flex space-x-4 pt-2">
            <span className="text-[10px] text-slate-400 border border-slate-700 px-2 py-0.5 rounded uppercase font-semibold">
              Região de Curitiba
            </span>
            <span className="text-[10px] text-emerald-400 border border-emerald-900/50 bg-emerald-950/20 px-2 py-0.5 rounded uppercase font-semibold">
              Dados Oficiais 2026
            </span>
          </div>
        </div>

        {/* State Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white tracking-widest uppercase">
            Links Paraná Governamental
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://www.escola.pr.gov.br"
                target="_blank"
                referrerPolicy="no-referrer"
                className="hover:text-amber-300 transition-colors flex items-center"
              >
                <span>Secretaria da Educação (SEED-PR)</span>
                <ExternalLink size={10} className="ml-1 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://www.pr.gov.br"
                target="_blank"
                referrerPolicy="no-referrer"
                className="hover:text-amber-300 transition-colors flex items-center"
              >
                <span>Portal de Serviços do Paraná</span>
                <ExternalLink size={10} className="ml-1 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://www.copel.com"
                target="_blank"
                referrerPolicy="no-referrer"
                className="hover:text-amber-300 transition-colors flex items-center"
              >
                <span>Inovação Copel & Projetos PR</span>
                <ExternalLink size={10} className="ml-1 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://www.unespar.edu.br"
                target="_blank"
                referrerPolicy="no-referrer"
                className="hover:text-amber-300 transition-colors flex items-center"
              >
                <span>UNESPAR Estadual</span>
                <ExternalLink size={10} className="ml-1 text-slate-500" />
              </a>
            </li>
          </ul>
        </div>

        {/* Support contacts */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white tracking-widest uppercase">
            Contatos de Emergência & Apoio
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start">
              <MapPin size={12} className="mr-2 mt-0.5 text-amber-400 shrink-0" />
              <span>Av. Cândido de Abreu, 120 - Centro Cívico, Curitiba - PR</span>
            </li>
            <li className="flex items-center">
              <Phone size={12} className="mr-2 text-amber-400 shrink-0" />
              <span>(41) 3200-1000 — Atendimento Geral</span>
            </li>
            <li className="flex items-center">
              <Mail size={12} className="mr-2 text-amber-400 shrink-0" />
              <span>suporte-guia@paranadigital.pr.gov.br</span>
            </li>
          </ul>
        </div>

        {/* Quick Maps Grounding references info */}
        <div className="space-y-3 col-span-1">
          <h4 className="text-sm font-semibold text-white tracking-widest uppercase">
            Transparência Acadêmica
          </h4>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Todas as datas e calendários de inscrição são de autoria exclusiva de suas respectivas bancas organizadoras (NC-UFPR, Prograd-UTFPR e PUC-Multiverso). Recomendamos sempre checar os sites oficiais antes de efetivar taxas.
          </p>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Verificação Ativa de Editais</span>
          </div>
        </div>
      </div>

      {/* Deep Footer */}
      <div className="bg-[#0b121e] text-slate-500 text-[10px] py-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Portal Faculda+ Curitiba. Desenvolvido em conformidade com as diretivas de Acessibilidade Governamental.</p>
          <p className="text-slate-400 font-medium">Curitiba/PR, Brasil</p>
        </div>
      </div>
    </footer>
  );
}
