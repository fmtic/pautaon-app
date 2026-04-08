import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, type Aluno, type Usuario } from './supabase';

interface AuthContextType {
  usuario: Usuario | null;
  alunos: Aluno[];
  alunoSelecionado: Aluno | null;
  carregando: boolean;
  erro: string | null;
  isAdmin: boolean;
  
  // Métodos
  login: (email: string, senha: string) => Promise<void>;
  mudarSenha: (novaSenha: string) => Promise<void>;
  selecionarAluno: (aluno: Aluno) => Promise<void>;
  logout: () => Promise<void>;
  restaurarSessao: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Restaurar sessão ao iniciar o app
  useEffect(() => {
    restaurarSessao();
  }, []);

  const restaurarSessao = async () => {
    try {
      setCarregando(true);
      const usuarioSalvo = await AsyncStorage.getItem('usuario');
      const alunoSalvo = await AsyncStorage.getItem('alunoSelecionado');

      if (usuarioSalvo) {
        const usuarioData = JSON.parse(usuarioSalvo);
        setUsuario(usuarioData);

        // Buscar alunos do responsável
        const { data: alunosData, error: alunosError } = await supabase
          .from('alunos')
          .select('*')
          .eq('email_responsavel', usuarioData.email);

        if (alunosError) throw alunosError;
        setAlunos(alunosData || []);

        // Restaurar aluno selecionado
        if (alunoSalvo) {
          setAlunoSelecionado(JSON.parse(alunoSalvo));
        } else if (alunosData && alunosData.length > 0) {
          setAlunoSelecionado(alunosData[0]);
        }
      }
    } catch (err) {
      console.error('Erro ao restaurar sessão:', err);
      setErro('Erro ao restaurar sessão');
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      setCarregando(true);
      setErro(null);

      // Buscar usuário no Supabase
      const { data: usuariosData, error: usuariosError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();

      if (usuariosError || !usuariosData) {
        throw new Error('Email ou senha incorretos');
      }

      // Validar senha provisória (com trim para remover espaços)
      const senhaArmazenada = usuariosData.senha_provisoria.trim();
      const senhaNormalizada = senha.trim();
      
      if (senhaArmazenada !== senhaNormalizada) {
        console.error('Senha incorreta. Esperado:', senhaArmazenada, 'Recebido:', senhaNormalizada);
        throw new Error('Email ou senha incorretos');
      }

      // Salvar usuário na memória e AsyncStorage
      setUsuario(usuariosData);
      await AsyncStorage.setItem('usuario', JSON.stringify(usuariosData));

      // Buscar alunos do responsável
      const { data: alunosData, error: alunosError } = await supabase
        .from('alunos')
        .select('*')
        .eq('email_responsavel', email);

      if (alunosError) throw alunosError;
      setAlunos(alunosData || []);

      // Selecionar primeiro aluno por padrão
      if (alunosData && alunosData.length > 0) {
        setAlunoSelecionado(alunosData[0]);
        await AsyncStorage.setItem('alunoSelecionado', JSON.stringify(alunosData[0]));
      }
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

      // Fazer hash da nova senha (no app, apenas enviamos; o backend faz o hash)
      // Para este exemplo, vamos enviar a senha em texto (APENAS PARA REDE LOCAL)
      // Em produção, use bcrypt ou similar

      const { error } = await supabase
        .from('usuarios')
        .update({
          senha_hash: novaSenha, // Em produção, fazer hash com bcrypt
          primeiro_login: false,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', usuario.id);

      if (error) throw error;

      // Atualizar usuário local
      const usuarioAtualizado = {
        ...usuario,
        primeiro_login: false,
        senha_hash: novaSenha,
      };
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

  const selecionarAluno = async (aluno: Aluno) => {
    try {
      setAlunoSelecionado(aluno);
      await AsyncStorage.setItem('alunoSelecionado', JSON.stringify(aluno));
    } catch (err) {
      console.error('Erro ao selecionar aluno:', err);
    }
  };

  const logout = async () => {
    try {
      setCarregando(true);
      setUsuario(null);
      setAlunos([]);
      setAlunoSelecionado(null);
      setErro(null);
      await AsyncStorage.multiRemove(['usuario', 'alunoSelecionado', 'alunos']);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      setErro('Erro ao fazer logout');
    } finally {
      setCarregando(false);
    }
  };

  const isAdmin = usuario?.tipo_usuario === 'admin';

  return (
    <AuthContext.Provider
      value={{
        usuario,
        alunos,
        alunoSelecionado,
        carregando,
        erro,
        isAdmin,
        login,
        mudarSenha,
        selecionarAluno,
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
