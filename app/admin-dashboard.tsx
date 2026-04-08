import { ScrollView, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [informativos, setInformativos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      Alert.alert('Acesso Negado', 'Apenas admins podem acessar este painel');
      router.back();
      return;
    }
    buscarDados();
  }, [isAdmin]);

  const buscarDados = async () => {
    try {
      setCarregando(true);

      const [informativosRes, usuariosRes] = await Promise.all([
        supabase.from('informativos').select('*').order('criado_em', { ascending: false }),
        supabase.from('usuarios').select('id', { count: 'exact', head: true }),
      ]);

      if (informativosRes.error) throw informativosRes.error;
      setInformativos(informativosRes.data || []);
      setTotalUsuarios(usuariosRes.count || 0);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setCarregando(false);
    }
  };

  const handleDeletar = async (id: number) => {
    Alert.alert('Deletar?', 'Tem certeza que deseja deletar este informativo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('informativos').delete().eq('id', id);
            if (error) throw error;
            Alert.alert('Sucesso', 'Informativo deletado');
            buscarDados();
          } catch (err) {
            Alert.alert('Erro', 'Não foi possível deletar');
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-4 pb-6">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text className="text-2xl mb-2">←</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white">Painel Admin</Text>
      </View>

      {/* Cards de resumo */}
      <View className="flex-row px-6 py-4 gap-3 border-b border-border">
        <View className="flex-1 bg-surface border border-border rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-primary">{informativos.length}</Text>
          <Text className="text-xs text-muted mt-1">Informativos</Text>
        </View>
        <View className="flex-1 bg-surface border border-border rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-primary">{totalUsuarios}</Text>
          <Text className="text-xs text-muted mt-1">Usuários</Text>
        </View>
      </View>

      {/* Ações rápidas */}
      <View className="px-6 py-4 flex-row gap-3 border-b border-border">
        <TouchableOpacity
          onPress={() => router.push('/admin-create')}
          activeOpacity={0.7}
          className="flex-1 bg-primary rounded-lg py-3 items-center"
        >
          <Text className="text-white font-semibold text-sm">📝 Novo Informativo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/admin-usuarios')}
          activeOpacity={0.7}
          className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
        >
          <Text className="text-foreground font-semibold text-sm">👥 Usuários</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Informativos */}
      <FlatList
        data={informativos}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={buscarDados}
        refreshing={carregando}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <Text className="text-sm font-semibold text-muted uppercase mb-3">
            Informativos Recentes
          </Text>
        }
        renderItem={({ item }) => (
          <View className="bg-surface border border-border rounded-lg p-4 mb-3">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground">{item.titulo}</Text>
                <Text className="text-xs text-muted mt-1">
                  {new Date(item.criado_em).toLocaleDateString('pt-BR')} • {item.tipo}
                </Text>
              </View>
              <View
                className={`px-2 py-1 rounded-full ml-2 ${
                  item.status === 'urgente'
                    ? 'bg-error/20'
                    : item.status === 'importante'
                    ? 'bg-warning/20'
                    : 'bg-primary/10'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    item.status === 'urgente'
                      ? 'text-error'
                      : item.status === 'importante'
                      ? 'text-warning'
                      : 'text-primary'
                  }`}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2 mt-4">
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/admin-edit', params: { id: item.id } })}
                activeOpacity={0.7}
                className="flex-1 bg-primary/10 rounded py-2 items-center"
              >
                <Text className="text-primary font-semibold text-sm">Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeletar(item.id)}
                activeOpacity={0.7}
                className="flex-1 bg-error/10 rounded py-2 items-center"
              >
                <Text className="text-error font-semibold text-sm">Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-4xl mb-4">📋</Text>
            <Text className="text-foreground font-semibold">Nenhum informativo</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
