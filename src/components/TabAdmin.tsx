import React, { useState, useEffect } from "react";
import { Users, Search, RefreshCw, Database, ShieldAlert, GraduationCap, Check, HelpCircle, Server, Lock, Eye, EyeOff, AlertCircle, LogOut, Plus, Trash2, RotateCcw, X, Building } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Institution } from "../types";

interface AdminUser {
  fullName: string;
  email: string;
  originSchool: string;
  createdAt: string;
}

interface TabAdminProps {
  institutions: Institution[];
  trashInstitutions: Institution[];
  onAddInstitution: (inst: Institution) => void;
  onDeleteInstitution: (id: string) => void;
  onRestoreInstitution: (id: string) => void;
  onPermanentDeleteInstitution: (id: string) => void;
}

export default function TabAdmin({
  institutions,
  trashInstitutions,
  onAddInstitution,
  onDeleteInstitution,
  onRestoreInstitution,
  onPermanentDeleteInstitution
}: TabAdminProps) {
  const [adminSubTab, setAdminSubTab] = useState<"usuarios" | "universidades">("usuarios");
  
  // New University state declarations
  const [newInstName, setNewInstName] = useState("");
  const [newInstType, setNewInstType] = useState<"Pública Federal" | "Pública Estadual" | "Privada Comunitária" | "Privada">("Pública Federal");
  const [newInstLogo, setNewInstLogo] = useState("🏫");
  const [newInstDescription, setNewInstDescription] = useState("");
  const [newInstCampus, setNewInstCampus] = useState("");
  const [newInstWebsite, setNewInstWebsite] = useState("");
  const [newInstHighlights, setNewInstHighlights] = useState("");
  const [customLinks, setCustomLinks] = useState<{ label: string; url: string; icon: string }[]>([
    { label: "Site Oficial", url: "", icon: "🌐" }
  ]);

  const handleAddLinkRow = () => {
    setCustomLinks([...customLinks, { label: "", url: "", icon: "🔗" }]);
  };

  const handleRemoveLinkRow = (index: number) => {
    setCustomLinks(customLinks.filter((_, idx) => idx !== index));
  };

  const handleLinkChange = (index: number, field: "label" | "url" | "icon", value: string) => {
    const updated = [...customLinks];
    updated[index][field] = value;
    setCustomLinks(updated);
  };

  const handleCreateInstitutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName.trim() || !newInstDescription.trim()) {
      alert("Por favor, preencha o nome e a descrição da universidade.");
      return;
    }

    // Generate unique ID based on lowercase name alphanumeric
    const generatedId = newInstName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const newInst: Institution = {
      id: generatedId || `inst-${Date.now()}`,
      name: newInstName.trim(),
      type: newInstType,
      campus: newInstCampus.split(",").map((c) => c.trim()).filter((c) => c.length > 0),
      website: newInstWebsite.trim() || "https://",
      description: newInstDescription.trim(),
      highlights: newInstHighlights.trim() || "Oferece excelentes programas de graduação e pós-graduação.",
      logo: newInstLogo.trim() || "🏫",
      customLinks: customLinks.filter((lnk) => lnk.label.trim().length > 0 && lnk.url.trim().length > 0)
    };

    onAddInstitution(newInst);

    // Reset Form
    setNewInstName("");
    setNewInstType("Pública Federal");
    setNewInstLogo("🏫");
    setNewInstDescription("");
    setNewInstCampus("");
    setNewInstWebsite("");
    setNewInstHighlights("");
    setCustomLinks([{ label: "Site Oficial", url: "", icon: "🌐" }]);

    setSuccess("Nova universidade cadastrada e adicionada com sucesso!");
    setTimeout(() => setSuccess(null), 3000);
  };
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem("faculda_admin_auth") === "true";
    } catch {
      return false;
    }
  });
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPasswords = ["admin123", "admin2026", "faculda123", "admin"];
    if (validPasswords.includes(adminPassword.trim())) {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem("faculda_admin_auth", "true");
      } catch (err) {
        console.error(err);
      }
      setAdminAuthError(null);
    } else {
      setAdminAuthError("Senha de administrador incorreta. Tente novamente.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem("faculda_admin_auth");
    } catch (err) {
      console.error(err);
    }
    setAdminPassword("");
  };

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<"api" | "firestore">("api");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load registered users from API (Local server users-db.json)
  const fetchUsersFromAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setDataSource("api");
      } else {
        throw new Error("Erro de resposta do servidor.");
      }
    } catch (err: any) {
      console.warn("API offline ou indisponível. Conectando diretamente ao Firebase Firestore...", err);
      // Fallback automático para Firestore para garantir 100% de funcionamento em qualquer plataforma (ex: StackBlitz, Bolt)
      await fetchUsersFromFirestore();
    } finally {
      setLoading(false);
    }
  };

  // Load registered users directly from Firebase Firestore
  const fetchUsersFromFirestore = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "students"));
      const querySnapshot = await getDocs(q);
      const firestoreUsers: AdminUser[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        firestoreUsers.push({
          fullName: data.fullName || "Sem nome",
          email: data.email || doc.id,
          originSchool: data.originSchool || "Não informada",
          createdAt: data.createdAt || new Date().toISOString()
        });
      });

      // Ordenar por data de cadastro mais recente
      firestoreUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setUsers(firestoreUsers);
      setDataSource("firestore");
      setSuccess("Conexão direta com o Firestore efetuada com sucesso!");
      setTimeout(() => setSuccess(null), 3500);
    } catch (err: any) {
      console.error(err);
      setError("Não foi possível conectar ou buscar os dados diretamente do Firebase Firestore. Verifique suas regras de segurança ou conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersFromAPI();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const text = (user.fullName + " " + user.email + " " + user.originSchool).toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  // Basic stats
  const totalUsers = users.length;
  const publicSchoolCount = users.filter(u => 
    u.originSchool.toLowerCase().includes("pública") || 
    u.originSchool.toLowerCase().includes("estadual") || 
    u.originSchool.toLowerCase().includes("cep") || 
    u.originSchool.toLowerCase().includes("federal")
  ).length;

  const publicSchoolPercentage = totalUsers > 0 ? Math.round((publicSchoolCount / totalUsers) * 100) : 0;

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden animate-fade-in" id="admin-lock-screen">
        <div className="bg-[#002f6c] p-6 text-center text-white">
          <div className="inline-flex p-3 bg-white/10 rounded-full mb-3 text-amber-400">
            <Lock size={32} />
          </div>
          <h2 className="text-lg font-bold">Área Administrativa Restrita</h2>
          <p className="text-xs text-slate-200 mt-1">Autenticação de segurança necessária para acessar o banco de dados</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Senha Administrativa
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type={showAdminPassword ? "text" : "password"}
                  placeholder="Digite a senha de administrador"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title={showAdminPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showAdminPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {adminAuthError && (
              <div className="bg-rose-50 text-rose-800 border-l-4 border-rose-600 p-3 rounded text-xs font-medium flex items-center space-x-2">
                <AlertCircle size={14} className="text-rose-600 shrink-0" />
                <span>{adminAuthError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm rounded shadow-md hover:shadow-lg transition duration-150 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <Lock size={15} />
              <span>Desbloquear Painel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="admin-panel">
      {/* Banner Informativo */}
      <div className="bg-[#0b1b3d] text-white p-5 rounded-lg border border-blue-950/40 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert size={20} className="text-amber-400 animate-pulse" />
            <h2 className="text-base font-bold uppercase tracking-wider m-0">
              Painel de Controle e Auditoria de Banco de Dados
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-light leading-relaxed">
            Consulte contas de estudantes e gerencie o catálogo de instituições de ensino superior cadastradas no portal de Curitiba.
          </p>
        </div>

        {/* Alternador de Banco de Dados */}
        <div className="flex space-x-2 shrink-0">
          <button
            onClick={fetchUsersFromAPI}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition ${
              dataSource === "api"
                ? "bg-blue-600 text-white"
                : "bg-[#16274b] text-slate-300 hover:bg-[#20345d] cursor-pointer"
            }`}
            title="Ver usuários salvos no servidor local"
          >
            <Server size={13} />
            <span>Servidor Local (API)</span>
          </button>
          
          <button
            onClick={fetchUsersFromFirestore}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition ${
              dataSource === "firestore"
                ? "bg-amber-500 text-slate-950"
                : "bg-[#16274b] text-slate-300 hover:bg-[#20345d] cursor-pointer"
            }`}
            title="Conectar e ler em tempo real do seu Firebase"
          >
            <Database size={13} />
            <span>Firebase Firestore</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-3 py-1.5 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 rounded text-xs font-bold flex items-center space-x-1.5 transition border border-rose-500/20 cursor-pointer"
            title="Bloquear painel administrativo e sair"
          >
            <LogOut size={13} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Selector triggers */}
      <div className="flex border-b border-slate-200" id="admin-subtabs">
        <button
          onClick={() => setAdminSubTab("usuarios")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
            adminSubTab === "usuarios"
              ? "border-[#002f6c] text-[#002f6c]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Estudantes Cadastrados
        </button>
        <button
          onClick={() => setAdminSubTab("universidades")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
            adminSubTab === "universidades"
              ? "border-[#002f6c] text-[#002f6c]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Gerenciar Instituições
        </button>
      </div>

      {/* Alertas de Status */}
      {error && (
        <div className="bg-rose-50 text-rose-800 border-l-4 border-rose-600 p-3.5 rounded text-xs font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 p-3.5 rounded text-xs font-medium flex items-center space-x-2">
          <Check size={16} className="text-emerald-600 animate-bounce" />
          <span>{success}</span>
        </div>
      )}

      {/* Sub-Tab Content: Usuarios */}
      {adminSubTab === "usuarios" && (
        <div className="space-y-6 animate-fade-in">
          {/* Indicadores do Banco */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-full">
                <Users size={22} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                  Estudantes Cadastrados
                </span>
                <span className="text-2xl font-bold text-slate-800">{totalUsers}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-full">
                <GraduationCap size={22} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                  Vindos de Escola Pública
                </span>
                <span className="text-2xl font-bold text-slate-800">{publicSchoolPercentage}%</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-amber-50 text-amber-800 rounded-full">
                <Database size={22} className={loading ? "animate-spin" : ""} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                  Canal de Conexão Ativo
                </span>
                <span className="text-sm font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <span className={`w-2 h-2 rounded-full mr-1.5 animate-pulse ${
                    dataSource === "firestore" ? "bg-amber-500" : "bg-blue-600"
                  }`}></span>
                  {dataSource === "firestore" ? "Firebase Firestore (Nuvem)" : "users-db.json (Servidor)"}
                </span>
              </div>
            </div>
          </div>

          {/* Tabela de Estudantes */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            {/* Filtros de Busca */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail ou escola..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                onClick={dataSource === "api" ? fetchUsersFromAPI : fetchUsersFromFirestore}
                disabled={loading}
                className="px-3.5 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                <span>Atualizar Tabela</span>
              </button>
            </div>

            {/* Container da Tabela */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin"></div>
                  <p className="text-xs text-slate-500 font-mono">Buscando informações no banco...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-700">Nenhum estudante localizado</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {searchTerm ? "Tente ajustar seu termo de busca para encontrar registros específicos." : "Nenhum cadastro foi realizado neste banco ainda."}
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                      <th className="py-3 px-4">Estudante</th>
                      <th className="py-3 px-4">E-mail de Cadastro</th>
                      <th className="py-3 px-4">Instituição de Ensino de Origem</th>
                      <th className="py-3 px-4">Data de Registro</th>
                      <th className="py-3 px-4 text-center">Isenção Automática</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredUsers.map((user, idx) => {
                      const isPublic = user.originSchool.toLowerCase().includes("pública") || 
                                      user.originSchool.toLowerCase().includes("estadual") || 
                                      user.originSchool.toLowerCase().includes("cep") || 
                                      user.originSchool.toLowerCase().includes("federal");
                      return (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{user.fullName}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">{user.email}</td>
                          <td className="py-3.5 px-4 text-slate-600">{user.originSchool}</td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {new Date(user.createdAt).toLocaleDateString("pt-BR")} às {new Date(user.createdAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isPublic ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}>
                              {isPublic ? "Sim (Isento)" : "Sob Análise"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Rodapé informativo do Banco */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-2">
              <span>
                Mostrando <b>{filteredUsers.length}</b> de <b>{totalUsers}</b> estudantes cadastrados.
              </span>
              <span className="flex items-center space-x-1 text-slate-400">
                <HelpCircle size={11} />
                <span>As contas criadas são salvas na nuvem com criptografia de acesso padrão do Estado.</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab Content: Universidades */}
      {adminSubTab === "universidades" && (
        <div className="space-y-6 animate-fade-in">
          {/* Split layout: Add institution form and List / Trash */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form to Add University */}
            <div className="lg:col-span-1 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1">
                  <Plus size={16} className="text-blue-600" />
                  <span>Adicionar Universidade</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-light">
                  Cadastre uma nova instituição de ensino superior para exibi-la no painel público e liberar botões de acesso.
                </p>
              </div>

              <form onSubmit={handleCreateInstitutionSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Nome da Instituição</label>
                  <input
                    type="text"
                    placeholder="ex: UFPR - Univ. Federal..."
                    value={newInstName}
                    onChange={(e) => setNewInstName(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Categoria</label>
                    <select
                      value={newInstType}
                      onChange={(e) => setNewInstType(e.target.value as any)}
                      className="w-full mt-1 p-2 border border-slate-200 rounded text-xs bg-white text-slate-800"
                    >
                      <option value="Pública Federal">Pública Federal</option>
                      <option value="Pública Estadual">Pública Estadual</option>
                      <option value="Privada Comunitária">Privada Comunitária</option>
                      <option value="Privada">Privada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Ícone (Emoji)</label>
                    <input
                      type="text"
                      placeholder="ex: 🏫, 🏛️, 💻"
                      value={newInstLogo}
                      onChange={(e) => setNewInstLogo(e.target.value)}
                      className="w-full mt-1 p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Descrição da Universidade</label>
                  <textarea
                    placeholder="Histórico, relevância e informações principais de formação..."
                    value={newInstDescription}
                    onChange={(e) => setNewInstDescription(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded text-xs h-20 focus:outline-none focus:border-blue-600 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Campus em Curitiba / RM (separados por vírgula)</label>
                  <input
                    type="text"
                    placeholder="ex: Centro Politécnico, Jardim das Américas"
                    value={newInstCampus}
                    onChange={(e) => setNewInstCampus(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Website URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newInstWebsite}
                      onChange={(e) => setNewInstWebsite(e.target.value)}
                      className="w-full mt-1 p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Destaques / Isenções</label>
                    <input
                      type="text"
                      placeholder="ex: Ingresso 100% SISU"
                      value={newInstHighlights}
                      onChange={(e) => setNewInstHighlights(e.target.value)}
                      className="w-full mt-1 p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Customizable Button Links Section */}
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Links & Botões de Acesso</label>
                    <button
                      type="button"
                      onClick={handleAddLinkRow}
                      className="text-[10px] font-bold text-blue-600 hover:underline flex items-center"
                    >
                      + Novo Link
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {customLinks.map((link, idx) => (
                      <div key={idx} className="flex gap-1 items-center bg-slate-50 p-1.5 rounded border border-slate-100">
                        <input
                          type="text"
                          placeholder="Ícone"
                          value={link.icon}
                          onChange={(e) => handleLinkChange(idx, "icon", e.target.value)}
                          className="w-8 p-1 border border-slate-200 rounded text-[10px] text-center"
                        />
                        <input
                          type="text"
                          placeholder="Rótulo (ex: Vestibular)"
                          value={link.label}
                          onChange={(e) => handleLinkChange(idx, "label", e.target.value)}
                          className="flex-grow p-1 border border-slate-200 rounded text-[10px]"
                          required
                        />
                        <input
                          type="url"
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => handleLinkChange(idx, "url", e.target.value)}
                          className="flex-grow p-1 border border-slate-200 rounded text-[10px]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveLinkRow(idx)}
                          className="text-rose-500 p-0.5 hover:bg-rose-50 rounded"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition flex items-center justify-center space-x-1"
                >
                  <Plus size={13} />
                  <span>Cadastrar Universidade</span>
                </button>
              </form>
            </div>

            {/* Active Universities list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Building size={16} className="text-[#002f6c]" />
                  <span>Universidades Ativas ({institutions.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-light mt-0.5">
                  Essas instituições estão sendo listadas na aba pública "Instituições" e no simulador.
                </p>

                <div className="mt-4 divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-2">
                  {institutions.map((inst) => (
                    <div key={inst.id} className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/50 transition px-2 rounded">
                      <div className="flex items-start space-x-2.5">
                        <span className="text-xl p-1.5 bg-slate-100 rounded block">{inst.logo}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{inst.name}</h4>
                          <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider block w-max mt-0.5">{inst.type}</span>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-light">{inst.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteInstitution(inst.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded transition flex items-center space-x-1 cursor-pointer shrink-0"
                        title="Mover para lixeira"
                      >
                        <Trash2 size={13} />
                        <span className="text-[10px] font-bold">Excluir</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trash Can ("Lixeira") */}
              <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                  <Trash2 size={16} className="text-slate-600" />
                  <span>Lixeira de Instituições ({trashInstitutions.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-light mt-0.5">
                  Universidades excluídas são enviadas para cá. Você pode restaurá-las a qualquer momento ou excluí-las permanentemente.
                </p>

                {trashInstitutions.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 font-light">
                    Lixeira vazia. Nenhuma universidade descartada recentemente.
                  </div>
                ) : (
                  <div className="mt-3 divide-y divide-slate-200">
                    {trashInstitutions.map((inst) => (
                      <div key={inst.id} className="py-2.5 flex items-center justify-between gap-2 px-2 hover:bg-slate-100 rounded transition">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{inst.logo}</span>
                          <div>
                            <span className="text-xs font-semibold text-slate-700">{inst.name}</span>
                            <span className="text-[9px] text-slate-400 block">{inst.type}</span>
                          </div>
                        </div>

                        <div className="flex space-x-1">
                          <button
                            onClick={() => onRestoreInstitution(inst.id)}
                            className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-[#002f6c] hover:border-[#002f6c] rounded text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                            title="Restaurar universidade"
                          >
                            <RotateCcw size={10} />
                            <span>Restaurar</span>
                          </button>
                          <button
                            onClick={() => onPermanentDeleteInstitution(inst.id)}
                            className="px-2 py-1 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 rounded text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                            title="Excluir permanentemente"
                          >
                            <Trash2 size={10} />
                            <span>Definitivo</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
