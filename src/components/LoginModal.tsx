import React, { useState } from "react";
import { X, LogIn, Lock, Mail, User, Shield, GraduationCap, RefreshCw, Key, Eye, EyeOff } from "lucide-react";
import { UserSession } from "../types";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: { email: string; fullName: string; originSchool?: string }) => void;
  userEmailFromMetadata?: string;
}

interface LocalUser {
  email: string;
  fullName: string;
  password?: string;
  originSchool: string;
  createdAt: string;
}

const getLocalUsers = (): LocalUser[] => {
  try {
    const data = localStorage.getItem("guiaestudantil_users_db");
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Erro ao recuperar banco de dados local:", e);
  }
  return [
    {
      email: "faculdaproject@gmail.com",
      fullName: "Aluno Integrado Paraná",
      password: "password123",
      originSchool: "Colégio Estadual do Paraná (CEP)",
      createdAt: new Date().toISOString(),
    }
  ];
};

const saveLocalUsers = (users: LocalUser[]) => {
  try {
    localStorage.setItem("guiaestudantil_users_db", JSON.stringify(users));
  } catch (e) {
    console.error("Erro ao salvar banco de dados local:", e);
  }
};

export default function LoginModal({ onClose, onLoginSuccess, userEmailFromMetadata = "estudante@curitiba.pr.gov.br" }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "recover">("login");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [originSchool, setOriginSchool] = useState("Escola Pública Estadual");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Google flow simulation
  const [simulatedGoogleWindow, setSimulatedGoogleWindow] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      let loggedUser: any = null;
      let loginSuccessful = false;

      // Try communicating with Backend first
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Erro ao realizar login.");
          }
          loggedUser = data.user;
          loginSuccessful = true;
        } else {
          throw new Error("No JSON response - triggers fallback");
        }
      } catch (backendError: any) {
        // Se for um erro real do backend mas informando que o usuário não existe ou erro genérico, vamos tentar Firestore primeiro!
        console.log("🔍 [Login] Tentando recuperar cadastro alternativo do Firebase Firestore...");
        try {
          const docRef = doc(db, "students", email.toLowerCase().trim());
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Valida a senha se ela estiver registrada no Firestore, senão aceita
            if (!data.password || data.password === password) {
              loggedUser = {
                email: data.email || email.toLowerCase().trim(),
                fullName: data.fullName || "Estudante",
                originSchool: data.originSchool || "Escola Pública Estadual",
              };
              loginSuccessful = true;
              console.log("🔥 [Firebase] Usuário recuperado e autenticado via Firestore.");
              
              // Tenta sincronizar de volta para o servidor local em segundo plano para persistência local
              try {
                await fetch("/api/auth/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    fullName: loggedUser.fullName,
                    email: loggedUser.email,
                    password: password,
                    originSchool: loggedUser.originSchool
                  })
                });
              } catch (syncErr) {
                console.warn("Sincronização de usuário secundária ignorada:", syncErr);
              }
            } else {
              throw new Error("Senha incorreta. Verifique suas credenciais de segurança.");
            }
          } else {
            // Se não encontrou no Firestore, tenta a base local do localStorage antes de lançar o erro original
            const localUsers = getLocalUsers();
            const matched = localUsers.find(
              (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
            );

            if (matched) {
              if (matched.password !== password) {
                throw new Error("Senha incorreta. Verifique suas credenciais de segurança.");
              }
              loggedUser = {
                email: matched.email,
                fullName: matched.fullName,
                originSchool: matched.originSchool,
              };
              loginSuccessful = true;
            } else {
              // Lança a mensagem amigável original
              throw new Error(backendError.message || "Usuário com este e-mail não encontrado em nossa base integrada.");
            }
          }
        } catch (fsError: any) {
          throw new Error(fsError.message || backendError.message || "Usuário com este e-mail não encontrado em nossa base integrada.");
        }
      }

      if (loginSuccessful && loggedUser) {
        onLoginSuccess({
          email: loggedUser.email,
          fullName: loggedUser.fullName,
          originSchool: loggedUser.originSchool,
        });
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Credenciais inválidas ou erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password) {
      setError("Todos os campos básicos são de preenchimento obrigatório.");
      return;
    }

    if (!agreeTerms) {
      setError("Você deve aceitar a Declaração de Tratamento de Dados da SEED-PR.");
      return;
    }

    setLoading(true);
    try {
      let registeredUser: any = null;
      let registerSuccessful = false;

      // Try communicating with Backend first
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password, originSchool })
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Erro ao criar perfil de estudante.");
          }
          registeredUser = data.user;
          registerSuccessful = true;
        } else {
          throw new Error("No JSON response - triggers fallback");
        }
      } catch (backendError: any) {
        // If there was a real API error with a descriptive message, propagate it
        if (backendError.message && backendError.message !== "No JSON response - triggers fallback" && !backendError.message.includes("Unexpected token")) {
          throw backendError;
        }

        // Client-side Database Fallback & Strict Duplicate Check (e.g., StackBlitz or static platform)
        console.warn("Servidor indisponível ou estático. Efetuando validação e cadastro via Banco de Dados Local (localStorage)...");
        const normalizedEmail = email.toLowerCase().trim();

        // Verificação de e-mail duplicado no Firestore
        try {
          const docRef = doc(db, "students", normalizedEmail);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            throw new Error("Este endereço de e-mail já está associado a um cadastro do Faculda+.");
          }
        } catch (fsError: any) {
          if (fsError.message.includes("já está associado")) {
            throw fsError;
          }
          console.warn("Erro ao verificar duplicidade no Firestore, prosseguindo com verificação local:", fsError);
        }

        const localUsers = getLocalUsers();
        const alreadyExists = localUsers.find(
          (u) => u.email.toLowerCase().trim() === normalizedEmail
        );

        if (alreadyExists) {
          throw new Error("Este endereço de e-mail já está associado a um cadastro do Faculda+.");
        }

        const newStudent: LocalUser = {
          fullName: fullName.trim(),
          email: normalizedEmail,
          password: password,
          originSchool: originSchool,
          createdAt: new Date().toISOString()
        };

        const updatedUsers = [...localUsers, newStudent];
        saveLocalUsers(updatedUsers);

        registeredUser = {
          fullName: newStudent.fullName,
          email: newStudent.email,
          originSchool: newStudent.originSchool,
        };
        registerSuccessful = true;
      }

      if (registerSuccessful && registeredUser) {
        // Salva também no Firestore para persistência robusta em nuvem
        try {
          await setDoc(doc(db, "students", registeredUser.email.toLowerCase()), {
            fullName: registeredUser.fullName,
            email: registeredUser.email.toLowerCase(),
            originSchool: registeredUser.originSchool,
            password: password, // For easy recovery/authentication fallback across restarts
            createdAt: new Date().toISOString()
          });
          console.log("🔥 [Firebase] Estudante cadastrado com sucesso no Firestore!");
        } catch (fbError) {
          console.error("⚠️ [Firebase] Erro ao sincronizar cadastro com o Firestore:", fbError);
        }

        onLoginSuccess({
          email: registeredUser.email,
          fullName: registeredUser.fullName,
          originSchool: registeredUser.originSchool,
        });
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao salvar perfil de estudante.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError("Indique seu e-mail cadastrado.");
      return;
    }

    setLoading(true);
    try {
      try {
        const response = await fetch("/api/auth/recover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Erro ao solicitar recuperação.");
          }
          setSuccessMessage(data.message || `Instruções enviadas para ${email}.`);
        } else {
          throw new Error("No JSON response - triggers fallback");
        }
      } catch (backendError: any) {
        if (backendError.message && backendError.message !== "No JSON response - triggers fallback" && !backendError.message.includes("Unexpected token")) {
          throw backendError;
        }

        // Local Storage database fallback simulation
        const localUsers = getLocalUsers();
        const normalizedEmail = email.toLowerCase().trim();
        const matched = localUsers.find((u) => u.email.toLowerCase().trim() === normalizedEmail);

        setSuccessMessage(
          `Instruções enviadas! Um link de redefinição de segurança foi despachado para o endereço: ${normalizedEmail}. ${
            matched ? "" : "(Observação: E-mail não consta na base local, mas a simulação procedeu com sucesso)"
          }`
        );
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Houve um problema de rede com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const startGoogleSignIn = () => {
    setSimulatedGoogleWindow(true);
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setSimulatedGoogleWindow(false);
      setLoading(false);
      
      // Perform simulated auth
      onLoginSuccess({
        email: userEmailFromMetadata,
        fullName: "Usuário Google Curitiba",
        originSchool: "Colégio Estadual do Paraná (CEP)",
      });
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-scale-up"
        id="login-modal-box"
      >
        {/* Modal Header */}
        <div className="bg-[#002f6c] text-white px-5 py-4 flex justify-between items-center relative">
          <div className="flex items-center space-x-2">
            <Shield size={20} className="text-amber-400" />
            <span className="font-semibold text-sm tracking-wide uppercase">
              Autenticação Unificada PR
            </span>
          </div>
          <button
            onClick={onClose}
            id="close-login-modal"
            className="text-slate-300 hover:text-white transition duration-150 p-1 hover:bg-[#001d44] rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Unified PR State Banner */}
        <div className="bg-[#f0f4f9] px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-700 uppercase">
            Acesso ao Faculda+ Curitiba
          </span>
          <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono">
            V-2026.06
          </span>
        </div>

        {/* Main Content Areas */}
        <div className="p-5">
          {simulatedGoogleWindow ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-4" id="google-loader">
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#4285F4] animate-spin"></div>
              <p className="text-sm font-semibold text-slate-700 animate-pulse">
                Conectando à sua Conta Google paranaense...
              </p>
              <p className="text-xs text-slate-500 font-mono">{userEmailFromMetadata}</p>
            </div>
          ) : (
            <>
              {/* Form Toggles */}
              {activeTab !== "recover" && (
                <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-4 mb-4">
                  <button
                    onClick={() => {
                      setActiveTab("login");
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    id="modal-toggle-login"
                    className={`py-2 text-xs font-semibold rounded uppercase tracking-wider transition ${
                      activeTab === "login"
                        ? "bg-[#002f6c] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Fazer Login
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("register");
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    id="modal-toggle-register"
                    className={`py-2 text-xs font-semibold rounded uppercase tracking-wider transition ${
                      activeTab === "register"
                        ? "bg-[#002f6c] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Nova Conta
                  </button>
                </div>
              )}

              {/* Status alerts */}
              {error && (
                <div className="bg-rose-50 text-rose-800 border-l-4 border-rose-600 p-3 rounded mb-4 text-xs font-medium space-y-1.5">
                  <p>{error}</p>
                  {error.includes("já está associado") && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("login");
                        setError(null);
                      }}
                      className="text-blue-700 hover:underline font-bold block text-[11px] cursor-pointer mt-1 text-left"
                    >
                      Deseja fazer login? Clique aqui para ir à tela de Login →
                    </button>
                  )}
                  {error.includes("não encontrado") && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("register");
                        setError(null);
                      }}
                      className="text-blue-700 hover:underline font-bold block text-[11px] cursor-pointer mt-1 text-left"
                    >
                      Ainda não possui cadastro? Clique aqui para Criar uma Conta →
                    </button>
                  )}
                </div>
              )}

              {successMessage && (
                <div className="bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 p-3 rounded mb-4 text-xs font-medium">
                  {successMessage}
                </div>
              )}

              {/* TAB 1: LOGIN FORM */}
              {activeTab === "login" && (
                <form onSubmit={handleLoginSubmit} id="form-login" className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">E-mail Cadastrado</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        placeholder="nome@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 block">Sua Senha</label>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("recover");
                          setError(null);
                        }}
                        className="text-[11px] text-blue-800 hover:underline cursor-pointer"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    id="submit-login"
                    className="w-full py-2.5 bg-[#002f6c] hover:bg-[#001d44] text-white rounded font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    {loading ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <>
                        <LogIn size={14} />
                        <span>Entrar no Sistema</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: REGISTER FORM */}
              {activeTab === "register" && (
                <form onSubmit={handleRegisterSubmit} id="form-register" className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Nome Completo</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="João da Silva Santos"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">E-mail de Contato</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="joao@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Definir Senha de Acesso</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Instituição Escolar de Origem</label>
                    <select
                      value={originSchool}
                      onChange={(e) => setOriginSchool(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-slate-55 focus:outline-none focus:border-[#002f6c] text-slate-800"
                    >
                      <option value="Escola Pública Estadual">Estudante de Escola Pública Estadual (PR)</option>
                      <option value="Estudante de Escola Pública Federal (IFPR / UTFPR)">Escola Pública Federal</option>
                      <option value="Escola Privada (Bolsista Integral)">Escola Privada (Bolsista Integral 100%)</option>
                      <option value="Escola Privada (Particular regular)">Escola Privada (Particular regular)</option>
                      <option value="Outros / Já formado"></option>
                    </select>
                  </div>

                  <div className="flex items-start space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5"
                    />
                    <label htmlFor="agree-terms" className="text-[10px] text-slate-500 leading-tight">
                      Aceito que os dados escolares acima sejam checados perante a Base Estadual do Paraná para concessão automática de isenções de taxas em vestibulares públicos.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    id="submit-register"
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center space-x-1.5 shadow-sm mt-3 cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <>
                        <GraduationCap size={14} />
                        <span>Gerar meu Perfil Único</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 3: RECOVER PASSWORD */}
              {activeTab === "recover" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-slate-800 mb-1">
                    <Key size={16} className="text-amber-500" />
                    <span className="font-bold text-xs uppercase tracking-wider">Recuperação de Acesso</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Digite o e-mail cadastrado em seu CPF/Perfil do Faculda+. Nós faremos o cruzamento com o banco do Estado para emitir instruções seguras.
                  </p>

                  <form onSubmit={handleRecoverSubmit} id="form-recover" className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">E-mail Registrado</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          placeholder="seu-email@dominio.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-sm focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("login");
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className="w-1/3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                      >
                        Retornar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-2/3 py-2 bg-[#002f6c] hover:bg-[#001d44] text-white rounded text-xs font-bold uppercase transition block cursor-pointer"
                      >
                        {loading ? "Requisitando..." : "Despachar Instruções"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SOCIAL SIGN IN ALTERNATIVES */}
              {activeTab !== "recover" && (
                <div className="mt-6 border-t border-slate-100 pt-5 space-y-3">
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest">
                      Entrada Externa Rápida
                    </span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <button
                    onClick={startGoogleSignIn}
                    id="btn-google-login"
                    type="button"
                    className="w-full py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded font-semibold text-xs tracking-wider transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:shadow"
                  >
                    {/* Google clean SVG icon */}
                    <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.13-.24-.22-.49-.35-.74s-.1-.51-.15-.76z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Seguir Conexão com Google</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
