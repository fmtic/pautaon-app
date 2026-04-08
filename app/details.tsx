import { ScrollView, Text, View, TouchableOpacity, Alert, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { mockInformativos } from '@/lib/mock-data';
import { InformativoCategory } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

/**
 * Mapa de emojis para categorias
 */
const categoryEmojis: Record<InformativoCategory, string> = {
  periodo: '📅',
  reuniao: '👥',
  formatura: '🎓',
  autorizacao: '✅',
  evento: '🔔',
};

/**
 * Rótulos para categorias
 */
const categoryLabels: Record<InformativoCategory, string> = {
  periodo: 'Período Letivo',
  reuniao: 'Reunião',
  formatura: 'Formatura',
  autorizacao: 'Autorização',
  evento: 'Evento',
};

/**
 * Cores para badges de status
 */
const statusColors = {
  novo: '#3B82F6',
  importante: '#F59E0B',
  urgente: '#EF4444',
  normal: '#687076',
};

/**
 * Componente de Botão de Ação
 */
function ActionButton({
  label,
  onPress,
  variant = 'primary',
  colors,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  colors: ReturnType<typeof useColors>;
}) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className={`py-3 px-4 rounded-lg items-center justify-center ${
          isPrimary ? 'bg-primary' : 'bg-background border border-border'
        }`}
      >
        <Text
          className={`font-semibold text-base ${
            isPrimary ? 'text-white' : 'text-foreground'
          }`}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Details Screen - Detalhes do Informativo
 */
export default function DetailsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAdmin } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [confirmado, setConfirmado] = useState(false);
  const [autorizacaoEnviada, setAutorizacaoEnviada] = useState(false);

  // Encontrar o informativo
  const informativo = mockInformativos.find((info) => info.id === id);

  if (!informativo) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg font-semibold text-foreground">
          Informativo não encontrado
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text className="text-primary font-semibold mt-4">Voltar</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  const categoryLabel = categoryLabels[informativo.categoria];
  const statusColor = statusColors[informativo.status];

  const formattedDate = informativo.data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = informativo.data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleConfirmarPresenca = () => {
    Alert.alert(
      'Confirmar Presença',
      'Você confirma sua presença neste evento?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Confirmar',
          onPress: () => {
            setConfirmado(true);
            Alert.alert('Sucesso', 'Presença confirmada com sucesso!');
          },
        },
      ]
    );
  };

  const handleEnviarAutorizacao = () => {
    Alert.alert(
      'Enviar Autorização',
      'Você autoriza a participação do aluno nesta atividade?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Autorizar',
          onPress: () => {
            setAutorizacaoEnviada(true);
            Alert.alert('Sucesso', 'Autorização enviada com sucesso!');
          },
        },
      ]
    );
  };

  const handleAdicionarCalendario = () => {
    Alert.alert('Sucesso', 'Evento adicionado ao calendário!');
  };

  const handleFalarComSecretaria = () => {
    const phoneNumber = '5521972531909';
    const message = `Olá! Tenho uma dúvida sobre o informativo: ${informativo.titulo}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
    });
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-background border-b border-border flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground flex-1 ml-3">
          Detalhes
        </Text>
      </View>

      {/* Conteúdo */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Categoria e Status */}
        <View className="flex-row items-center gap-3 mb-4">
          <View className="w-12 h-12 rounded-lg bg-background items-center justify-center">
            <Text className="text-2xl">{categoryEmojis[informativo.categoria]}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-muted">{categoryLabel}</Text>
            {informativo.status !== 'normal' && (
              <View
                className="mt-1 px-2 py-1 rounded-full self-start"
                style={{ backgroundColor: statusColor }}
              >
                <Text className="text-xs font-semibold text-white">
                  {informativo.status === 'novo'
                    ? 'Novo'
                    : informativo.status === 'importante'
                      ? 'Importante'
                      : 'Urgente'}
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
        <View className="bg-surface border border-border rounded-lg p-4 mb-6">
          <View className="flex-row items-center gap-3 mb-3">
            <Text className="text-2xl">📅</Text>
            <View>
              <Text className="text-xs text-muted font-medium">Data</Text>
              <Text className="text-sm font-semibold text-foreground">
                {formattedDate}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <Text className="text-2xl">⏰</Text>
            <View>
              <Text className="text-xs text-muted font-medium">Horário</Text>
              <Text className="text-sm font-semibold text-foreground">
                {formattedTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Local */}
        {informativo.local && (
          <View className="bg-surface border border-border rounded-lg p-4 mb-6">
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

        {/* Descrição */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted uppercase mb-3">
            Descrição
          </Text>
          <Text className="text-base text-foreground leading-relaxed">
            {informativo.descricao}
          </Text>
        </View>

        {/* Contato */}
        {informativo.contato && (
          <View className="bg-surface border border-border rounded-lg p-4 mb-6">
            <Text className="text-sm font-semibold text-muted uppercase mb-3">
              Contato
            </Text>
            <Text className="text-sm font-semibold text-foreground">
              {informativo.contato.nome}
            </Text>
            {informativo.contato.email && (
              <Text className="text-xs text-muted mt-1">
                {informativo.contato.email}
              </Text>
            )}
            {informativo.contato.telefone && (
              <Text className="text-xs text-muted">
                {informativo.contato.telefone}
              </Text>
            )}
          </View>
        )}

        {/* Ações */}
        <View className="gap-3 mb-8">
          {informativo.requerConfirmacao && (
            <ActionButton
              label={confirmado ? '✓ Presença Confirmada' : 'Confirmar Presença'}
              onPress={handleConfirmarPresenca}
              variant={confirmado ? 'secondary' : 'primary'}
              colors={colors}
            />
          )}

          {informativo.requerAutorizacao && (
            <ActionButton
              label={
                autorizacaoEnviada ? '✓ Autorização Enviada' : 'Enviar Autorização'
              }
              onPress={handleEnviarAutorizacao}
              variant={autorizacaoEnviada ? 'secondary' : 'primary'}
              colors={colors}
            />
          )}

          <ActionButton
            label="Adicionar ao Calendário"
            onPress={handleAdicionarCalendario}
            variant="secondary"
            colors={colors}
          />

          <ActionButton
            label="💬 Fale com a Secretaria"
            onPress={handleFalarComSecretaria}
            variant="secondary"
            colors={colors}
          />

          {/* Admin Edit Button */}
          {isAdmin && (
            <ActionButton
              label="✍️ Editar"
              onPress={() => router.push(`/admin-edit?id=${informativo.id}`)}
              variant="secondary"
              colors={colors}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
