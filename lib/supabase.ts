import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para o banco de dados
export interface Usuario {
  id: number;
  email: string;
  senha_provisoria: string;
  senha_hash: string | null;
  nome: string;
  primeiro_login: boolean;
  tipo_usuario: 'admin' | 'responsavel';
  criado_em: string;
  atualizado_em: string;
}

export interface Aluno {
  id: number;
  matricula: string;
  nome: string;
  email_responsavel: string;
  serie: string;
  escola: string;
  criado_em: string;
}

export interface Informativo {
  id: number;
  aluno_id: number;
  titulo: string;
  resumo: string | null;
  descricao: string;
  tipo: string;
  local: string | null;
  data_evento: string | null;
  hora_evento: string | null;
  status: string;
  criado_em: string;
  atualizado_em: string;
}
