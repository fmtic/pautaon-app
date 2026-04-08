import { ScrollView, Text, View, TouchableOpacity, Switch, Alert, Linking } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const { logout, usuario, alunos } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar" },
      {
        text: "Sair",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };

  const handleFalarComSecretaria = () => {
    const phoneNumber = "5521972531909";
    const message = "Olá! Tenho uma dúvida sobre os informativos da escola.";
    Linking.openURL(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    ).catch(() => Alert.alert("Erro", "Não foi possível abrir o WhatsApp"));
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
          {/* Dados do Usuário */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              {usuario?.tipo_usuario === "admin" ? "Administrador" : "Responsável"}
            </Text>
            <View className="bg-surface rounded-2xl p-4 gap-3">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                  <Text className="text-2xl">
                    {usuario?.tipo_usuario === "admin" ? "⚙️" : "👤"}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {usuario?.nome || "—"}
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    {usuario?.tipo_usuario === "admin" ? "Admin" : "Responsável"}
                  </Text>
                </View>
              </View>
              <View className="border-t border-border pt-3">
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-muted w-16">Email:</Text>
                  <Text className="text-sm text-foreground flex-1">
                    {usuario?.email || "—"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Alunos vinculados (apenas para responsáveis) */}
          {usuario?.tipo_usuario !== "admin" && alunos.length > 0 && (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">
                {alunos.length === 1 ? "Aluno" : "Alunos"}
              </Text>
              {alunos.map((aluno) => (
                <View key={aluno.id} className="bg-surface rounded-2xl p-4 gap-2">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                      <Text className="text-xl">🎓</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {aluno.nome}
                      </Text>
                      <Text className="text-xs text-muted mt-1">{aluno.serie}</Text>
                    </View>
                  </View>
                  <View className="border-t border-border pt-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs text-muted w-20">Matrícula:</Text>
                      <Text className="text-sm text-foreground font-semibold">
                        {aluno.matricula}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Notificações */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Notificações
            </Text>
            <View className="bg-surface rounded-2xl p-4 gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">
                    Push
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Receba alertas em tempo real
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>
              <View className="border-t border-border pt-4 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">
                    Email
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Resumo semanal de eventos
                  </Text>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>
            </View>
          </View>

          {/* Admin Dashboard */}
          {usuario?.tipo_usuario === "admin" && (
            <TouchableOpacity
              onPress={() => router.push("/admin-dashboard")}
              activeOpacity={0.7}
              className="bg-warning rounded-xl py-4 items-center"
            >
              <Text className="text-white font-semibold">⚙️ Painel Admin</Text>
            </TouchableOpacity>
          )}

          {/* WhatsApp */}
          <TouchableOpacity
            onPress={handleFalarComSecretaria}
            activeOpacity={0.7}
            className="bg-primary rounded-xl py-4 items-center"
          >
            <Text className="text-white font-semibold">💬 Fale com a Secretaria</Text>
          </TouchableOpacity>

          {/* Logout */}
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
