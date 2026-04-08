import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';
import { type Aluno } from '@/lib/supabase';

export default function SelectStudentScreen() {
  const router = useRouter();
  const colors = useColors();
  const { alunos, selecionarAluno, carregando } = useAuth();

  const handleSelecionarAluno = async (aluno: Aluno) => {
    await selecionarAluno(aluno);
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-background border-b border-border">
        <Text className="text-2xl font-bold text-foreground">
          Selecione o Aluno
        </Text>
        <Text className="text-sm text-muted mt-1">
          Escolha qual filho você deseja acompanhar
        </Text>
      </View>

      {/* Lista de Alunos */}
      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelecionarAluno(item)}
            disabled={carregando}
            activeOpacity={0.7}
            className="px-6 py-4 border-b border-border"
          >
            <View className="bg-surface rounded-lg p-4">
              <Text className="text-lg font-semibold text-foreground mb-1">
                {item.nome}
              </Text>
              <View className="gap-1">
                <Text className="text-sm text-muted">
                  📚 Matrícula: {item.matricula}
                </Text>
                <Text className="text-sm text-muted">
                  📖 Série: {item.serie}
                </Text>
                <Text className="text-sm text-muted">
                  🏫 Escola: {item.escola}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingVertical: 16 }}
        scrollEnabled={true}
      />
    </ScreenContainer>
  );
}
