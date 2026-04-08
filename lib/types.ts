/**
 * Tipos e interfaces para o aplicativo Pauta On
 */

export type InformativoCategory = 'periodo' | 'reuniao' | 'formatura' | 'autorizacao' | 'evento';

export type InformativoStatus = 'novo' | 'importante' | 'urgente' | 'normal';

export interface Informativo {
  id: string;
  titulo: string;
  categoria: InformativoCategory;
  data: Date;
  local?: string;
  descricao: string;
  resumo: string;
  status: InformativoStatus;
  requerConfirmacao?: boolean;
  requerAutorizacao?: boolean;
  contato?: {
    nome: string;
    email?: string;
    telefone?: string;
  };
  confirmado?: boolean;
  autorizacaoEnviada?: boolean;
}

export interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  serie: string;
  turma: string;
}

export interface Responsavel {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  aluno: Aluno;
}

export interface AppState {
  responsavel: Responsavel | null;
  informativos: Informativo[];
  notificacoesAtivas: boolean;
}
