import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { supabase, enviarNotificacaoParaTodos } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

const TIPOS_INFORMATIVO = ['período', 'reunião', 'formatura', 'autorização', 'evento', 'outro'];

export default function AdminCreateScreen() {
  const router = useRouter();
  const colors = useColors();
  const { usuario } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [resumo, setResumo] = useState('');
  const [tipo, setTipo] = useState('período');
  const [local, setLocal] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [horaEvento, setHoraEvento] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Manter data em formato dd/mm/aaaa (não converter para ISO)
  const validarData = (data: string) => {
    if (!data) return null;
    const match = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;
    const [, dia, mes, ano] = match;
    // Validar se é uma data válida
    const date = new Date(`${ano}-${mes}-${dia}`);
    if (isNaN(date.getTime())) return null;
    return data; // Retorna no formato dd/mm/aaaa
  };

  // Validar e formatar data dd/mm/aaaa
  const handleDataChange = (text: string) => {
    // Remove caracteres não numéricos
    const numeros = text.replace(/\D/g, '');
    
    // Formata como dd/mm/aaaa
    let formatado = numeros;
    if (numeros.length >= 2) {
      formatado = numeros.slice(0, 2) + '/' + numeros.slice(2);
    }
    if (numeros.length >= 4) {
      formatado = numeros.slice(0, 2) + '/' + numeros.slice(2, 4) + '/' + numeros.slice(4, 8);
    }
    
    setDataEvento(formatado);
  };

  // Validar e formatar hora HH:MM (24h) - insere : automaticamente
  const handleHoraChange = (text: string) => {
    // Remove caracteres nao numericos
    const numeros = text.replace(/\D/g, '');
    
    // Limita a 4 digitos (HHMM)
    const limitado = numeros.slice(0, 4);
    
    // Valida horas (00-23)
    let hora = limitado.slice(0, 2);
    if (hora && parseInt(hora) > 23) hora = '23';
    
    // Valida minutos (00-59)
    let minuto = limitado.slice(2, 4);
    if (minuto && parseInt(minuto) > 59) minuto = '59';
    
    // Formata automaticamente com : apos 2 digitos
    let formatado = hora;
    if (limitado.length > 2) {
      formatado = hora + ':' + minuto;
    }
    
    setHoraEvento(formatado);
  };

  const validarFormulario = () => {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return false;
    }
    if (!descricao.trim()) {
      Alert.alert('Erro', 'Descrição é obrigatória');
      return false;
    }
    return true;
  };

  const handleCriar = async () => {
    if (!validarFormulario()) return;

    try {
      setSalvando(true);
      // Validar data
      const dataValida = validarData(dataEvento.trim());
      if (dataEvento.trim() && !dataValida) {
        Alert.alert('Erro', 'Data inválida. Use o formato dd/mm/aaaa');
        setSalvando(false);
        return;
      }

      // Validar hora
      if (horaEvento.trim() && !/^([01]\d|2[0-3]):[0-5]\d$/.test(horaEvento.trim())) {
        Alert.alert('Erro', 'Hora inválida. Use o formato HH:MM (24h)');
        setSalvando(false);
        return;
      }

      const { error } = await supabase.from('informativos').insert({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        resumo: resumo.trim() || null,
        tipo,
        local: local.trim() || null,
        data_evento: dataValida,
        hora_evento: horaEvento.trim() || null,
        aluno_id: null,
        status: 'novo',
        admin_email: usuario?.email || null,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      });

      if (error) throw error;

      // Enviar notificacao para todos os usuarios
      try {
        await enviarNotificacaoParaTodos(
          `Novo Informativo: ${titulo.trim()}`,
          descricao.trim(),
          {
            tipo: tipo,
            data_evento: dataValida,
            hora_evento: horaEvento.trim() || null,
          }
        );
      } catch (notifErr) {
        console.warn('Aviso: Erro ao enviar notificacao:', notifErr);
        // Nao bloqueia a criacao do informativo se a notificacao falhar
      }

      Alert.alert('Sucesso', 'Informativo criado com sucesso!');
      router.back();
    } catch (err) {
      console.error('Erro ao criar informativo:', err);
      Alert.alert('Erro', 'Não foi possível criar informativo');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-4 pb-6">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text className="text-2xl mb-2">←</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white">Novo Informativo</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-4">
            {/* Título */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Título *</Text>
              <TextInput
                placeholder="Ex: Reunião de Pais"
                value={titulo}
                onChangeText={setTitulo}
                placeholderTextColor={colors.muted}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                style={{ color: colors.foreground }}
              />
            </View>

            {/* Descrição */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Descrição *</Text>
              <TextInput
                placeholder="Descreva o informativo em detalhes..."
                value={descricao}
                onChangeText={setDescricao}
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={4}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                style={{ color: colors.foreground, textAlignVertical: 'top' }}
              />
            </View>

            {/* Resumo */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Resumo (opcional)</Text>
              <TextInput
                placeholder="Resumo breve do informativo"
                value={resumo}
                onChangeText={setResumo}
                placeholderTextColor={colors.muted}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                style={{ color: colors.foreground }}
              />
            </View>

            {/* Tipo */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Tipo</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {TIPOS_INFORMATIVO.map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTipo(t)}
                    activeOpacity={0.7}
                    className={`px-4 py-2 rounded-full ${
                      tipo === t ? 'bg-primary' : 'bg-surface border border-border'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${tipo === t ? 'text-white' : 'text-foreground'}`}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Local */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Local (opcional)</Text>
              <TextInput
                placeholder="Ex: Sala de Aula 101"
                value={local}
                onChangeText={setLocal}
                placeholderTextColor={colors.muted}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                style={{ color: colors.foreground }}
              />
            </View>

            {/* Data */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Data do Evento (opcional)
              </Text>
              <TextInput
                placeholder="dd/mm/aaaa"
                value={dataEvento}
                onChangeText={handleDataChange}
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                maxLength={10}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                style={{ color: colors.foreground }}
              />
            </View>

            {/* Hora */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Hora do Evento (opcional)
              </Text>
              <TextInput
                placeholder="HH:MM (24h)"
                value={horaEvento}
                onChangeText={handleHoraChange}
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                maxLength={5}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                style={{ color: colors.foreground }}
              />
            </View>

            {/* Botões */}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
              >
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCriar}
                disabled={salvando}
                activeOpacity={0.7}
                className={`flex-1 rounded-lg py-3 items-center ${salvando ? 'bg-primary/50' : 'bg-primary'}`}
              >
                <Text className="text-white font-semibold">
                  {salvando ? 'Criando...' : 'Criar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
