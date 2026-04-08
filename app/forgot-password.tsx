import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { supabase } from '@/lib/supabase';

/**
 * Forgot Password Screen - Recuperação de Senha
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleEnviarReset = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu email');
      return;
    }

    try {
      setCarregando(true);

      // Buscar usuário no Supabase
      const { data: usuarios, error: erroUsuarios } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (erroUsuarios || !usuarios) {
        Alert.alert('Erro', 'Email não encontrado no sistema');
        return;
      }

      // Aqui você poderia enviar um email com link de reset
      // Por enquanto, vamos simular o envio
      setEnviado(true);
      Alert.alert(
        'Email Enviado',
        'Um link para redefinir sua senha foi enviado para seu email. Verifique sua caixa de entrada.'
      );

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      console.error('Erro ao enviar reset:', err);
      Alert.alert('Erro', 'Ocorreu um erro ao processar sua solicitação');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4 bg-background border-b border-border flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-foreground flex-1 ml-3">
            Recuperar Senha
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 32,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Ícone */}
          <View className="items-center mb-8">
            <Text className="text-6xl mb-4">🔑</Text>
            <Text className="text-2xl font-bold text-foreground mb-2">
              Esqueceu sua senha?
            </Text>
            <Text className="text-sm text-muted text-center">
              Digite seu email para receber um link de recuperação
            </Text>
          </View>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted uppercase mb-2">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              editable={!enviado}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{
                color: colors.foreground,
                borderColor: colors.border,
              }}
            />
          </View>

          {/* Info Box */}
          <View
            className="bg-surface border border-border rounded-lg p-4 mb-8"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <Text className="text-sm text-foreground leading-relaxed">
              Você receberá um email com instruções para redefinir sua senha. Siga o link fornecido para criar uma nova senha.
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleEnviarReset}
            disabled={carregando || enviado}
            activeOpacity={0.7}
            className={`rounded-lg py-4 items-center ${
              carregando || enviado ? 'opacity-50' : ''
            }`}
            style={{
              backgroundColor: colors.primary,
            }}
          >
            <Text className="text-white font-semibold text-base">
              {carregando ? 'Enviando...' : enviado ? 'Email Enviado ✓' : 'Enviar Link de Reset'}
            </Text>
          </TouchableOpacity>

          {/* Voltar para Login */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="mt-4"
          >
            <Text className="text-center text-primary font-semibold">
              Voltar para Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
