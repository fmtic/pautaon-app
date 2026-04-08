import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { supabase, type Informativo } from '@/lib/supabase';

const TIPOS_INFORMATIVO = ['período', 'reunião', 'formatura', 'autorização', 'evento', 'outro'];
const STATUS_OPTIONS = ['novo', 'importante', 'urgente', 'normal'] as const;

export default function AdminEditScreen() {
  const router = useRouter();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [informativoOriginal, setInformativoOriginal] = useState<Informativo | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [resumo, setResumo] = useState('');
  const [local, setLocal] = useState('');
  const [tipo, setTipo] = useState('informativo');
  const [dataEvento, setDataEvento] = useState('');
  const [horaEvento, setHoraEvento] = useState('');
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
        setTipo(data.tipo || 'informativo');
        setDataEvento(data.data_evento || '');
        setHoraEvento(data.hora_evento || '');
        setStatus((data.status as typeof status) || 'normal');
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
          tipo,
          data_evento: dataEvento.trim() || null,
          hora_evento: horaEvento.trim() || null,
          status,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Sucesso', 'Informativo atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    Alert.alert('Cancelar', 'Descartar alterações?', [
      { text: 'Continuar editando', onPress: () => {} },
      { text: 'Descartar', onPress: () => router.back(), style: 'destructive' },
    ]);
  };

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
        <Text className="text-lg font-semibold text-foreground">Informativo não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="mt-4">
          <Text className="text-primary font-semibold">Voltar</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <View className="px-6 pt-4 pb-4 bg-background border-b border-border flex-row items-center">
        <TouchableOpacity onPress={handleCancelar} activeOpacity={0.7}>
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground flex-1 ml-3">Editar Informativo</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-5">
            <Text className="text-sm font-semibold text-muted uppercase mb-2">Título *</Text>
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Digite o título"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{ color: colors.foreground, borderColor: colors.border }}
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-muted uppercase mb-2">Resumo</Text>
            <TextInput
              value={resumo}
              onChangeText={setResumo}
              placeholder="Resumo breve (opcional)"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{ color: colors.foreground, borderColor: colors.border }}
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-muted uppercase mb-2">Descrição *</Text>
            <TextInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descrição completa"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={5}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{ color: colors.foreground, borderColor: colors.border, textAlignVertical: 'top' }}
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-muted uppercase mb-2">Tipo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {TIPOS_INFORMATIVO.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTipo(t)}
                  activeOpacity={0.7}
                  className={`px-4 py-2 rounded-full border ${tipo === t ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
                >
                  <Text className={`text-sm font-medium ${tipo === t ? 'text-white' : 'text-foreground'}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-muted uppercase mb-2">Local</Text>
            <TextInput
              value={local}
              onChangeText={setLocal}
              placeholder="Local do evento (opcional)"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{ color: colors.foreground, borderColor: colors.border }}
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-muted uppercase mb-2">Data do Evento</Text>
            <TextInput
              value={dataEvento}
              onChangeText={setDataEvento}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{ color: colors.foreground, borderColor: colors.border }}
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-muted uppercase mb-2">Hora do Evento</Text>
            <TextInput
              value={horaEvento}
              onChangeText={setHoraEvento}
              placeholder="HH:MM"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{ color: colors.foreground, borderColor: colors.border }}
            />
          </View>

          <View className="mb-8">
            <Text className="text-sm font-semibold text-muted uppercase mb-3">Status</Text>
            <View className="flex-row gap-2 flex-wrap">
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setStatus(option)}
                  activeOpacity={0.7}
                  className={`px-4 py-2 rounded-full border ${status === option ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
                >
                  <Text className={`text-sm font-medium ${status === option ? 'text-white' : 'text-foreground'}`}>
                    {statusLabels[option]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="gap-3 mb-8">
            <TouchableOpacity
              onPress={handleSalvar}
              disabled={salvando}
              activeOpacity={0.7}
              className={`rounded-lg py-4 items-center ${salvando ? 'bg-primary/50' : 'bg-primary'}`}
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
              <Text className="text-foreground font-semibold text-base">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
