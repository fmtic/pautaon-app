import * as Notifications from 'expo-notifications';
import { supabase } from './supabase';

/**
 * Setup básico de notificações push
 * Para usar em produção, configure:
 * 1. Expo Push Notifications (https://expo.dev/notifications)
 * 2. Supabase Realtime para ouvir novos informativos
 */

// Configurar handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Registrar dispositivo para receber notificações
 */
export async function registerForPushNotifications() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão de notificação negada');
      return;
    }

    // Obter token do dispositivo
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);

    // Salvar token no Supabase (opcional)
    // await supabase
    //   .from('push_tokens')
    //   .insert({ token, usuario_id: usuarioId });

    return token;
  } catch (err) {
    console.error('Erro ao registrar notificações:', err);
  }
}

/**
 * Enviar notificação local (para testes)
 */
export async function sendLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      badge: 1,
    },
    trigger: { seconds: 2 } as any,
  });
}

/**
 * Setup de Realtime para ouvir novos informativos
 * Quando um novo informativo é criado, envia notificação
 */
export function setupRealtimeNotifications(alunoId: number) {
  const channel = supabase
    .channel(`informativos:aluno_id=eq.${alunoId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'informativos',
        filter: `aluno_id=eq.${alunoId}`,
      },
      (payload) => {
        const novoInformativo = payload.new as any;
        sendLocalNotification(
          '📢 Novo Informativo',
          novoInformativo.titulo
        );
      }
    )
    .subscribe();

  return channel;
}
