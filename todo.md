# Project TODO - Pauta On Responsável

## Fase 1: Estrutura Base
- [x] Configurar tema e cores do Pauta On
- [x] Gerar logo/ícone do app
- [x] Atualizar app.config.ts com branding
- [x] Configurar tab bar com Home e Perfil

## Fase 2: Telas Principais
- [x] Implementar Home com lista de informativos (mock data)
- [x] Implementar tela de Detalhes do Informativo
- [x] Implementar tela de Perfil/Configurações
- [x] Adicionar navegação entre telas

## Fase 3: Funcionalidades
- [x] Implementar pull-to-refresh na Home
- [x] Implementar ações (Confirmar Presença, Enviar Autorização)
- [ ] Adicionar filtros de categoria (opcional)
- [x] Implementar feedback visual (toasts, modals)

## Fase 4: Refinamento
- [x] Ajustar espaçamento e tipografia
- [x] Validar contraste e acessibilidade
- [x] Testar dark mode
- [x] Revisar fluxos de usuário

## Fase 5: Entrega
- [x] Criar checkpoint final
- [x] Documentação do projeto


## Fase 6: Novas Funcionalidades (Admin + WhatsApp)
- [x] Adicionar botão "Fale com a Secretaria" com link WhatsApp (21) 97253-1909
- [x] Implementar tela de edição de informativos (admin)
- [x] Adicionar autenticação de admin (mock)
- [x] Criar modal/form para editar informativo
- [x] Salvar edições em estado local
- [x] Validar campos obrigatórios


## Fase 7: Autenticação com Supabase
- [x] Instalar dependências Supabase (@supabase/supabase-js)
- [x] Criar contexto de autenticação (AuthContext)
- [x] Implementar tela de Login (email + senha provisória)
- [x] Implementar tela de Mudança de Senha (1º login)
- [x] Implementar tela de Seleção de Aluno (múltiplos filhos)
- [x] Proteger rotas (redirect para login se não autenticado)
- [x] Persistir sessão com AsyncStorage
- [x] Implementar logout

## Fase 8: Integração com Supabase
- [ ] Buscar informativos do Supabase (por aluno_id)
- [ ] Atualizar Home para mostrar informativos do aluno selecionado
- [ ] Implementar seletor de aluno na Home
- [ ] Sincronizar dados de aluno selecionado
- [ ] Testar fluxo completo de autenticação


## Fase 8: Bugs e Permissões
- [x] Corrigir logout (não limpa sessão de fato)
- [x] Tornar campo "CONTATO" editável na tela de edição
- [x] Adicionar campo tipo_usuario (admin/responsavel) no Supabase
- [x] Implementar sistema de permissões no AuthContext
- [x] Esconder botão "Editar" para usuários responsáveis
- [ ] Criar interface separada para Admin
- [ ] Criar interface separada para Responsável
- [x] Corrigir problema do teclado escondendo campos (KeyboardAvoidingView)


## Fase 9: Melhorias Finais
- [x] Criar interfaces separadas para Admin e Responsável
- [x] Integrar informativos reais do Supabase (queries por aluno_id)
- [x] Implementar recuperação de senha (Esqueci minha senha)
- [x] Dashboard admin com opções de criar/editar/deletar informativos
- [x] Testar fluxo completo com dados reais

## Fase 10: Extras (Econômicos)
- [x] Dashboard Admin separado com CRUD
- [x] Setup básico de notificações push
- [x] Guia de OAuth Google/Microsoft


## Fase 11: Criar Novo Informativo (Admin)
- [x] Implementar tela admin-create.tsx com formulário
- [x] Validar campos obrigatórios (título, descrição, aluno, data)
- [x] Integrar com Supabase para salvar novo informativo
- [x] Redirecionar para dashboard após criar
- [x] Adicionar botão "Novo Informativo" funcional


## Bug Report
- [x] Edição de informativos não salva alterações no Supabase (local, resumo, etc) - CORRIGIDO
- [x] Mudança de senha não era acionada no primeiro login - CORRIGIDO


## Fase 12: Bugs Finais e Adaptação para Informativos Gerais
- [ ] Corrigir erro ao editar informativos
- [ ] Corrigir função de deletar informativos
- [ ] Remover obrigatoriedade de selecionar aluno (informativos gerais)
- [ ] Adaptar Home para mostrar todos os informativos (não filtrados por aluno)
- [ ] Remover seletor de aluno na Home (se informativos são gerais)
- [ ] Testar fluxo completo
