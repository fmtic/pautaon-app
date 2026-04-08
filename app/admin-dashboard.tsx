import { ScrollView, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const { usuario, isAdmin } = useAuth();
  const [informativos, setInformativos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      Alert.alert('Acesso Negado', 'Apenas admins podem acessar este painel');
      router.back();
      return;
    }
    buscarInformativos();
  }, [isAdmin]);

  const buscarInformativos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('informativos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setInformativos(data || []);
    } catch (err) {
      console.error('Erro ao buscar informativos:', err);
      Alert.alert('Erro', 'Não foi possível carregar informativos');
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
            const { error } = await supabase
              .from('informativos')
              .delete()
              .eq('id', id);

            if (error) throw error;
            Alert.alert('Sucesso', 'Informativo deletado');
            buscarInformativos();
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
        <Text className="text-3xl font-bold text-white">Admin Dashboard</Text>
        <Text className="text-sm text-white opacity-80 mt-1">
          {informativos.length} informativos no sistema
        </Text>
      </View>

      {/* Botão Criar */}
      <View className="px-6 py-4 border-b border-border">
        <TouchableOpacity
          onPress={() => router.push('/admin-create')}
          activeOpacity={0.7}
          className="bg-primary rounded-lg py-3 items-center"
        >
          <Text className="text-white font-semibold">+ Novo Informativo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={informativos}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={buscarInformativos}
        refreshing={carregando}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="bg-surface border border-border rounded-lg p-4 mb-3">
            <Text className="text-lg font-bold text-foreground">{item.titulo}</Text>
            <Text className="text-xs text-muted mt-1">
              {new Date(item.criado_em).toLocaleDateString('pt-BR')}
            </Text>
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
