import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, type Usuario } from './supabase';

interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  erro: string | null;
  isAdmin: boolean;

  login: (email: string, senha: string) => Promise<void>;
  mudarSenha: (novaSenha: string) => Promise<void>;
  logout: () => Promise<void>;
  restaurarSessao: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    restaurarSessao();
  }, []);

  const restaurarSessao = async () => {
    try {
      setCarregando(true);
      const usuarioSalvo = await AsyncStorage.getItem('usuario');
      if (usuarioSalvo) {
        setUsuario(JSON.parse(usuarioSalvo));
      }
    } catch (err) {
      console.error('Erro ao restaurar sessão:', err);
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      setCarregando(true);
      setErro(null);

      const { data: usuariosData, error: usuariosError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.trim())
        .single();

      if (usuariosError || !usuariosData) {
        throw new Error('Email ou senha incorretos');
      }

      const senhaArmazenada = (usuariosData.senha_provisoria || '').trim();
      const senhaNormalizada = senha.trim();

      if (senhaArmazenada !== senhaNormalizada) {
        throw new Error('Email ou senha incorretos');
      }

      // Tentar integrar com Supabase Auth (opcional, não bloqueia)
      try {
        await supabase.auth.signInWithPassword({ email: email.trim(), password: senha.trim() });
      } catch {
        // Continua mesmo se o Supabase Auth falhar
      }

      setUsuario(usuariosData);
      await AsyncStorage.setItem('usuario', JSON.stringify(usuariosData));
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao fazer login';
      setErro(mensagem);
      throw err;
    } finally {
      setCarregando(false);
    }
  };

  const mudarSenha = async (novaSenha: string) => {
    try {
      if (!usuario) throw new Error('Usuário não autenticado');
      setCarregando(true);
      setErro(null);

      const { error } = await supabase
        .from('usuarios')
        .update({
          senha_hash: novaSenha,
          primeiro_login: false,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', usuario.id);

      if (error) throw error;

      const usuarioAtualizado = { ...usuario, primeiro_login: false, senha_hash: novaSenha };
      setUsuario(usuarioAtualizado);
      await AsyncStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao mudar senha';
      setErro(mensagem);
      throw err;
    } finally {
      setCarregando(false);
    }
  };

  const logout = async () => {
    try {
      setCarregando(true);
      try { await supabase.auth.signOut(); } catch { /* ignora */ }
      setUsuario(null);
      setErro(null);
      await AsyncStorage.multiRemove(['usuario', 'alunoSelecionado', 'alunos']);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      setCarregando(false);
    }
  };

  const isAdmin = usuario?.tipo_usuario === 'admin';

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        erro,
        isAdmin,
        login,
        mudarSenha,
        logout,
        restaurarSessao,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}