import { describe, it, expect } from 'vitest';
import { supabase } from './supabase';

describe('Supabase Connection', () => {
  it('should connect to Supabase and fetch usuarios table', async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'tic@projetograel.org.br')
      .single();

    console.log('Query result:', { data, error });
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data?.email).toBe('tic@projetograel.org.br');
  });

  it('should validate password comparison', async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('senha_provisoria')
      .eq('email', 'tic@projetograel.org.br')
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }

    console.log('Stored password:', data?.senha_provisoria);
    console.log('Password length:', data?.senha_provisoria?.length);
    
    // Test with the password we're using
    const testPassword = 'Teste123!';
    const storedPassword = data?.senha_provisoria?.trim();
    
    console.log('Comparing:', { stored: storedPassword, test: testPassword, match: storedPassword === testPassword });
    
    expect(storedPassword).toBe(testPassword);
  });
});
