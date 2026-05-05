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


export interface NotificationToken {
  id: number;
  usuario_id: number | null;
  token: string;
  plataforma: 'ios' | 'android' | 'web';
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

// Funcao para enviar notificacoes para todos os usuarios
export async function enviarNotificacaoParaTodos(
  titulo: string,
  mensagem: string,
  dados?: Record<string, any>
) {
  try {
    // Buscar todos os tokens ativos
    const { data: tokens, error: tokensError } = await supabase
      .from('notification_tokens')
      .select('token')
      .eq('ativo', true);

    if (tokensError) {
      console.error('Erro ao buscar tokens:', tokensError);
      return { success: false, error: tokensError };
    }

    if (!tokens || tokens.length === 0) {
      console.warn('Nenhum token de notificacao encontrado');
      return { success: true, enviados: 0 };
    }

    // Enviar notificacoes via API Expo
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: tokens.map((t) => t.token),
        sound: 'default',
        title: titulo,
        body: mensagem,
        data: dados || {},
        ttl: 86400, // 24 horas
      }),
    });

    const result = await response.json();
    console.log('Notificacoes enviadas:', result);
    return { success: true, enviados: tokens.length, resultado: result };
  } catch (err) {
    console.error('Erro ao enviar notificacoes:', err);
    return { success: false, error: err };
  }
}
