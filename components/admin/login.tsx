'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { browserSupabase } from '@/lib/supabase/client';
import { Brand } from '@/components/layout/brand';
export function Login({ configured }: { configured: boolean }) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  return (
    <main className="login-page" id="conteudo">
      <div className="login-story">
        <Brand />
        <div>
          <span className="eyebrow">ENGENHARIA. CONFIANÇA. RESULTADO.</span>
          <h1>Grandes projetos merecem ser vistos.</h1>
          <p>Gerencie as obras e apresente a energia que a FM SOLAR transforma todos os dias.</p>
        </div>
        <small>FM SOLAR · Energia Sustentável</small>
      </div>
      <div className="login-content">
        <div className="mobile-login-brand">
          <Brand />
        </div>
        <form
          className="login-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            const f = new FormData(e.currentTarget);
            try {
              const db = browserSupabase();
              const { data, error } = await db.auth.signInWithPassword({
                email: String(f.get('email')).trim(),
                password: String(f.get('password')),
              });
              if (error) {
                if (error.code === 'invalid_credentials')
                  throw Error(
                    'E-mail ou senha inválidos. Confira os dados digitados e o preenchimento automático.',
                  );
                if (error.code === 'email_not_confirmed')
                  throw Error('Confirme seu e-mail antes de entrar.');
                if (error.status === 429)
                  throw Error(
                    'Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.',
                  );
                throw Error(
                  'Não foi possível conectar ao serviço de login. Tente novamente em instantes.',
                );
              }
              if (!data.user) throw Error('Não foi possível iniciar a sessão. Tente novamente.');
              const { data: profile, error: profileError } = await db
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();
              if (profileError && profileError.code !== 'PGRST116')
                throw Error(
                  'Login aceito, mas não foi possível verificar sua permissão. Tente novamente.',
                );
              if (profile?.role !== 'admin') {
                await db.auth.signOut();
                throw Error('Este usuário não tem acesso administrativo.');
              }
              router.replace('/admin/dashboard');
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Erro ao entrar.');
            } finally {
              setBusy(false);
            }
          }}
        >
          <span className="card-icon">
            <LockKeyhole />
          </span>
          <h2>Painel Administrativo</h2>
          <p>Bem-vindo de volta. Acesse sua conta para continuar.</p>
          {!configured && (
            <div className="notice">
              Configure as variáveis do Supabase para habilitar o acesso. Consulte o README do
              projeto.
            </div>
          )}
          <label className="field">
            E-mail
            <input type="email" name="email" autoComplete="username" required />
          </label>
          <label className="field">
            Senha
            <div className="password-field">
              <input
                type={show ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="icon-button"
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
          <button className="button navy" disabled={!configured || busy}>
            {busy ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
