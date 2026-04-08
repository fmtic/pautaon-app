import {
  Alert,
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

export default function AdminUsuariosScreen() {
  const router = useRouter();
  const colors = useColors();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [novoUsuario, setNovoUsuario] = useState<NovoUsuario>({
    nome: '',
    email: '',
    senha_provisoria: '',
    tipo_usuario: 'responsavel',
  });

  useEffect(() => {
    buscarUsuarios();
  }, []);

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
      console.error('Erro ao buscar usuários:', err);
      Alert.alert('Erro', 'Não foi possível carregar usuários');
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalCriar = () => {
    setNovoUsuario({ nome: '', email: '', senha_provisoria: '', tipo_usuario: 'responsavel' });
    setModalVisivel(true);
  };

  const handleCriarUsuario = async () => {
    if (!novoUsuario.nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }
    if (!novoUsuario.email.trim() || !novoUsuario.email.includes('@')) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }
    if (!novoUsuario.senha_provisoria.trim() || novoUsuario.senha_provisoria.trim().length < 6) {
      Alert.alert('Erro', 'Senha provisória deve ter ao menos 6 caracteres');
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
          Alert.alert('Erro', 'Este email já está cadastrado');
        } else {
          throw error;
        }
        return;
      }

      Alert.alert('Sucesso', 'Usuário criado com sucesso!');
      setModalVisivel(false);
      buscarUsuarios();
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      Alert.alert('Erro', 'Não foi possível criar o usuário');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletarUsuario = (usuario: Usuario) => {
    Alert.alert(
      'Deletar Usuário',
      `Tem certeza que deseja deletar "${usuario.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('usuarios')
                .delete()
                .eq('id', usuario.id);

              if (error) throw error;
              Alert.alert('Sucesso', 'Usuário deletado');
              buscarUsuarios();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível deletar o usuário');
            }
          },
        },
      ]
    );
  };

  const handleResetarSenha = async (usuario: Usuario) => {
    const novaSenha = Math.random().toString(36).slice(-8);
    Alert.alert(
      'Resetar Senha',
      `A nova senha provisória será: ${novaSenha}\n\nDeseja continuar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('usuarios')
                .update({
                  senha_provisoria: novaSenha,
                  primeiro_login: true,
                  atualizado_em: new Date().toISOString(),
                })
                .eq('id', usuario.id);

              if (error) throw error;
              Alert.alert('Sucesso', `Senha resetada!\nNova senha: ${novaSenha}`);
              buscarUsuarios();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível resetar a senha');
            }
          },
        },
      ]
    );
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
          {usuarios.length} usuários cadastrados
        </Text>
      </View>

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
          <View className="bg-surface border border-border rounded-lg p-4 mb-3">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground">{item.nome}</Text>
                <Text className="text-sm text-muted mt-1">{item.email}</Text>
                <View className="flex-row items-center gap-2 mt-2">
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
                onPress={() => handleResetarSenha(item)}
                activeOpacity={0.7}
                className="flex-1 bg-primary/10 rounded py-2 items-center"
              >
                <Text className="text-primary font-semibold text-xs">🔑 Resetar Senha</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeletarUsuario(item)}
                activeOpacity={0.7}
                className="flex-1 bg-error/10 rounded py-2 items-center"
              >
                <Text className="text-error font-semibold text-xs">Deletar</Text>
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

      {/* Modal Criar Usuário */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisivel(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View className="bg-background rounded-t-3xl p-6">
              <Text className="text-xl font-bold text-foreground mb-6">Novo Usuário</Text>

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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

                  <View className="flex-row gap-3 mt-2">
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
                        {salvando ? 'Criando...' : 'Criar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
