import { ScrollView, Text, View, TouchableOpacity, Switch, Alert, Linking } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const { logout, usuario } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da aplicação?",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Sair",
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleFalarComSecretaria = () => {
    const phoneNumber = '5521972531909';
    const message = 'Olá! Tenho uma dúvida sobre os informativos da escola.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
    });
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-4 pb-6">
        <Text className="text-3xl font-bold text-white mb-1">Perfil</Text>
        <Text className="text-sm text-white opacity-80">
          Informações e preferências
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-6 py-6 gap-6">
          {/* Responsável Info */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Responsável</Text>
            <View className="bg-surface rounded-2xl p-4 gap-3">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                  <Text className="text-2xl">👤</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    João Silva
                  </Text>
                  <Text className="text-xs text-muted mt-1">Pai/Mãe</Text>
                </View>
              </View>
              <View className="border-t border-border pt-3 gap-2">
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-muted w-16">Email:</Text>
                  <Text className="text-sm text-foreground flex-1">
                    joao.silva@email.com
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-muted w-16">Fone:</Text>
                  <Text className="text-sm text-foreground">
                    (11) 98765-4321
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Aluno Info */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Aluno(a)</Text>
            <View className="bg-surface rounded-2xl p-4 gap-3">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                  <Text className="text-2xl">🎓</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    Maria Silva
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Série: 3º Ano - Ensino Médio
                  </Text>
                </View>
              </View>
              <View className="border-t border-border pt-3 gap-2">
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-muted w-20">Matrícula:</Text>
                  <Text className="text-sm text-foreground font-semibold">
                    2026001234
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-muted w-20">Turma:</Text>
                  <Text className="text-sm text-foreground">3º A</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notificações */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Preferências de Notificações
            </Text>
            <View className="bg-surface rounded-2xl p-4 gap-4">
              {/* Push Notifications */}
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">
                    Notificações Push
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Receba alertas em tempo real
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={notificationsEnabled ? colors.primary : colors.muted}
                />
              </View>

              {/* Email Notifications */}
              <View className="border-t border-border pt-4 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">
                    Notificações por Email
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Resumo semanal de eventos
                  </Text>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={emailNotifications ? colors.primary : colors.muted}
                />
              </View>
            </View>
          </View>

          {/* Sobre */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Sobre</Text>
            <View className="bg-surface rounded-2xl p-4 gap-3">
              <View className="flex-row items-center justify-between pb-3 border-b border-border">
                <Text className="text-sm text-foreground">Versão do App</Text>
                <Text className="text-sm font-semibold text-primary">1.0.0</Text>
              </View>
              <TouchableOpacity className="py-2">
                <Text className="text-sm text-primary font-medium">
                  Política de Privacidade
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-2">
                <Text className="text-sm text-primary font-medium">
                  Termos de Uso
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-2">
                <Text className="text-sm text-primary font-medium">
                  Entre em Contato
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Admin Dashboard Button */}
          {usuario?.tipo_usuario === 'admin' && (
            <TouchableOpacity
              onPress={() => router.push('/admin-dashboard')}
              activeOpacity={0.7}
              className="bg-warning rounded-xl py-4 items-center mb-4"
            >
              <Text className="text-white font-semibold">⚙️ Painel Admin</Text>
            </TouchableOpacity>
          )}

          {/* WhatsApp Button */}
          <TouchableOpacity
            onPress={handleFalarComSecretaria}
            activeOpacity={0.7}
            className="bg-primary rounded-xl py-4 items-center mb-4"
          >
            <Text className="text-white font-semibold">💬 Fale com a Secretaria</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="bg-error rounded-xl py-4 items-center mb-6"
          >
            <Text className="text-white font-semibold">Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
