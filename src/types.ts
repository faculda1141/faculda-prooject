export interface Institution {
  id: string;
  name: string;
  type: "Pública Federal" | "Pública Estadual" | "Privada Comunitária" | "Privada";
  campus: string[];
  website: string;
  description: string;
  highlights: string;
  logo: string;
  customLinks?: { label: string; url: string; icon: string }[];
}

export interface EditalDeadline {
  id: string;
  title: string;
  institutionId: string;
  institutionName: string;
  type: "Vestibular" | "Isenção de Taxa" | "SISU" | "Bolsas & ProUni" | "Transferência";
  deadlineDate: string; // ISO format or clear PT-BR string
  status: "abertao" | "por_vir" | "encerrado"; // active, coming soon, closed
  officialLink: string;
  description: string;
  requirements?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
}

export interface CareerArea {
  id: string;
  name: string;
  category: "Engenharias & TI" | "Saúde & Biológicas" | "Humanas & Artes" | "Negócios & Ciências Sociais";
  description: string;
  skills: string[];
  salariesCuritiba: string;
  institutionsOffering: string[];
  iconName: string;
}

export interface UserSession {
  isAuthenticated: boolean;
  user: {
    email: string;
    fullName: string;
    gender?: string;
    originSchool?: string;
  } | null;
}
