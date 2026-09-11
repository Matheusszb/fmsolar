import { describe, expect, it } from 'vitest';
import { normalizeSupabaseUrl } from '../lib/supabase/config';

describe('Supabase project URL', () => {
  it.each([
    ['https://example.supabase.co', 'https://example.supabase.co'],
    [' https://example.supabase.co/rest/v1/ ', 'https://example.supabase.co'],
    ['https://example.supabase.co/rest/v1', 'https://example.supabase.co'],
    ['http://localhost:54321/', 'http://localhost:54321'],
    ['https://custom.example/supabase/', 'https://custom.example/supabase'],
    ['', ''],
  ])('normalizes %s without duplicating API paths', (input, expected) => {
    expect(normalizeSupabaseUrl(input)).toBe(expected);
  });
});
