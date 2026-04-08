import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { supabase } from '@/lib/supabase';
import { Informativo } from '@/lib/types';

const TIPOS_INFORMATIVO = ['período', 'reunião', 'formatura', 'autorização', 'evento', 'outro'];
const STATUS_OPTIONS = ['novo', 'importante', 'urgente', 'normal'] as const;

/**
 * Admin Edit Screen - Editar Informativo
 */
export default function AdminEditScreen() {
  const router = useRouter();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [informativoOriginal, setInformativoOriginal] = useState<Informativo | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [resumo, setResumo] = useState('');
  const [local, setLocal] = useState('');
  const [contato, setContato] = useState('');
  const [status, setStatus] = useState<'novo' | 'importante' | 'urgente' | 'normal'>('normal');
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarInformativo();
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
      
      if (data) {
        setInformativoOriginal(data);
        setTitulo(data.titulo || '');
        setDescricao(data.descricao || '');
        setResumo(data.resumo || '');
        setLocal(data.local || '');
        setContato(data.contato || '');
        setStatus(data.status || 'normal');
      }
    } catch (err) {
      console.error('Erro ao buscar informativo:', err);
      Alert.alert('Erro', 'Não foi possível carregar o informativo');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async () => {
    if (!titulo.trim() || !descricao.trim()) {
      Alert.alert('Erro', 'Título e descrição são obrigatórios');
      return;
    }

    try {
      setSalvando(true);
      const { error } = await supabase
        .from('informativos')
        .update({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          resumo: resumo.trim() || null,
          local: local.trim() || null,
          contato: contato.trim() || null,
          status,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      Alert.alert(
        'Sucesso',
        'Informativo atualizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      console.error('Erro ao salvar:', err);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar',
      'Descartar alterações?',
      [
        { text: 'Continuar editando', onPress: () => {} },
        {
          text: 'Descartar',
          onPress: () => router.back(),
          style: 'destructive',
        },
      ]
    );
  };

  const statusOptions: Array<'novo' | 'importante' | 'urgente' | 'normal'> = [
    'novo',
    'importante',
    'urgente',
    'normal',
  ];

  const statusLabels: Record<string, string> = {
    novo: 'Novo',
    importante: 'Importante',
    urgente: 'Urgente',
    normal: 'Normal',
  };

  if (carregando) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg font-semibold text-foreground">Carregando...</Text>
      </ScreenContainer>
    );
  }

  if (!informativoOriginal) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg font-semibold text-foreground">
          Informativo não encontrado
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="mt-4"
        >
          <Text className="text-primary font-semibold">Voltar</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-background border-b border-border flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handleCancelar}
          activeOpacity={0.7}
        >
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground flex-1 ml-3">
          Editar Informativo
        </Text>
      </View>

      {/* Conteúdo */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 16,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Título */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted uppercase mb-2">
            Título
          </Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Digite o título do informativo"
            placeholderTextColor={colors.muted}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            style={{
              color: colors.foreground,
              borderColor: colors.border,
            }}
          />
        </View>

        {/* Resumo */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted uppercase mb-2">
            Resumo
          </Text>
          <TextInput
            value={resumo}
            onChangeText={setResumo}
            placeholder="Resumo breve do informativo"
            placeholderTextColor={colors.muted}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            style={{
              color: colors.foreground,
              borderColor: colors.border,
            }}
          />
        </View>

        {/* Descrição */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted uppercase mb-2">
            Descrição Completa
          </Text>
          <TextInput
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Digite a descrição completa"
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={5}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            style={{
              color: colors.foreground,
              borderColor: colors.border,
              textAlignVertical: 'top',
            }}
          />
        </View>

        {/* Local */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted uppercase mb-2">
            Local
          </Text>
          <TextInput
            value={local}
            onChangeText={setLocal}
            placeholder="Local do evento (opcional)"
            placeholderTextColor={colors.muted}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            style={{
              color: colors.foreground,
              borderColor: colors.border,
            }}
          />
        </View>

        {/* Contato */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-muted uppercase mb-2">
            Contato
          </Text>
          <TextInput
            value={contato}
            onChangeText={setContato}
            placeholder="Email ou telefone para contato (opcional)"
            placeholderTextColor={colors.muted}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            style={{
              color: colors.foreground,
              borderColor: colors.border,
            }}
          />
        </View>

        {/* Status */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-muted uppercase mb-3">
            Status
          </Text>
          <View className="flex-row gap-2 flex-wrap">
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setStatus(option)}
                activeOpacity={0.7}
                className={`px-4 py-2 rounded-full border ${
                  status === option
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    status === option ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {statusLabels[option]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botões de Ação */}
        <View className="gap-3 mb-8">
          <TouchableOpacity
            onPress={handleSalvar}
            disabled={salvando}
            activeOpacity={0.7}
            className={`rounded-lg py-4 items-center ${
              salvando ? 'bg-primary/50' : 'bg-primary'
            }`}
          >
            <Text className="text-white font-semibold text-base">
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancelar}
            activeOpacity={0.7}
            className="bg-surface border border-border rounded-lg py-4 items-center"
          >
            <Text className="text-foreground font-semibold text-base">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
