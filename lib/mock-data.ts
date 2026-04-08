/**
 * Dados mock para desenvolvimento e testes
 */

import { Informativo, Responsavel, Aluno } from './types';

export const mockAluno: Aluno = {
  id: 'aluno-001',
  nome: 'João Silva Santos',
  matricula: '2024-001',
  serie: '8º ano',
  turma: 'A',
};

export const mockResponsavel: Responsavel = {
  id: 'resp-001',
  nome: 'Maria Silva Santos',
  email: 'maria.silva@email.com',
  telefone: '(11) 98765-4321',
  aluno: mockAluno,
};

export const mockInformativos: Informativo[] = [
  {
    id: 'info-001',
    titulo: 'Início do Período Letivo 2026',
    categoria: 'periodo',
    data: new Date('2026-04-06'),
    local: 'Escola Pauta On',
    descricao: 'Bem-vindo ao novo período letivo! As aulas começam no dia 6 de abril de 2026. Solicitamos que todos os alunos compareçam com uniforme completo e material escolar.',
    resumo: 'Aulas começam em 6 de abril',
    status: 'importante',
    contato: {
      nome: 'Coordenação Pedagógica',
      email: 'coordenacao@pautaon.edu.br',
      telefone: '(11) 3000-1000',
    },
  },
  {
    id: 'info-002',
    titulo: 'Reunião de Pais - 1º Bimestre',
    categoria: 'reuniao',
    data: new Date('2026-04-20'),
    local: 'Auditório da Escola',
    descricao: 'Reunião com os responsáveis para apresentação do desempenho dos alunos no primeiro bimestre. Será abordado o desempenho acadêmico, comportamento e atividades extracurriculares.',
    resumo: 'Reunião de pais em 20 de abril',
    status: 'normal',
    requerConfirmacao: true,
    contato: {
      nome: 'Direção da Escola',
      email: 'direcao@pautaon.edu.br',
    },
  },
  {
    id: 'info-003',
    titulo: 'Autorização para Passeio Pedagógico',
    categoria: 'autorizacao',
    data: new Date('2026-04-25'),
    local: 'Museu de Ciências',
    descricao: 'Solicitamos autorização dos responsáveis para participação do aluno em passeio pedagógico ao Museu de Ciências. A saída será em 25 de abril, com retorno previsto para as 17h30. Favor assinar e devolver o formulário de autorização.',
    resumo: 'Autorização necessária para passeio',
    status: 'urgente',
    requerAutorizacao: true,
    contato: {
      nome: 'Professora de Ciências',
      email: 'ciencias@pautaon.edu.br',
    },
  },
  {
    id: 'info-004',
    titulo: 'Formatura da 8ª Série',
    categoria: 'formatura',
    data: new Date('2026-11-20'),
    local: 'Salão de Festas da Escola',
    descricao: 'Convite para a cerimônia de formatura da 8ª série. A cerimônia acontecerá no dia 20 de novembro, às 19h00. Uniforme: traje social. Favor confirmar presença.',
    resumo: 'Formatura em 20 de novembro',
    status: 'importante',
    requerConfirmacao: true,
    contato: {
      nome: 'Coordenação de Eventos',
      email: 'eventos@pautaon.edu.br',
    },
  },
  {
    id: 'info-005',
    titulo: 'Olimpíada de Matemática 2026',
    categoria: 'evento',
    data: new Date('2026-05-15'),
    local: 'Sala de Aula 8A',
    descricao: 'Inscrições abertas para a Olimpíada de Matemática 2026. Participação é opcional e gratuita. A prova será realizada em 15 de maio. Interessados devem se inscrever com o professor de Matemática.',
    resumo: 'Olimpíada de Matemática em 15 de maio',
    status: 'normal',
    contato: {
      nome: 'Professor de Matemática',
      email: 'matematica@pautaon.edu.br',
    },
  },
  {
    id: 'info-006',
    titulo: 'Fim do Período Letivo',
    categoria: 'periodo',
    data: new Date('2026-11-27'),
    local: 'Escola Pauta On',
    descricao: 'Encerramento do período letivo de 2026. Último dia de aulas: 27 de novembro. Retorno previsto para 2027.',
    resumo: 'Fim das aulas em 27 de novembro',
    status: 'normal',
    contato: {
      nome: 'Secretaria da Escola',
      email: 'secretaria@pautaon.edu.br',
    },
  },
];
