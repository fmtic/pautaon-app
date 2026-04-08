import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';

interface ValidacaoSenha {
  valida: boolean;
  erros: string[];
}

const validarSenha = (senha: string): ValidacaoSenha => {
  const erros: string[] = [];

  if (senha.length < 8) erros.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(senha)) erros.push('Pelo menos 1 maiúscula');
  if (!/[a-z]/.test(senha)) erros.push('Pelo menos 1 minúscula');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha))
    erros.push('Pelo menos 1 caractere especial');

  return { valida: erros.length === 0, erros };
};

export default function ChangePasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const { mudarSenha, carregando, usuario } = useAuth();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [mostraSenha, setMostraSenha] = useState(false);
  const [mostraConfirma, setMostraConfirma] = useState(false);

  const validacao = validarSenha(novaSenha);

  const handleMudarSenha = async () => {
    if (!validacao.valida) {
      Alert.alert('Senha inválida', validacao.erros.join('\n'));
      return;
    }

    if (novaSenha !== confirmaSenha) {
      Alert.alert('Erro', 'As senhas não conferem');
      return;
    }

    try {
      await mudarSenha(novaSenha);
      Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao alterar senha');
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Criar Nova Senha
          </Text>
          <Text className="text-base text-muted">
            Por segurança, você precisa criar uma nova senha
          </Text>
        </View>

        {/* Formulário */}
        <View className="gap-6 mb-8">
          {/* Nova Senha */}
          <View>
            <Text className="text-sm font-semibold text-muted uppercase mb-2">
              Nova Senha
            </Text>
            <View className="flex-row items-center bg-surface border border-border rounded-lg px-4 py-3">
              <TextInput
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                secureTextEntry={!mostraSenha}
                editable={!carregando}
                className="flex-1 text-foreground"
                style={{ color: colors.foreground }}
              />
              <TouchableOpacity
                onPress={() => setMostraSenha(!mostraSenha)}
                activeOpacity={0.7}
              >
                <Text className="text-lg ml-2">
                  {mostraSenha ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Requisitos */}
            {novaSenha && (
              <View className="mt-3 gap-2">
                <RequisitoSenha
                  atendido={novaSenha.length >= 8}
                  texto="Mínimo 8 caracteres"
                />
                <RequisitoSenha
                  atendido={/[A-Z]/.test(novaSenha)}
                  texto="Pelo menos 1 maiúscula"
                />
                <RequisitoSenha
                  atendido={/[a-z]/.test(novaSenha)}
                  texto="Pelo menos 1 minúscula"
                />
                <RequisitoSenha
                  atendido={/[!@#$%^&*(),.?":{}|<>]/.test(novaSenha)}
                  texto="Pelo menos 1 caractere especial"
                />
              </View>
            )}
          </View>

          {/* Confirmar Senha */}
          <View>
            <Text className="text-sm font-semibold text-muted uppercase mb-2">
              Confirmar Senha
            </Text>
            <View className="flex-row items-center bg-surface border border-border rounded-lg px-4 py-3">
              <TextInput
                value={confirmaSenha}
                onChangeText={setConfirmaSenha}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                secureTextEntry={!mostraConfirma}
                editable={!carregando}
                className="flex-1 text-foreground"
                style={{ color: colors.foreground }}
              />
              <TouchableOpacity
                onPress={() => setMostraConfirma(!mostraConfirma)}
                activeOpacity={0.7}
              >
                <Text className="text-lg ml-2">
                  {mostraConfirma ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Validação de Confirmação */}
            {confirmaSenha && novaSenha !== confirmaSenha && (
              <Text className="text-error text-sm mt-2">
                As senhas não conferem
              </Text>
            )}
            {confirmaSenha && novaSenha === confirmaSenha && (
              <Text className="text-success text-sm mt-2">✓ Senhas conferem</Text>
            )}
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          onPress={handleMudarSenha}
          disabled={carregando || !validacao.valida || novaSenha !== confirmaSenha}
          activeOpacity={0.7}
          className={`rounded-lg py-4 items-center mb-4 ${
            carregando || !validacao.valida || novaSenha !== confirmaSenha
              ? 'opacity-50'
              : ''
          }`}
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold text-base">
            {carregando ? 'Salvando...' : 'Salvar Nova Senha'}
          </Text>
        </TouchableOpacity>

        {/* Informação */}
        <View className="bg-surface rounded-lg p-4 mt-8">
          <Text className="text-xs text-muted text-center leading-relaxed">
            Sua senha deve ter no mínimo 8 caracteres, incluindo maiúsculas,
            minúsculas e caracteres especiais.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

interface RequisitoSenhaProps {
  atendido: boolean;
  texto: string;
}

function RequisitoSenha({ atendido, texto }: RequisitoSenhaProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Text className={atendido ? 'text-success text-lg' : 'text-muted text-lg'}>
        {atendido ? '✓' : '○'}
      </Text>
      <Text className={atendido ? 'text-success text-sm' : 'text-muted text-sm'}>
        {texto}
      </Text>
    </View>
  );
}
