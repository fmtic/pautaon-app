// app/services/googleCalendar.ts
import { EXPO_PUBLIC_GOOGLE_CALENDAR_API_KEY } from '@env';

// Exemplo de função para buscar eventos públicos
export const fetchPublicCalendarEvents = async (calendarId: string) => {
  const apiKey = EXPO_PUBLIC_GOOGLE_CALENDAR_API_KEY;
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Erro ao buscar eventos do Google Calendar:", error);
    return [];
  }
};