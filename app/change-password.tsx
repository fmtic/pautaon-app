import { ScrollView, Text, View, TextInput, TouchableOpacity } from 'react-native';
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
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) erros.push('Pelo menos 1 caractere especial');
  return { valida: erros.length === 0, erros };
};

function RequisitoSenha({ atendido, texto }: { atendido: boolean; texto: string }) {
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

export default function ChangePasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const { mudarSenha, carregando } = useAuth();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [mostraSenha, setMostraSenha] = useState(false);
  const [mostraConfirma, setMostraConfirma] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const validacao = validarSenha(novaSenha);
  const senhasConferem = novaSenha === confirmaSenha && confirmaSenha.length > 0;
  const podeSubmeter = validacao.valida && senhasConferem && !carregando;

  const handleMudarSenha = async () => {
    if (!validacao.valida) {
      setMensagem({ tipo: 'erro', texto: validacao.erros[0] });
      return;
    }
    if (!senhasConferem) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não conferem' });
      return;
    }

    try {
      await mudarSenha(novaSenha);
      setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso! Redirecionando...' });
      setTimeout(() => router.replace('/(tabs)'), 1500);
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: 'Falha ao alterar senha. Tente novamente.' });
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
        <View className="mb-10">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Criar Nova Senha
          </Text>
          <Text className="text-base text-muted">
            Por segurança, você precisa criar uma nova senha
          </Text>
        </View>

        {/* Banner de feedback */}
        {mensagem && (
          <View
            className="mb-6 px-4 py-3 rounded-lg"
            style={{
              backgroundColor: mensagem.tipo === 'sucesso' ? '#22C55E20' : '#EF444420',
              borderWidth: 1,
              borderColor: mensagem.tipo === 'sucesso' ? '#22C55E' : '#EF4444',
            }}
          >
            <Text
              className="text-sm font-semibold text-center"
              style={{ color: mensagem.tipo === 'sucesso' ? '#22C55E' : '#EF4444' }}
            >
              {mensagem.tipo === 'sucesso' ? '✓ ' : '✕ '}{mensagem.texto}
            </Text>
          </View>
        )}

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
              <TouchableOpacity onPress={() => setMostraSenha(!mostraSenha)} activeOpacity={0.7}>
                <Text className="text-lg ml-2">{mostraSenha ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>

            {novaSenha.length > 0 && (
              <View className="mt-3 gap-2">
                <RequisitoSenha atendido={novaSenha.length >= 8} texto="Mínimo 8 caracteres" />
                <RequisitoSenha atendido={/[A-Z]/.test(novaSenha)} texto="Pelo menos 1 maiúscula" />
                <RequisitoSenha atendido={/[a-z]/.test(novaSenha)} texto="Pelo menos 1 minúscula" />
                <RequisitoSenha atendido={/[!@#$%^&*(),.?":{}|<>]/.test(novaSenha)} texto="Pelo menos 1 caractere especial" />
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
              <TouchableOpacity onPress={() => setMostraConfirma(!mostraConfirma)} activeOpacity={0.7}>
                <Text className="text-lg ml-2">{mostraConfirma ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>

            {confirmaSenha.length > 0 && (
              <Text
                className="text-sm mt-2"
                style={{ color: senhasConferem ? '#22C55E' : '#EF4444' }}
              >
                {senhasConferem ? '✓ Senhas conferem' : '✕ As senhas não conferem'}
              </Text>
            )}
          </View>
        </View>

        {/* Botão */}
        <TouchableOpacity
          onPress={handleMudarSenha}
          disabled={!podeSubmeter}
          activeOpacity={0.7}
          className="rounded-lg py-4 items-center"
          style={{
            backgroundColor: podeSubmeter ? colors.primary : colors.border,
          }}
        >
          <Text className="text-white font-semibold text-base">
            {carregando ? 'Salvando...' : 'Salvar Nova Senha'}
          </Text>
        </TouchableOpacity>

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