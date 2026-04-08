# Pauta On - Módulo Responsável

Aplicativo móvel para o sistema **Pauta On**, permitindo que responsáveis de alunos recebam e gerenciem informativos acadêmicos como datas de períodos letivos, reuniões, formaturas, pedidos de autorização e eventos.

## Visão Geral

O **Pauta On Responsável** é um aplicativo informativo focado em notificações acadêmicas. Responsáveis podem:

- **Visualizar informativos** sobre datas importantes, reuniões e eventos
- **Confirmar presença** em reuniões e eventos
- **Enviar autorizações** para atividades e passeios pedagógicos
- **Gerenciar preferências** de notificações
- **Acessar informações** do aluno vinculado

## Tecnologia

| Componente | Versão |
|-----------|--------|
| **Expo** | 54.0.29 |
| **React Native** | 0.81.5 |
| **React** | 19.1.0 |
| **TypeScript** | 5.9 |
| **NativeWind** | 4.2.1 (Tailwind CSS) |
| **Expo Router** | 6.0.19 |

## Estrutura do Projeto

```
pauta-on-responsavel/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Configuração do tab bar
│   │   ├── index.tsx            # Home - Lista de informativos
│   │   └── profile.tsx          # Perfil do responsável
│   ├── _layout.tsx              # Root layout com providers
│   └── details.tsx              # Detalhes do informativo
├── components/
│   ├── screen-container.tsx     # Wrapper com SafeArea
│   ├── themed-view.tsx          # View com tema automático
│   └── ui/
│       └── icon-symbol.tsx      # Ícones SF Symbols / Material Icons
├── hooks/
│   ├── use-auth.ts              # Hook de autenticação
│   ├── use-colors.ts            # Hook de cores do tema
│   └── use-color-scheme.ts      # Hook de dark/light mode
├── lib/
│   ├── types.ts                 # Tipos e interfaces
│   ├── mock-data.ts             # Dados simulados para desenvolvimento
│   ├── utils.ts                 # Funções utilitárias (cn)
│   └── theme-provider.tsx       # Context de tema
├── constants/
│   └── theme.ts                 # Paleta de cores
├── assets/
│   └── images/
│       ├── icon.png             # Ícone do app
│       ├── splash-icon.png      # Ícone splash
│       ├── favicon.png          # Favicon web
│       └── android-icon-*.png   # Ícones Android
├── app.config.ts                # Configuração Expo
├── tailwind.config.js           # Configuração Tailwind
├── theme.config.js              # Paleta de cores
└── package.json                 # Dependências
```

## Telas Principais

### 1. Home (Informativos)
Lista de informativos com:
- Categorias: Período, Reunião, Formatura, Autorização, Evento
- Status: Novo, Importante, Urgente
- Data, hora e local
- Pull-to-refresh para atualizar

### 2. Detalhes do Informativo
Visualização completa com:
- Descrição detalhada
- Data, hora e local
- Informações de contato
- Ações (confirmar presença, enviar autorização, adicionar ao calendário)

### 3. Perfil
Informações do responsável e aluno:
- Dados pessoais do responsável
- Informações do aluno vinculado
- Preferências de notificações
- Logout

## Paleta de Cores (Pauta On)

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| **primary** | #0a7ea4 | #0a7ea4 | Botões, destaques, ícones ativos |
| **background** | #ffffff | #151718 | Fundo das telas |
| **surface** | #f5f5f5 | #1e2022 | Cards, superfícies elevadas |
| **foreground** | #11181C | #ECEDEE | Texto principal |
| **muted** | #687076 | #9BA1A6 | Texto secundário |
| **border** | #E5E7EB | #334155 | Divisores, bordas |
| **success** | #22C55E | #4ADE80 | Confirmações |
| **warning** | #F59E0B | #FBBF24 | Alertas |
| **error** | #EF4444 | #F87171 | Erros, urgência |

## Como Executar

### Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Abrir em Expo Go (iOS/Android)
# Escanear QR code com Expo Go app
```

### Build para Produção

```bash
# Build para iOS
eas build --platform ios

# Build para Android
eas build --platform android
```

## Dados Simulados

O aplicativo usa dados mock para desenvolvimento. Veja `lib/mock-data.ts` para:
- Responsável e aluno vinculado
- 6 informativos de exemplo com categorias variadas

Para integrar com backend real, substitua os dados mock por chamadas API.

## Tipos e Interfaces

### Informativo
```typescript
interface Informativo {
  id: string;
  titulo: string;
  categoria: 'periodo' | 'reuniao' | 'formatura' | 'autorizacao' | 'evento';
  data: Date;
  local?: string;
  descricao: string;
  resumo: string;
  status: 'novo' | 'importante' | 'urgente' | 'normal';
  requerConfirmacao?: boolean;
  requerAutorizacao?: boolean;
  contato?: { nome: string; email?: string; telefone?: string };
}
```

### Responsável
```typescript
interface Responsavel {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  aluno: Aluno;
}
```

## Acessibilidade

- ✅ Contraste mínimo 4.5:1 para texto
- ✅ Ícones com labels descritivos
- ✅ Botões com tamanho mínimo 44x44pt
- ✅ Suporte a dark mode automático
- ✅ Suporte a VoiceOver/TalkBack

## Próximas Etapas

Para integração com o sistema Pauta On:

1. **Autenticação**: Implementar login com OAuth/JWT
2. **API Integration**: Conectar com backend para sincronizar informativos
3. **Push Notifications**: Integrar notificações push com Expo Notifications
4. **Persistência**: Usar AsyncStorage ou banco de dados local
5. **Filtros**: Adicionar filtros por categoria e data
6. **Compartilhamento**: Permitir compartilhamento de informativos

## Suporte

Para dúvidas ou sugestões sobre o aplicativo, consulte a documentação do Expo:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)

---

**Versão**: 1.0.0  
**Última atualização**: Abril de 2026  
**Desenvolvido com**: Expo + React Native + TypeScript
