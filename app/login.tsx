import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const { login, usuario, carregando, erro } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostraSenha, setMostraSenha] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      await login(email, senha);
      // Após login, verificar se é primeiro acesso
      // Usamos AsyncStorage temporariamente pois o estado pode não ter atualizado ainda
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      const usuarioSalvo = await AsyncStorage.getItem('usuario');
      if (usuarioSalvo) {
        const userData = JSON.parse(usuarioSalvo);
        if (userData.primeiro_login) {
          router.replace('/change-password');
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (err) {
      Alert.alert('Erro ao fazer login', erro || 'Verifique suas credenciais');
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
        {/* Logo e Título */}
        <View className="items-center mb-12">
          <Text className="text-5xl mb-4">📚</Text>
          <Text className="text-3xl font-bold text-foreground mb-2">
            Pauta On
          </Text>
          <Text className="text-base text-muted text-center">
            Acompanhe as informações do seu filho
          </Text>
        </View>

        {/* Formulário */}
        <View className="gap-6 mb-8">
          {/* Email */}
          <View>
            <Text className="text-sm font-semibold text-muted uppercase mb-2">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!carregando}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{
                color: colors.foreground,
                borderColor: colors.border,
              }}
            />
          </View>

          {/* Senha */}
          <View>
            <Text className="text-sm font-semibold text-muted uppercase mb-2">
              Senha Provisória
            </Text>
            <View className="flex-row items-center bg-surface border border-border rounded-lg px-4 py-3">
              <TextInput
                value={senha}
                onChangeText={setSenha}
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
          </View>

          {/* Mensagem de Erro */}
          {erro && (
            <View className="bg-error/10 border border-error rounded-lg p-3">
              <Text className="text-error text-sm">{erro}</Text>
            </View>
          )}
        </View>

        {/* Botão Login */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={carregando}
          activeOpacity={0.7}
          className={`rounded-lg py-4 items-center mb-4 ${carregando ? 'opacity-50' : ''
            }`}
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold text-base">
            {carregando ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        {/* Link Recuperação de Senha */}
        <TouchableOpacity
          onPress={() => router.push('/forgot-password')}
          activeOpacity={0.7}
          className="items-center mb-8"
        >
          <Text className="text-primary font-semibold text-sm">
            Esqueceu sua senha?
          </Text>
        </TouchableOpacity>

        {/* Informação */}
        <View className="bg-surface rounded-lg p-4 mt-8">
          <Text className="text-xs text-muted text-center leading-relaxed">
            Use o email e a senha provisória fornecidos pela escola. Você será
            solicitado a criar uma nova senha no primeiro acesso.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}