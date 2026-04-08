import { ScrollView, Text, View, TouchableOpacity, FlatList, RefreshControl, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { mockInformativos } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { supabase, type Informativo } from "@/lib/supabase";

// Mapa de emojis para categorias
const categoryEmojis: Record<string, string> = {
  periodo: "📅",
  reuniao: "👥",
  formatura: "🎓",
  autorizacao: "✅",
  evento: "🔔",
};

// Rótulos para categorias
const categoryLabels: Record<string, string> = {
  periodo: "Período",
  reuniao: "Reunião",
  formatura: "Formatura",
  autorizacao: "Autorização",
  evento: "Evento",
};

interface InformativoCardProps {
  informativo: (typeof mockInformativos)[0];
  onPress: () => void;
  colors: any;
}

function InformativoCard({ informativo, onPress, colors }: InformativoCardProps) {
  const getStatusColor = () => {
    switch (informativo.status) {
      case "urgente":
        return colors.error;
      case "importante":
        return colors.warning;
      case "novo":
        return colors.primary;
      default:
        return colors.muted;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="bg-surface rounded-2xl p-4 mb-3 border border-border flex-row items-start gap-3">
        {/* Icon */}
        <View className="mt-1 w-8 h-8 rounded-full bg-white items-center justify-center">
          <Text className="text-lg">{categoryEmojis[informativo.categoria] || "📌"}</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* Category Badge */}
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xs font-semibold text-primary">
              {categoryLabels[informativo.categoria]}
            </Text>
            {informativo.status === "novo" && (
              <View className="bg-primary rounded-full px-2 py-1">
                <Text className="text-xs font-bold text-white">NOVO</Text>
              </View>
            )}
            {informativo.status === "urgente" && (
              <View className="bg-error rounded-full px-2 py-1">
                <Text className="text-xs font-bold text-white">URGENTE</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text className="text-base font-semibold text-foreground mb-2 leading-5">
            {informativo.titulo}
          </Text>

          {/* Date and Time */}
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-xs">📅</Text>
            <Text className="text-xs text-muted">
              {informativo.data.toLocaleDateString("pt-BR")}
            </Text>
          </View>

          {/* Location */}
          {informativo.local && (
            <View className="flex-row items-center gap-2">
              <Text className="text-xs">📍</Text>
              <Text className="text-xs text-muted">{informativo.local}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [informativos, setInformativos] = useState<any[]>(mockInformativos);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();
  const colors = useColors();
  const { alunoSelecionado, alunos, selecionarAluno } = useAuth();

  useEffect(() => {
    if (alunoSelecionado?.id) {
      buscarInformativos();
    }
  }, [alunoSelecionado?.id]);

  const buscarInformativos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('informativos')
        .select('*')
        .eq('aluno_id', alunoSelecionado?.id)
        .order('data_evento', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setInformativos(data);
      } else {
        setInformativos(mockInformativos);
      }
    } catch (err) {
      console.error('Erro ao buscar informativos:', err);
      setInformativos(mockInformativos);
    } finally {
      setCarregando(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await buscarInformativos();
    setRefreshing(false);
  };

  const handleInformativoPress = (informativo: (typeof mockInformativos)[0]) => {
    router.push({
      pathname: "/details",
      params: { id: informativo.id },
    });
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold text-white mb-1">Informativos</Text>
        {alunoSelecionado && (
          <Text className="text-sm text-white opacity-80 mb-2">
            {alunoSelecionado.nome} • {alunoSelecionado.serie}
          </Text>
        )}
        <Text className="text-sm text-white opacity-80">
          {informativos.length} avisos para você
        </Text>
      </View>

      {/* Seletor de Aluno (se houver múltiplos) */}
      {alunos.length > 1 && (
        <View className="px-6 py-3 bg-surface border-b border-border flex-row items-center justify-between">
          <Text className="text-sm text-muted">Aluno:</Text>
          <TouchableOpacity
            onPress={() => router.push('/select-student')}
            activeOpacity={0.7}
            className="flex-row items-center gap-2"
          >
            <Text className="text-sm font-semibold text-primary">
              {alunoSelecionado?.nome}
            </Text>
            <Text className="text-primary">›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-4 py-4">
          {informativos.length > 0 ? (
            informativos.map((informativo) => (
              <InformativoCard
                key={informativo.id}
                informativo={informativo}
                onPress={() => handleInformativoPress(informativo)}
                colors={colors}
              />
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-4xl mb-4">🔔</Text>
              <Text className="text-lg font-semibold text-foreground">
                Nenhum informativo
              </Text>
              <Text className="text-sm text-muted mt-2 text-center">
                Você receberá notificações sobre eventos importantes aqui.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
