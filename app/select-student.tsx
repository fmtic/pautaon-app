// Tela obsoleta desde a Fase 16 (tabela alunos removida)
// Redireciona automaticamente para o home
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function SelectStudentScreen() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/(tabs)');
  }, []);
  return null;
}