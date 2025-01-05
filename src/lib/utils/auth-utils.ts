// src/lib/utils/auth-utils.ts
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

async function ensureUserRecord(supabase: any, authUser: User, telegramUser?: TelegramUser) {
  try {
    console.log('Ensuring user record for:', authUser.id);

    // First, check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    // Prepare user data
    const userData = {
      id: authUser.id,
      telegram_id: telegramUser ? telegramUser.id.toString() : 'test_user',
      username: telegramUser ? telegramUser.username : 'test_user',
      full_name: telegramUser 
        ? `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim()
        : 'Test User'
    };

    if (!existingUser) {
      // Insert new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user record:', insertError);
        throw new Error(`Failed to create user record: ${insertError.message}`);
      }

      return newUser;
    }

    // Update existing user
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(userData)
      .eq('id', authUser.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user:', updateError);
      throw new Error(`Failed to update user record: ${updateError.message}`);
    }

    return updatedUser;

  } catch (error) {
    console.error('Error in ensureUserRecord:', error);
    throw error;
  }
}

export async function ensureUser() {
  const supabase = createClient();
  
  try {
    // Try to get current session
    const { data: { user: existingUser }, error: sessionError } = await supabase.auth.getUser();
    
    if (existingUser) {
      console.log('Found existing user:', existingUser);
      const userRecord = await ensureUserRecord(supabase, existingUser);
      if (!userRecord) {
        throw new Error('Failed to ensure user record for existing user');
      }
      return existingUser;
    }

    console.log('No user found, attempting to sign in');
    
    // Try to sign in with test credentials
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@telegram.user',
      password: process.env.NEXT_PUBLIC_TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password'
    });

    if (signInError) {
      throw signInError;
    }

    console.log('Successfully signed in:', signInData.user);
    const userRecord = await ensureUserRecord(supabase, signInData.user);
    if (!userRecord) {
      throw new Error('Failed to ensure user record after sign in');
    }

    return signInData.user;

  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
}