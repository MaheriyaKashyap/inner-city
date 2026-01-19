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
    // Supabase's functions.invoke() automatically includes the anon key
    // Don't override headers - let Supabase handle authentication
    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
    });

    if (error) {
      // If 401, try with explicit anon key in Authorization header
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        console.warn(`Function ${functionName} returned 401, retrying with explicit anon key...`);
        
        // Retry with explicit Authorization header
        const { data: retryData, error: retryError } = await supabase.functions.invoke(functionName, {
          body,
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        });
        
        if (retryError) {
          console.error(`Function ${functionName} still failing after retry:`, retryError);
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
