# Setup OAuth - Google e Microsoft

## Para Ativar OAuth no App

### 1. **Google OAuth**

No Supabase:
1. Vá para **Authentication** → **Providers**
2. Ative **Google**
3. Adicione suas credenciais (Client ID e Secret do Google Cloud Console)

No App (app/login.tsx):
```typescript
import * as WebBrowser from 'expo-web-browser';

const handleGoogleLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'pauta-on://auth/callback', // Use seu scheme
      },
    });
    if (error) throw error;
    // Usuário logado com sucesso
  } catch (err) {
    Alert.alert('Erro', 'Falha ao fazer login com Google');
  }
};
```

### 2. **Microsoft OAuth**

No Supabase:
1. Vá para **Authentication** → **Providers**
2. Ative **Microsoft**
3. Adicione suas credenciais (Client ID e Secret do Azure)

No App:
```typescript
const handleMicrosoftLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: 'pauta-on://auth/callback',
      },
    });
    if (error) throw error;
  } catch (err) {
    Alert.alert('Erro', 'Falha ao fazer login com Microsoft');
  }
};
```

### 3. **Configurar Deep Linking**

No `app.config.ts`:
```typescript
scheme: 'pauta-on',
intentFilters: [
  {
    action: 'VIEW',
    autoVerify: true,
    data: [
      {
        scheme: 'pauta-on',
        host: '*',
      },
    ],
    category: ['BROWSABLE', 'DEFAULT'],
  },
],
```

### 4. **Criar Callback Handler**

Arquivo: `app/auth/callback.tsx`
```typescript
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    // Supabase automaticamente processa o callback
    // Redirecionar para home após login bem-sucedido
    router.replace('/(tabs)');
  }, []);

  return null;
}
```

## Próximos Passos

1. Criar credenciais no Google Cloud Console e Azure
2. Adicionar URLs de callback no console de cada provedor
3. Testar login em ambiente de desenvolvimento
4. Publicar app para testar em produção

## Documentação Oficial

- [Supabase OAuth](https://supabase.com/docs/guides/auth/social-login)
- [Expo Web Browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)
- [Deep Linking](https://docs.expo.dev/guides/deep-linking/)
