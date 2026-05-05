# 🌊 Água Viva — Configuração com Supabase

Guia completo para colocar o projeto no ar usando o Supabase como backend.

---

## O que foi alterado

| Arquivo | O que mudou |
|---|---|
| `services/api/requests/user.ts` | Substituiu chamadas à API antiga pelo Supabase Auth + tabela `users` |
| `services/api/requests/form.ts` | Substituiu chamadas à API antiga pela tabela `forms` + Storage |
| `services/api/config.ts` | **Removido** (axios/api antiga não é mais usado) |
| `contexts/auth.tsx` | Adaptado para usar `supabase.auth.signInWithPassword` |
| `lib/supabaseClient.ts` | **Novo** — cliente Supabase compartilhado |
| `package.json` | Adicionado `@supabase/supabase-js` |
| `supabase_migration.sql` | **Novo** — script SQL para criar as tabelas no Supabase |

---

## Passo a passo para configurar

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em **New Project**
3. Dê um nome (ex: `agua-viva`), escolha a região **South America (São Paulo)** e defina uma senha segura
4. Aguarde o projeto ser criado (~1 min)

---

### 2. Criar as tabelas (rodar o SQL)

1. No painel do projeto, vá em **SQL Editor** (ícone de banco de dados no menu lateral)
2. Clique em **New query**
3. Cole todo o conteúdo do arquivo `supabase_migration.sql`
4. Clique em **Run**

---

### 3. Configurar as variáveis de ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.local.example .env.local
   ```

2. No painel do Supabase, vá em **Project Settings → API**

3. Copie os valores e cole no `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xyzxyzxyz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciO...
   NEXT_PUBLIC_SITE_URL=https://aguaviva.grael.org.br
   ```

---

### 4. Criar o primeiro usuário admin

1. No painel do Supabase, vá em **Authentication → Users**
2. Clique em **Invite user** e insira o e-mail do admin
3. O usuário receberá um e-mail para definir a senha
4. Depois que ele confirmar o e-mail, copie o **UUID** gerado (coluna "UID")
5. Vá em **SQL Editor** e rode:
   ```sql
   INSERT INTO public.users (auth_id, role, name, email, phone, goal)
   VALUES (
     'COLE_AQUI_O_UUID',  -- UUID copiado no passo anterior
     1,                    -- role 1 = admin
     'Nome do Admin',
     'admin@email.com',
     '21999999999',
     100
   );
   ```

---

### 5. Instalar dependências e rodar

```bash
# Instalar dependências (inclui o novo @supabase/supabase-js)
npm install
# ou
yarn

# Rodar em modo desenvolvimento
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) e faça login com o usuário criado.

---

### 6. Deploy (Vercel)

Se o projeto está hospedado na Vercel:

1. Vá em **Project Settings → Environment Variables**
2. Adicione as mesmas variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
3. Faça um novo deploy

---

## Estrutura das tabelas

### `users`
| Campo | Tipo | Descrição |
|---|---|---|
| id | bigserial | ID interno |
| auth_id | uuid | Referência ao Supabase Auth |
| role | integer | 1=admin, 2=professor, 3=outros |
| name | text | Nome completo |
| email | text | E-mail |
| phone | text | Telefone (opcional) |
| goal | integer | Meta numérica |

### `forms`
| Campo | Tipo | Descrição |
|---|---|---|
| id | bigserial | ID do formulário |
| teacher_id | bigint | FK para `users` |
| registeredBy | text | Nome de quem registrou |
| name | text | Nome do grupo/turma |
| shift | text | Período (manhã/tarde/noite) |
| weather | text | Clima |
| wind | text | Vento |
| floatingLitter | text | Lixo flutuante |
| waterStatus | text | Estado da água |
| tideLevel | text | Nível da maré |
| latitude | text | Coordenada |
| longitude | text | Coordenada |
| score | integer | Pontuação |
| fileURIs | text[] | URLs dos arquivos no Storage |

---

## Dúvidas frequentes

**O login não funciona após configurar**
→ Verifique se a tabela `users` tem um registro com o `email` igual ao usuário do Auth. O login busca o perfil pelo e-mail.

**Erro "relation users does not exist"**
→ O SQL da migração não foi executado. Rode o `supabase_migration.sql` no SQL Editor.

**Imagens dos formulários não aparecem**
→ Verifique se o bucket `form-files` foi criado (Storage no painel) e se a política de acesso público está ativa.
