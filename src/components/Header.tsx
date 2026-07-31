import React from "react";
import { User, Eye, ZoomIn, ZoomOut, LogOut, Menu, X, Landmark, GraduationCap } from "lucide-react";
import { UserSession } from "../types";

interface HeaderProps {
  currentTab: "inicio" | "instituicoes" | "editais" | "orientacao" | "admin";
  onTabChange: (tab: "inicio" | "instituicoes" | "editais" | "orientacao" | "admin") => void;
  userSession: UserSession;
  onLogout: () => void;
  onOpenLogin: () => void;
  highContrast: boolean;
  onToggleContrast: () => void;
  fontSizeMultiplier: number;
  onAdjustFontSize: (direction: "up" | "down" | "reset") => void;
}

export default function Header({
  currentTab,
  onTabChange,
  userSession,
  onLogout,
  onOpenLogin,
  highContrast,
  onToggleContrast,
  fontSizeMultiplier,
  onAdjustFontSize,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="w-full bg-[#002f6c] text-white select-none z-40 relative">
      {/* Upper Accessibility and Official Government Bar */}
      <div className="w-full bg-[#001a3c] text-xs border-b border-[#0f3460] px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Official Seal / Paraná logo reference */}
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="font-semibold tracking-wide text-slate-200 uppercase text-[10px]">
              ESTADO DO PARANÁ • PORTAL DA INFORMAÇÃO ACADÊMICA
            </span>
          </div>

          {/* Accessibility panel */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleContrast}
              id="btn-high-contrast"
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition duration-150 py-0.5 px-1.5 rounded hover:bg-[#1a385c]"
              title="Alternar Auto Contraste"
            >
              <Eye size={12} className="mr-1" />
              <span>{highContrast ? "Contraste Normal" : "Alto Contraste"}</span>
            </button>

            <div className="h-3 w-[1px] bg-[#1a385c]"></div>

            <div className="flex items-center space-x-1 text-slate-300">
              <span>Tamanho Fonte:</span>
              <button
                onClick={() => onAdjustFontSize("down")}
                id="btn-font-smaller"
                className="hover:bg-[#1a385c] px-1 rounded hover:text-white"
                title="Diminuir letras"
              >
                <ZoomOut size={12} />
              </button>
              <button
                onClick={() => onAdjustFontSize("reset")}
                id="btn-font-reset"
                className="hover:bg-[#1a385c] px-1.5 rounded font-bold hover:text-white text-[10px]"
                title="Reiniciar tamanho"
              >
                A
              </button>
              <button
                onClick={() => onAdjustFontSize("up")}
                id="btn-font-larger"
                className="hover:bg-[#1a385c] px-1 rounded hover:text-white"
                title="Aumentar letras"
              >
                <ZoomIn size={12} />
              </button>
              <span className="text-[10px] text-slate-400">({Math.round(fontSizeMultiplier * 100)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Title / Logo brand */}
        <div
          onClick={() => onTabChange("inicio")}
          className="flex items-center space-x-3 cursor-pointer group"
          id="logo-button"
        >
          <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-500 rounded text-slate-900 group-hover:scale-105 transition duration-150 shadow-md">
            <GraduationCap size={28} />
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white m-0">
                Faculda<span className="text-amber-400">+</span>
              </h1>
              <span className="hidden sm:inline-block text-[11px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                CURITIBA & Região
              </span>
            </div>
            <p className="text-xs text-slate-300 font-light hidden sm:block">
              Diretório Unificado de Editais, Vagas e Orientação Geral do Paraná
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1" id="desktop-nav">
          <button
            onClick={() => onTabChange("inicio")}
            id="tab-btn-inicio"
            className={`px-4 py-2 rounded-md font-medium text-sm transition duration-150 ${
              currentTab === "inicio"
                ? "bg-[#0b4885] text-white shadow-inner"
                : "text-slate-200 hover:bg-[#0a356c] hover:text-white"
            }`}
          >
            Início
          </button>
          <button
            onClick={() => onTabChange("instituicoes")}
            id="tab-btn-instituicoes"
            className={`px-4 py-2 rounded-md font-medium text-sm transition duration-150 ${
              currentTab === "instituicoes"
                ? "bg-[#0b4885] text-white shadow-inner"
                : "text-slate-200 hover:bg-[#0a356c] hover:text-white"
            }`}
          >
            Instituições
          </button>
          <button
            onClick={() => onTabChange("editais")}
            id="tab-btn-editais"
            className={`px-4 py-2 rounded-md font-medium text-sm transition duration-150 ${
              currentTab === "editais"
                ? "bg-[#0b4885] text-white shadow-inner"
                : "text-slate-200 hover:bg-[#0a356c] hover:text-white"
            }`}
          >
            Editais & Prazos
          </button>
          <button
            onClick={() => onTabChange("orientacao")}
            id="tab-btn-orientacao"
            className={`px-4 py-2 rounded-md font-medium text-sm transition duration-150 ${
              currentTab === "orientacao"
                ? "bg-[#0b4885] text-white shadow-inner"
                : "text-slate-200 hover:bg-[#0a356c] hover:text-white"
            }`}
          >
            Orientação Profissional
          </button>
          <button
            onClick={() => onTabChange("admin")}
            id="tab-btn-admin"
            className={`px-4 py-2 rounded-md font-semibold text-sm transition duration-150 flex items-center space-x-1.5 ${
              currentTab === "admin"
                ? "bg-amber-400 text-slate-950 shadow-inner border border-amber-400"
                : "text-amber-300 border border-amber-400/20 hover:border-amber-400/40 hover:bg-[#0a356c]"
            }`}
          >
            <span>Painel Admin DB</span>
            <span className="inline-block h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
          </button>
        </nav>

        {/* User login actions */}
        <div className="hidden md:flex items-center space-x-3" id="auth-actions-desktop">
          {userSession.isAuthenticated && userSession.user ? (
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-end text-xs text-right">
                <span className="font-semibold text-slate-100 max-w-[150px] truncate">
                  {userSession.user.fullName}
                </span>
                <span className="text-[10px] text-emerald-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                  Conectado • Aluno
                </span>
              </div>
              <button
                onClick={onLogout}
                id="btn-logout-desktop"
                className="p-2 text-slate-300 hover:text-rose-400 bg-[#001d44] hover:bg-rose-950/20 rounded-full transition-colors"
                title="Sair da Conta"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              id="btn-login-desktop"
              className="flex items-center space-x-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded font-semibold text-sm shadow-md transition duration-150 transform active:scale-95 cursor-pointer"
            >
              <User size={16} />
              <span>Conectar Área do Aluno</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center space-x-2">
          {/* User action mini for mobile */}
          {userSession.isAuthenticated && userSession.user ? (
            <button
              onClick={onLogout}
              id="btn-logout-mobile"
              className="p-2 text-slate-300 hover:text-rose-400 bg-[#001d44] rounded-full mr-2"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              id="btn-login-mobile"
              className="p-1.5 bg-amber-400 text-slate-950 rounded-full mr-2"
              title="Login"
            >
              <User size={16} />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="p-2 hover:bg-[#001a3c] rounded text-slate-200 hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#001a3c] border-t border-[#103562] animate-fade-in" id="mobile-nav">
          <div className="px-4 py-3 space-y-1">
            <button
              onClick={() => {
                onTabChange("inicio");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded text-sm font-medium ${
                currentTab === "inicio" ? "bg-[#0b4885] text-white" : "text-slate-300 hover:bg-[#0c234a]"
              }`}
            >
              Início / Dashboard
            </button>
            <button
              onClick={() => {
                onTabChange("instituicoes");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded text-sm font-medium ${
                currentTab === "instituicoes" ? "bg-[#0b4885] text-white" : "text-slate-300 hover:bg-[#0c234a]"
              }`}
            >
              Instituições de Curitiba
            </button>
            <button
              onClick={() => {
                onTabChange("editais");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded text-sm font-medium ${
                currentTab === "editais" ? "bg-[#0b4885] text-white" : "text-slate-300 hover:bg-[#0c234a]"
              }`}
            >
              Editais & Prazos Ativos
            </button>
            <button
              onClick={() => {
                onTabChange("orientacao");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded text-sm font-medium ${
                currentTab === "orientacao" ? "bg-[#0b4885] text-white" : "text-slate-300 hover:bg-[#0c234a]"
              }`}
            >
              Orientação Profissional & Assistente IA
            </button>
            <button
              onClick={() => {
                onTabChange("admin");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded text-sm font-semibold ${
                currentTab === "admin" ? "bg-amber-400 text-slate-950" : "text-amber-300 hover:bg-[#0c234a]"
              }`}
            >
              Painel Admin DB 🛡️
            </button>

            {!userSession.isAuthenticated && (
              <div className="pt-3 border-t border-[#1a385c]">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 bg-amber-400 text-slate-900 rounded font-bold text-sm"
                >
                  Conectar Área do Aluno
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
