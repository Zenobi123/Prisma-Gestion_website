// Connexions Supabase désactivées temporairement pour durcissement sécurité.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_ENABLED = false;

const createDisabledError = () => ({
  message: 'Supabase est temporairement désactivé pour maintenance sécurité.',
  code: 'SUPABASE_DISABLED',
});

class DisabledQueryBuilder {
  private readonly result = { data: null, error: createDisabledError() };

  select() { return this; }
  insert() { return this; }
  update() { return this; }
  upsert() { return this; }
  delete() { return this; }
  eq() { return this; }
  neq() { return this; }
  gt() { return this; }
  gte() { return this; }
  lt() { return this; }
  lte() { return this; }
  like() { return this; }
  ilike() { return this; }
  is() { return this; }
  in() { return this; }
  contains() { return this; }
  containedBy() { return this; }
  overlaps() { return this; }
  textSearch() { return this; }
  filter() { return this; }
  not() { return this; }
  or() { return this; }
  order() { return this; }
  limit() { return this; }
  range() { return this; }
  single() { return Promise.resolve(this.result); }
  maybeSingle() { return Promise.resolve(this.result); }

  then<TResult1 = typeof this.result, TResult2 = never>(
    onfulfilled?: ((value: typeof this.result) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.result).then(onfulfilled ?? undefined, onrejected ?? undefined);
  }
}

const createDisabledSupabaseClient = () => {
  const disabledResult = { data: null, error: createDisabledError() };

  return {
    auth: {
      onAuthStateChange: (callback: (event: 'SIGNED_OUT', session: null) => void) => {
        setTimeout(() => callback('SIGNED_OUT', null), 0);
        return {
          data: {
            subscription: { unsubscribe: () => undefined },
          },
        };
      },
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ error: createDisabledError() }),
      signUp: async () => ({ error: createDisabledError() }),
      signOut: async () => ({ error: null }),
      refreshSession: async () => ({ error: createDisabledError() }),
    },
    from: () => new DisabledQueryBuilder(),
    rpc: async () => disabledResult,
    channel: () => ({
      on: () => ({
        subscribe: () => ({})
      }),
      subscribe: () => ({}),
    }),
    removeChannel: () => undefined,
  };
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = (SUPABASE_ENABLED
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : createDisabledSupabaseClient()) as ReturnType<typeof createClient<Database>>;
