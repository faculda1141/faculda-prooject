import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, orderBy } from "firebase/firestore";
import firebaseConfigFile from "../../firebase-applet-config.json";

// Suporte flexível para Variáveis de Ambiente (Vite/GitHub/Vercel) ou arquivo de configuração local
const env = (import.meta as any).env || {};
const config = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseConfigFile.projectId,
  appId: env.VITE_FIREBASE_APP_ID || firebaseConfigFile.appId,
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseConfigFile.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigFile.authDomain,
  firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || firebaseConfigFile.firestoreDatabaseId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigFile.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigFile.messagingSenderId,
};

// Inicializa o aplicativo Firebase
const app = initializeApp(config);

// Inicializa o banco de dados Firestore (seja padrão ou com databaseId específico)
export const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)"
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Exportações úteis para o restante da aplicação utilizar
export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy
};

console.log("🔥 [Firebase] Inicializado com sucesso para o projeto:", config.projectId);
