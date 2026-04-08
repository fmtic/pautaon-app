import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { supabase, type Informativo } from "@/lib/supabase";

const tipoEmojis: Record<string, string> = {
  "período": "📅",
  "reunião": "👥",
  "formatura": "🎓",
  "autorização": "✅",
  "evento": "🔔",
  "outro": "📌",
};

function InformativoCard({
  informativo,
  onPress,
  colors,
}: {
  informativo: Informativo;
  onPress: () => void;
  colors: any;
}) {
  const getStatusColor = () => {
    switch (informativo.status) {
      case "urgente": return colors.error;
      case "importante": return colors.warning;
      case "novo": return colors.primary;
      default: return colors.muted;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View className="bg-surface rounded-2xl p-4 mb-3 border border-border flex-row items-start gap-3">
        <View className="mt-1 w-8 h-8 rounded-full bg-white items-center justify-center">
          <Text className="text-lg">
            {tipoEmojis[informativo.tipo] || "📌"}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xs font-semibold text-primary">
              {(informativo.tipo || "").charAt(0).toUpperCase() +
                (informativo.tipo || "").slice(1)}
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
            {informativo.status === "importante" && (
              <View className="bg-warning rounded-full px-2 py-1">
                <Text className="text-xs font-bold text-white">IMPORTANTE</Text>
              </View>
            )}
          </View>

          <Text className="text-base font-semibold text-foreground mb-2 leading-5">
            {informativo.titulo}
          </Text>

          {informativo.resumo ? (
            <Text className="text-xs text-muted mb-2" numberOfLines={2}>
              {informativo.resumo}
            </Text>
          ) : null}

          {informativo.data_evento && (
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-xs">📅</Text>
              <Text className="text-xs text-muted">
                {new Date(informativo.data_evento).toLocaleDateString("pt-BR")}
              </Text>
            </View>
          )}

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
  const [informativos, setInformativos] = useState<Informativo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();
  const colors = useColors();
  const { usuario } = useAuth();

  useEffect(() => {
    buscarInformativos();
  }, []);

  const buscarInformativos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from("informativos")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      setInformativos(data || []);
    } catch (err) {
      console.error("Erro ao buscar informativos:", err);
    } finally {
      setCarregando(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await buscarInformativos();
    setRefreshing(false);
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold text-white mb-1">Informativos</Text>
        {usuario && (
          <Text className="text-sm text-white opacity-80">
            Olá, {usuario.nome}
          </Text>
        )}
        <Text className="text-sm text-white opacity-80 mt-1">
          {informativos.length} {informativos.length === 1 ? "aviso" : "avisos"} disponíveis
        </Text>
      </View>

      {/* Lista */}
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
                onPress={() =>
                  router.push({
                    pathname: "/details",
                    params: { id: informativo.id },
                  })
                }
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
