import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { supabase, type Informativo } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

const tipoEmojis: Record<string, string> = {
  'período': '📅',
  'reunião': '👥',
  'formatura': '🎓',
  'autorização': '✅',
  'evento': '🔔',
  'outro': '📌',
};

const statusColors: Record<string, string> = {
  novo: '#3B82F6',
  importante: '#F59E0B',
  urgente: '#EF4444',
  normal: '#687076',
};

const statusLabels: Record<string, string> = {
  novo: 'Novo',
  importante: 'Importante',
  urgente: 'Urgente',
  normal: 'Normal',
};

function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <View
        className={`py-3 px-4 rounded-lg items-center justify-center ${isPrimary ? 'bg-primary' : 'bg-background border border-border'
          }`}
      >
        <Text
          className={`font-semibold text-base ${isPrimary ? 'text-white' : 'text-foreground'
            }`}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function DetailsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAdmin } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [informativo, setInformativo] = useState<Informativo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [confirmado, setConfirmado] = useState(false);
  const [autorizacaoEnviada, setAutorizacaoEnviada] = useState(false);

  useEffect(() => {
    if (id) buscarInformativo();
  }, [id]);

  const buscarInformativo = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('informativos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setInformativo(data);
    } catch (err) {
      console.error('Erro ao buscar informativo:', err);
      Alert.alert('Erro', 'Não foi possível carregar o informativo');
    } finally {
      setCarregando(false);
    }
  };

  const handleConfirmarPresenca = () => {
    Alert.alert(
      'Confirmar Presença',
      'Você confirma sua presença neste evento?',
      [
        { text: 'Cancelar' },
        {
          text: 'Confirmar',
          onPress: () => {
            setConfirmado(true);
            Alert.alert('Sucesso', 'Presença confirmada!');
          },
        },
      ]
    );
  };

  const handleEnviarAutorizacao = () => {
    Alert.alert(
      'Enviar Autorização',
      'Você autoriza a participação nesta atividade?',
      [
        { text: 'Cancelar' },
        {
          text: 'Autorizar',
          onPress: () => {
            setAutorizacaoEnviada(true);
            Alert.alert('Sucesso', 'Autorização enviada!');
          },
        },
      ]
    );
  };

  const handleAdicionarCalendario = () => {
    Alert.alert('Calendário', 'Evento adicionado ao calendário!');
  };

  const handleFalarComSecretaria = () => {
    if (!informativo) return;
    const phoneNumber = '5521972531909';
    const message = `Olá! Tenho uma dúvida sobre o informativo: ${informativo.titulo}`;
    Linking.openURL(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    ).catch(() => Alert.alert('Erro', 'Não foi possível abrir o WhatsApp'));
  };

  if (carregando) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-muted mt-3 text-sm">Carregando...</Text>
      </ScreenContainer>
    );
  }

  if (!informativo) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-4xl mb-4">😕</Text>
        <Text className="text-lg font-semibold text-foreground">
          Informativo não encontrado
        </Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text className="text-primary font-semibold mt-4">Voltar</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  const statusColor = statusColors[informativo.status] || statusColors.normal;
  const statusLabel = statusLabels[informativo.status] || informativo.status;
  const emoji = tipoEmojis[informativo.tipo] || '📌';
  const tipoLabel =
    (informativo.tipo || '').charAt(0).toUpperCase() +
    (informativo.tipo || '').slice(1);

  const formatarData = () => {
    if (!informativo.data_evento) return null;
    try {
      return new Date(informativo.data_evento).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return informativo.data_evento;
    }
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-background border-b border-border flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground flex-1 ml-3">
          Detalhes
        </Text>
        {isAdmin && (
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: '/admin-edit', params: { id: informativo.id } })
            }
            activeOpacity={0.7}
            className="bg-primary/10 px-3 py-1 rounded-full"
          >
            <Text className="text-primary font-semibold text-sm">✏️ Editar</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tipo e Status */}
        <View className="flex-row items-center gap-3 mb-4">
          <View className="w-12 h-12 rounded-lg bg-surface border border-border items-center justify-center">
            <Text className="text-2xl">{emoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-primary">{tipoLabel}</Text>
            {informativo.status !== 'normal' && (
              <View
                className="mt-1 px-2 py-1 rounded-full self-start"
                style={{ backgroundColor: statusColor }}
              >
                <Text className="text-xs font-semibold text-white">
                  {statusLabel.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Título */}
        <Text className="text-2xl font-bold text-foreground mb-4">
          {informativo.titulo}
        </Text>

        {/* Data e Hora */}
        {(informativo.data_evento || informativo.hora_evento) && (
          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            {informativo.data_evento && (
              <View className="flex-row items-center gap-3 mb-3">
                <Text className="text-2xl">📅</Text>
                <View>
                  <Text className="text-xs text-muted font-medium">Data</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {formatarData()}
                  </Text>
                </View>
              </View>
            )}
            {informativo.hora_evento && (
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">⏰</Text>
                <View>
                  <Text className="text-xs text-muted font-medium">Horário</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {informativo.hora_evento}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Local */}
        {informativo.local && (
          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">📍</Text>
              <View className="flex-1">
                <Text className="text-xs text-muted font-medium">Local</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {informativo.local}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Resumo */}
        {informativo.resumo && (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-muted uppercase mb-2">
              Resumo
            </Text>
            <Text className="text-base text-foreground leading-relaxed">
              {informativo.resumo}
            </Text>
          </View>
        )}

        {/* Descrição */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted uppercase mb-2">
            Descrição
          </Text>
          <Text className="text-base text-foreground leading-relaxed">
            {informativo.descricao}
          </Text>
        </View>

        {/* Ações */}
        <View className="gap-3 mb-8">
          <ActionButton
            label={confirmado ? '✓ Presença Confirmada' : 'Confirmar Presença'}
            onPress={handleConfirmarPresenca}
            variant={confirmado ? 'secondary' : 'primary'}
            disabled={confirmado}
          />

          <ActionButton
            label={
              autorizacaoEnviada ? '✓ Autorização Enviada' : 'Enviar Autorização'
            }
            onPress={handleEnviarAutorizacao}
            variant={autorizacaoEnviada ? 'secondary' : 'primary'}
            disabled={autorizacaoEnviada}
          />

          <ActionButton
            label="📅 Adicionar ao Calendário"
            onPress={handleAdicionarCalendario}
            variant="secondary"
          />

          <ActionButton
            label="💬 Fale com a Secretaria"
            onPress={handleFalarComSecretaria}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}