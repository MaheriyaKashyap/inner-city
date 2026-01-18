/**
 * Supabase Client Configuration
 * 
 * Get your Supabase URL and anon key from:
 * https://app.supabase.com/project/_/settings/api
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL and Anon Key are required. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file'
  );
} else {
  console.log('✅ Supabase connected:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper function to call Supabase Edge Functions
export async function invokeSupabaseFunction<T = any>(
  functionName: string,
  body?: any
): Promise<T> {
  try {
    // Get the current session to include auth headers
    const { data: { session } } = await supabase.auth.getSession();
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
      headers: {
        Authorization: session ? `Bearer ${session.access_token}` : '',
      },
    });

    if (error) {
      // If 401, try without auth (for public functions)
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        const { data: retryData, error: retryError } = await supabase.functions.invoke(functionName, {
          body,
        });
        
        if (retryError) {
          throw retryError;
        }
        
        return retryData as T;
      }
      throw error;
    }

    return data as T;
  } catch (error: any) {
    console.error(`Error calling Supabase function ${functionName}:`, error);
    throw error;
  }
}
