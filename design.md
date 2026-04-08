# Design - Pauta On Responsável

## Visão Geral

Aplicativo informativo para responsáveis de alunos no sistema **Pauta On**. O app recebe e exibe informativos sobre datas importantes, reuniões, formaturas, pedidos de autorização e eventos acadêmicos. O foco é apresentar informações de forma clara, organizada e acessível em uma única mão.

---

## Telas Principais

### 1. **Home (Informativos)**
- **Conteúdo Principal**: Lista de informativos em cards com:
  - Ícone/categoria (Período, Reunião, Formatura, Autorização, Evento)
  - Título do informativo
  - Data/hora do evento
  - Resumo/descrição breve
  - Badge de status (novo, importante, urgente)
- **Funcionalidade**:
  - Pull-to-refresh para atualizar informativos
  - Scroll vertical para ver mais informativos
  - Tap em card → Detalhes do informativo
  - Filtro por categoria (opcional, na barra superior)

### 2. **Detalhes do Informativo**
- **Conteúdo Principal**:
  - Título completo
  - Categoria com ícone
  - Data/hora do evento
  - Local (se aplicável)
  - Descrição completa
  - Ações (se aplicável): "Confirmar Presença", "Enviar Autorização", "Adicionar ao Calendário"
  - Contato/responsável (nome, email, telefone)
- **Navegação**: Botão voltar no topo

### 3. **Perfil/Configurações**
- **Conteúdo Principal**:
  - Informações do responsável (nome, email, telefone)
  - Informações do aluno(a) vinculado(a)
  - Preferências de notificações
  - Sobre o app
  - Logout

---

## Fluxos de Usuário Principais

### Fluxo 1: Visualizar Informativos
1. Usuário abre o app → Home com lista de informativos
2. Usuário vê cards com resumos
3. Usuário faz pull-to-refresh → atualiza lista
4. Usuário toca em um card → vai para Detalhes

### Fluxo 2: Visualizar Detalhes e Confirmar
1. Usuário está em Detalhes do Informativo
2. Usuário lê descrição completa
3. Usuário toca em "Confirmar Presença" ou "Enviar Autorização"
4. Feedback visual (toast ou modal) confirma ação
5. Usuário volta para Home

### Fluxo 3: Acessar Perfil
1. Usuário toca na aba "Perfil" (tab bar)
2. Vê informações pessoais e do aluno
3. Pode ajustar preferências de notificações
4. Pode fazer logout

---

## Paleta de Cores (Pauta On)

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Primary** | `#0a7ea4` (Azul Pauta On) | Botões, destaques, ícones ativos |
| **Background** | `#ffffff` (Branco) | Fundo das telas |
| **Surface** | `#f5f5f5` (Cinza claro) | Cards, superfícies elevadas |
| **Foreground** | `#11181C` (Cinza escuro) | Texto principal |
| **Muted** | `#687076` (Cinza médio) | Texto secundário, datas |
| **Border** | `#E5E7EB` (Cinza muito claro) | Divisores, bordas |
| **Success** | `#22C55E` (Verde) | Confirmações, status positivo |
| **Warning** | `#F59E0B` (Laranja) | Alertas, atenção |
| **Error** | `#EF4444` (Vermelho) | Erros, urgência |

### Dark Mode
- **Background**: `#151718` (Cinza muito escuro)
- **Surface**: `#1e2022` (Cinza escuro)
- **Foreground**: `#ECEDEE` (Branco off)
- **Muted**: `#9BA1A6` (Cinza claro)

---

## Componentes Visuais

### Cards de Informativos
- Fundo: `surface`
- Borda: `border` (0.5px)
- Padding: 16px
- Border-radius: 12px
- Sombra: leve (iOS-style)
- Ícone à esquerda (24x24)
- Título em bold, foreground
- Data em muted, menor
- Badge no canto superior direito (novo/urgente)

### Botões Primários
- Fundo: `primary`
- Texto: branco
- Padding: 12px 24px
- Border-radius: 8px
- Press state: scale 0.97 + haptic

### Botões Secundários
- Fundo: `surface`
- Texto: `primary`
- Borda: `border`
- Padding: 12px 24px
- Border-radius: 8px

### Tab Bar
- Ícones: 24x24
- Cor inativa: `muted`
- Cor ativa: `primary`
- Rótulos: "Home", "Perfil"

---

## Tipografia

| Elemento | Tamanho | Peso | Altura da linha |
|----------|---------|------|-----------------|
| Título de tela | 28px | Bold (700) | 1.2 |
| Título de card | 16px | Semibold (600) | 1.4 |
| Texto corpo | 14px | Regular (400) | 1.5 |
| Texto pequeno | 12px | Regular (400) | 1.4 |
| Botão | 14px | Semibold (600) | 1.4 |

---

## Layout e Espaçamento

- **Padding das telas**: 16px (horizontal), 12px (vertical)
- **Gap entre cards**: 12px
- **Gap entre seções**: 24px
- **Radius padrão**: 12px para cards, 8px para botões
- **Altura do tab bar**: 56px + safe area

---

## Acessibilidade

- Contraste mínimo 4.5:1 para texto
- Ícones com labels descritivos
- Botões com tamanho mínimo de 44x44pt
- Suporte a dark mode automático
- Suporte a VoiceOver/TalkBack

---

## Orientação e Responsividade

- **Orientação**: Portrait (9:16)
- **Uso com uma mão**: Botões e elementos interativos no terço inferior da tela
- **Breakpoints**: Não aplicável (mobile only)

---

## Próximos Passos

1. Implementar Home com lista de informativos (mock data)
2. Implementar tela de Detalhes
3. Implementar tela de Perfil
4. Adicionar navegação entre telas (tab bar)
5. Ajustar cores e branding do Pauta On
6. Gerar logo/ícone do app
