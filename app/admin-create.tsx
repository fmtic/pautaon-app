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
import { useState, useEffect } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { supabase } from '@/lib/supabase';

export default function AdminCreateScreen() {
  const router = useRouter();
  const colors = useColors();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [resumo, setResumo] = useState('');
  const [tipo, setTipo] = useState('informativo');
  const [local, setLocal] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [horaEvento, setHoraEvento] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [alunos, setAlunos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarAlunos();
  }, []);

  const buscarAlunos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('alunos')
        .select('id, nome, matricula')
        .order('nome');

      if (error) throw error;
      setAlunos(data || []);
      if (data && data.length > 0) {
        setAlunoId(data[0].id.toString());
      }
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
      Alert.alert('Erro', 'Não foi possível carregar alunos');
    } finally {
      setCarregando(false);
    }
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
    if (!alunoId) {
      Alert.alert('Erro', 'Selecione um aluno');
      return false;
    }
    return true;
  };

  const handleCriar = async () => {
    if (!validarFormulario()) return;

    try {
      setSalvando(true);
      const { error } = await supabase.from('informativos').insert({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        resumo: resumo.trim() || null,
        tipo,
        local: local.trim() || null,
        data_evento: dataEvento || null,
        hora_evento: horaEvento || null,
        aluno_id: parseInt(alunoId),
        status: 'normal',
      });

      if (error) throw error;

      Alert.alert('Sucesso', 'Informativo criado com sucesso!');
      router.back();
    } catch (err) {
      console.error('Erro ao criar informativo:', err);
      Alert.alert('Erro', 'Não foi possível criar informativo');
    } finally {
      setSalvando(false);
    }
  };

  const tipos = ['informativo', 'reunião', 'formatura', 'autorização', 'evento'];

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
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
          <View className="gap-4">
            {/* Título */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Título *
              </Text>
              <TextInput
                placeholder="Ex: Reunião de Pais"
                value={titulo}
                onChangeText={setTitulo}
                placeholderTextColor={colors.muted}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              />
            </View>

            {/* Descrição */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Descrição *
              </Text>
              <TextInput
                placeholder="Descreva o informativo em detalhes..."
                value={descricao}
                onChangeText={setDescricao}
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={4}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
                textAlignVertical="top"
              />
            </View>

            {/* Resumo */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Resumo (opcional)
              </Text>
              <TextInput
                placeholder="Resumo breve do informativo"
                value={resumo}
                onChangeText={setResumo}
                placeholderTextColor={colors.muted}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              />
            </View>

            {/* Tipo */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Tipo
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {tipos.map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTipo(t)}
                    activeOpacity={0.7}
                    className={`px-4 py-2 rounded-full ${
                      tipo === t
                        ? 'bg-primary'
                        : 'bg-surface border border-border'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        tipo === t ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Local */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Local (opcional)
              </Text>
              <TextInput
                placeholder="Ex: Sala de Aula 101"
                value={local}
                onChangeText={setLocal}
                placeholderTextColor={colors.muted}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              />
            </View>

            {/* Data */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Data do Evento (opcional)
              </Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                value={dataEvento}
                onChangeText={setDataEvento}
                placeholderTextColor={colors.muted}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              />
            </View>

            {/* Hora */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Hora do Evento (opcional)
              </Text>
              <TextInput
                placeholder="HH:MM"
                value={horaEvento}
                onChangeText={setHoraEvento}
                placeholderTextColor={colors.muted}
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              />
            </View>

            {/* Aluno */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Aluno *
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="gap-2"
                contentContainerStyle={{ gap: 8 }}
              >
                {alunos.map((aluno) => (
                  <TouchableOpacity
                    key={aluno.id}
                    onPress={() => setAlunoId(aluno.id.toString())}
                    activeOpacity={0.7}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                      alunoId === aluno.id.toString()
                        ? 'bg-primary'
                        : 'bg-surface border border-border'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        alunoId === aluno.id.toString()
                          ? 'text-white'
                          : 'text-foreground'
                      }`}
                    >
                      {aluno.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
