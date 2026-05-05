import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { supabase, type Usuario } from '@/lib/supabase';

type NovoUsuario = {
  nome: string;
  email: string;
  senha_provisoria: string;
  tipo_usuario: 'admin' | 'responsavel';
};

type Mensagem = { tipo: 'sucesso' | 'erro'; texto: string } | null;

function Banner({ mensagem }: { mensagem: Mensagem }) {
  if (!mensagem) return null;
  return (
    <View
      className="mx-4 mt-3 px-4 py-3 rounded-lg"
      style={{
        backgroundColor: mensagem.tipo === 'sucesso' ? '#22C55E20' : '#EF444420',
        borderWidth: 1,
        borderColor: mensagem.tipo === 'sucesso' ? '#22C55E' : '#EF4444',
      }}
    >
      <Text
        className="text-sm font-semibold text-center"
        style={{ color: mensagem.tipo === 'sucesso' ? '#22C55E' : '#EF4444' }}
      >
        {mensagem.tipo === 'sucesso' ? '✓ ' : '✕ '}{mensagem.texto}
      </Text>
    </View>
  );
}

export default function AdminUsuariosScreen() {
  const router = useRouter();
  const colors = useColors();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalDeletar, setModalDeletar] = useState<Usuario | null>(null);
  const [modalReset, setModalReset] = useState<{ usuario: Usuario; novaSenha: string } | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<Mensagem>(null);
  const [mensagemModal, setMensagemModal] = useState<Mensagem>(null);

  const [novoUsuario, setNovoUsuario] = useState<NovoUsuario>({
    nome: '',
    email: '',
    senha_provisoria: '',
    tipo_usuario: 'responsavel',
  });

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const mostrarMensagem = (tipo: 'sucesso' | 'erro', texto: string) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 4000);
  };

  const mostrarMensagemModal = (tipo: 'sucesso' | 'erro', texto: string) => {
    setMensagemModal({ tipo, texto });
    setTimeout(() => setMensagemModal(null), 4000);
  };

  const buscarUsuarios = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome');
      if (error) throw error;
      setUsuarios(data || []);
    } catch (err) {
      mostrarMensagem('erro', 'Não foi possível carregar usuários');
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalCriar = () => {
    setNovoUsuario({ nome: '', email: '', senha_provisoria: '', tipo_usuario: 'responsavel' });
    setMensagemModal(null);
    setModalVisivel(true);
  };

  const handleCriarUsuario = async () => {
    if (!novoUsuario.nome.trim()) {
      mostrarMensagemModal('erro', 'Nome é obrigatório');
      return;
    }
    if (!novoUsuario.email.trim() || !novoUsuario.email.includes('@')) {
      mostrarMensagemModal('erro', 'Email inválido');
      return;
    }
    if (!novoUsuario.senha_provisoria.trim() || novoUsuario.senha_provisoria.trim().length < 6) {
      mostrarMensagemModal('erro', 'Senha provisória deve ter ao menos 6 caracteres');
      return;
    }

    try {
      setSalvando(true);
      const { error } = await supabase.from('usuarios').insert({
        nome: novoUsuario.nome.trim(),
        email: novoUsuario.email.trim().toLowerCase(),
        senha_provisoria: novoUsuario.senha_provisoria.trim(),
        senha_hash: null,
        tipo_usuario: novoUsuario.tipo_usuario,
        primeiro_login: true,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      });

      if (error) {
        if (error.code === '23505') {
          mostrarMensagemModal('erro', 'Este email já está cadastrado');
        } else {
          throw error;
        }
        return;
      }

      mostrarMensagemModal('sucesso', 'Usuário criado com sucesso!');
      setTimeout(() => {
        setModalVisivel(false);
        buscarUsuarios();
      }, 1200);
    } catch (err) {
      mostrarMensagemModal('erro', 'Não foi possível criar o usuário');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletarUsuario = async () => {
    if (!modalDeletar) return;
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', modalDeletar.id);
      if (error) throw error;
      setModalDeletar(null);
      mostrarMensagem('sucesso', `Usuário "${modalDeletar.nome}" deletado`);
      buscarUsuarios();
    } catch (err) {
      setModalDeletar(null);
      mostrarMensagem('erro', 'Não foi possível deletar o usuário');
    }
  };

  const handleResetarSenha = async () => {
    if (!modalReset) return;
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          senha_provisoria: modalReset.novaSenha,
          primeiro_login: true,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', modalReset.usuario.id);
      if (error) throw error;
      setModalReset(null);
      mostrarMensagem('sucesso', `Senha resetada! Nova senha: ${modalReset.novaSenha}`);
      buscarUsuarios();
    } catch (err) {
      setModalReset(null);
      mostrarMensagem('erro', 'Não foi possível resetar a senha');
    }
  };

  const abrirModalReset = (usuario: Usuario) => {
    const novaSenha = Math.random().toString(36).slice(-8);
    setModalReset({ usuario, novaSenha });
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-4 pb-6">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text className="text-2xl mb-2">←</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white">Usuários</Text>
        <Text className="text-sm text-white opacity-80 mt-1">
          {usuarios.length} usuário{usuarios.length !== 1 ? 's' : ''} cadastrado{usuarios.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Banner de feedback */}
      <Banner mensagem={mensagem} />

      {/* Botão Criar */}
      <View className="px-6 py-4 border-b border-border">
        <TouchableOpacity
          onPress={abrirModalCriar}
          activeOpacity={0.7}
          className="bg-primary rounded-lg py-3 items-center"
        >
          <Text className="text-white font-semibold">+ Novo Usuário</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={buscarUsuarios}
        refreshing={carregando}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="bg-surface border border-border rounded-xl p-4 mb-3">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground">{item.nome}</Text>
                <Text className="text-sm text-muted mt-1">{item.email}</Text>
                <View className="flex-row items-center gap-2 mt-2 flex-wrap">
                  <View
                    className={`px-2 py-1 rounded-full ${
                      item.tipo_usuario === 'admin' ? 'bg-warning/20' : 'bg-primary/10'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        item.tipo_usuario === 'admin' ? 'text-warning' : 'text-primary'
                      }`}
                    >
                      {item.tipo_usuario === 'admin' ? '⚙️ Admin' : '👤 Responsável'}
                    </Text>
                  </View>
                  {item.primeiro_login && (
                    <View className="px-2 py-1 rounded-full bg-error/10">
                      <Text className="text-xs font-semibold text-error">
                        Aguarda 1º login
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View className="flex-row gap-2 mt-4">
              <TouchableOpacity
                onPress={() => abrirModalReset(item)}
                activeOpacity={0.7}
                className="flex-1 bg-primary/10 rounded-lg py-2 items-center"
              >
                <Text className="text-primary font-semibold text-xs">🔑 Resetar Senha</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalDeletar(item)}
                activeOpacity={0.7}
                className="flex-1 bg-error/10 rounded-lg py-2 items-center"
              >
                <Text className="text-error font-semibold text-xs">🗑 Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-4xl mb-4">👥</Text>
            <Text className="text-foreground font-semibold">Nenhum usuário encontrado</Text>
          </View>
        }
      />

      {/* Modal: Criar Usuário */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisivel(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View className="bg-background rounded-t-3xl p-6" style={{ maxHeight: '90%' }}>
              <Text className="text-xl font-bold text-foreground mb-4">Novo Usuário</Text>

              <Banner mensagem={mensagemModal} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ marginTop: 12 }}
              >
                <View className="gap-4">
                  <View>
                    <Text className="text-sm font-semibold text-muted uppercase mb-2">Nome *</Text>
                    <TextInput
                      value={novoUsuario.nome}
                      onChangeText={(v) => setNovoUsuario((u) => ({ ...u, nome: v }))}
                      placeholder="Nome completo"
                      placeholderTextColor={colors.muted}
                      className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                      style={{ color: colors.foreground }}
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-muted uppercase mb-2">Email *</Text>
                    <TextInput
                      value={novoUsuario.email}
                      onChangeText={(v) => setNovoUsuario((u) => ({ ...u, email: v }))}
                      placeholder="email@exemplo.com"
                      placeholderTextColor={colors.muted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                      style={{ color: colors.foreground }}
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-muted uppercase mb-2">
                      Senha Provisória *
                    </Text>
                    <TextInput
                      value={novoUsuario.senha_provisoria}
                      onChangeText={(v) => setNovoUsuario((u) => ({ ...u, senha_provisoria: v }))}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor={colors.muted}
                      className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                      style={{ color: colors.foreground }}
                    />
                    <Text className="text-xs text-muted mt-1">
                      O usuário será solicitado a trocar no primeiro acesso
                    </Text>
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-muted uppercase mb-2">Tipo</Text>
                    <View className="flex-row gap-3">
                      {(['responsavel', 'admin'] as const).map((tipo) => (
                        <TouchableOpacity
                          key={tipo}
                          onPress={() => setNovoUsuario((u) => ({ ...u, tipo_usuario: tipo }))}
                          activeOpacity={0.7}
                          className={`flex-1 py-3 rounded-lg items-center border ${
                            novoUsuario.tipo_usuario === tipo
                              ? 'bg-primary border-primary'
                              : 'bg-surface border-border'
                          }`}
                        >
                          <Text
                            className={`text-sm font-semibold ${
                              novoUsuario.tipo_usuario === tipo ? 'text-white' : 'text-foreground'
                            }`}
                          >
                            {tipo === 'responsavel' ? '👤 Responsável' : '⚙️ Admin'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View className="flex-row gap-3 mt-2 mb-4">
                    <TouchableOpacity
                      onPress={() => setModalVisivel(false)}
                      activeOpacity={0.7}
                      className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
                    >
                      <Text className="text-foreground font-semibold">Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCriarUsuario}
                      disabled={salvando}
                      activeOpacity={0.7}
                      className={`flex-1 rounded-lg py-3 items-center ${
                        salvando ? 'bg-primary/50' : 'bg-primary'
                      }`}
                    >
                      <Text className="text-white font-semibold">
                        {salvando ? 'Criando...' : 'Criar Usuário'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Modal: Confirmar Deletar */}
      <Modal
        visible={!!modalDeletar}
        animationType="fade"
        transparent
        onRequestClose={() => setModalDeletar(null)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-background rounded-2xl p-6 w-full">
            <Text className="text-xl font-bold text-foreground mb-2">Deletar Usuário</Text>
            <Text className="text-sm text-muted mb-6">
              Tem certeza que deseja deletar{' '}
              <Text className="font-semibold text-foreground">"{modalDeletar?.nome}"</Text>?
              {'\n'}Esta ação não pode ser desfeita.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setModalDeletar(null)}
                activeOpacity={0.7}
                className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
              >
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeletarUsuario}
                activeOpacity={0.7}
                className="flex-1 bg-error rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Confirmar Reset de Senha */}
      <Modal
        visible={!!modalReset}
        animationType="fade"
        transparent
        onRequestClose={() => setModalReset(null)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-background rounded-2xl p-6 w-full">
            <Text className="text-xl font-bold text-foreground mb-2">Resetar Senha</Text>
            <Text className="text-sm text-muted mb-2">
              A nova senha provisória de{' '}
              <Text className="font-semibold text-foreground">"{modalReset?.usuario.nome}"</Text>{' '}
              será:
            </Text>
            <View className="bg-surface border border-border rounded-lg px-4 py-3 mb-6 items-center">
              <Text className="text-lg font-bold text-primary tracking-widest">
                {modalReset?.novaSenha}
              </Text>
            </View>
            <Text className="text-xs text-muted mb-6 text-center">
              Anote esta senha antes de confirmar. O usuário precisará trocá-la no próximo acesso.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setModalReset(null)}
                activeOpacity={0.7}
                className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
              >
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleResetarSenha}
                activeOpacity={0.7}
                className="flex-1 bg-primary rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}