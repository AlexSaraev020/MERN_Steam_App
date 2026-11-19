import { useState, type FormEvent, type ReactNode } from 'react';
import { CloseIcon, PlayIcon } from '../components/icons';
import { compactInt, formatInt } from '../data/games';

type Mode = 'login' | 'signup';
type Values = { gamertag: string; email: string; password: string; confirm: string; terms: boolean };
type Errors = Partial<Record<'gamertag' | 'email' | 'password' | 'confirm' | 'terms', string>>;
type Touched = Partial<Record<keyof Values, boolean>>;

const EMPTY: Values = { gamertag: '', email: '', password: '', confirm: '', terms: false };

const validate = (mode: Mode, v: Values): Errors => {
  const e: Errors = {};
  if (mode === 'signup') {
    const tag = v.gamertag.trim();
    if (!tag) e.gamertag = 'Pick a gamertag — it is how other players see you.';
    else if (tag.length < 3 || tag.length > 16) e.gamertag = 'Gamertag must be 3–16 characters. Trim it or add more letters.';
    else if (!/^[A-Za-z0-9_.-]+$/.test(tag)) e.gamertag = 'Gamertag allows letters, numbers, dot, dash and underscore only.';
  }
  if (!v.email.trim()) e.email = 'Enter the email you sign in with.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That is not a valid email. Check for a missing @ or domain.';
  if (!v.password) e.password = 'Enter your password.';
  else if (v.password.length < 8) e.password = 'Passwords are 8 characters or longer. Yours is ' + v.password.length + '.';
  if (mode === 'signup') {
    if (v.confirm !== v.password) e.confirm = 'The two passwords do not match. Re-type the second one.';
    if (!v.terms) e.terms = 'Accept the terms to create the account.';
  }
  return e;
};

const LABELS: Record<keyof Errors, string> = {
  gamertag: 'Gamertag', email: 'Email', password: 'Password', confirm: 'Confirm password', terms: 'Terms',
};

type Props = {
  online: number;
  titles: number;
  signedIn: boolean;
  gamertag: string;
  onSignIn: () => void;
  onSignOut: () => void;
  onBrowse: () => void;
};

export default function Auth({ online, titles, signedIn, gamertag, onSignIn, onSignOut, onBrowse }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [reveal, setReveal] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  const set = (patch: Partial<Values>) => { setValues((v) => ({ ...v, ...patch })); setStatus('idle'); };
  const touch = (key: keyof Values) => { setTouched((t) => ({ ...t, [key]: true })); setErrors(validate(mode, values)); };

  const errorList = Object.entries(errors) as [keyof Errors, string][];
  const showError = (key: keyof Errors) => (touched[key] ? errors[key] : undefined);

  const switchMode = (next: Mode) => {
    setMode(next); setErrors({}); setTouched({}); setStatus('idle');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = validate(mode, values);
    setErrors(next);
    setTouched({ gamertag: true, email: true, password: true, confirm: true, terms: true });
    if (Object.keys(next).length > 0) return;
    setStatus('sending');
    window.setTimeout(() => {
      setStatus('done');
      window.setTimeout(onSignIn, 900);
    }, 800);
  };

  const focusField = (key: keyof Errors) => document.getElementById(`auth-${key}`)?.focus();

  return (
    <main id="main" className="grid lg:grid-cols-[1.05fr_.95fr] gap-0 pb-[var(--g-s9)]">
      {/* ------------------------------------------------ dramatic left panel */}
      <section className="arc-crt arc-hatch relative bg-[var(--g-panel)] min-h-[240px] lg:min-h-[calc(100vh-96px)] flex flex-col justify-between p-[var(--g-s5)] md:p-[var(--g-s7)]">
        <div className="arc-beam" aria-hidden="true" />
        <p className="arc-kicker relative z-[5]">Lobby access · 04</p>
        <div className="relative z-[5] flex flex-col gap-[var(--g-s3)]">
          <h1 className="arc-title-hero max-w-[12ch]">
            <span className="arc-flicker">Enter</span> the lobby
          </h1>
          <p className="arc-lead max-w-[46ch]">
            {titles} titles, one library, no storefront noise. Sign in to keep your favourites, your hours and your
            wishlist on every device you play on.
          </p>
        </div>
        <div className="arc-stagger relative z-[5] flex flex-wrap items-end gap-x-[var(--g-s7)] gap-y-[var(--g-s4)] pt-[var(--g-s4)]">
          <div className="arc-stat">
            <p className="arc-num text-[clamp(38px,5vw,64px)] text-[color:var(--g-acc-hi)]">{formatInt(online)}</p>
            <p className="arc-kicker mt-[4px]">In the lobby now</p>
          </div>
          <div className="arc-stat">
            <p className="arc-num text-[clamp(38px,5vw,64px)]">{String(titles).padStart(3, '0')}</p>
            <p className="arc-kicker mt-[4px]">Titles available</p>
          </div>
          <div className="arc-stat">
            <p className="arc-num text-[clamp(38px,5vw,64px)]">{compactInt(online * 4)}</p>
            <p className="arc-kicker mt-[4px]">Sessions this week</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- form */}
      <section className="bg-[var(--g-base)] p-[var(--g-s5)] md:p-[var(--g-s7)] flex flex-col gap-[var(--g-s5)]">
        {signedIn ? (
          <div className="arc-panel arc-hatch p-[var(--g-s6)] flex flex-col gap-[var(--g-s5)]">
            <p className="arc-kicker">Session active</p>
            <h2 className="arc-title">You are in, {gamertag}</h2>
            <p className="arc-body max-w-[48ch]">Favourites, hours and library visibility are synced to this account.</p>
            <div className="flex flex-wrap gap-[var(--g-s2)]">
              <button type="button" className="arc-btn arc-btn--solid" onClick={onSignIn}>Open profile</button>
              <button type="button" className="arc-btn" onClick={onSignOut}>Sign out</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-[var(--g-s2)]" role="group" aria-label="Account action">
              <button type="button" className="arc-btn" aria-pressed={mode === 'login'} onClick={() => switchMode('login')}>
                Sign in
              </button>
              <button type="button" className="arc-btn" aria-pressed={mode === 'signup'} onClick={() => switchMode('signup')}>
                Create account
              </button>
            </div>

            <h2 className="arc-h2 flex items-center gap-[var(--g-s3)]">
              <span className="arc-slash" aria-hidden="true" />
              {mode === 'login' ? 'Welcome back' : 'New player'}
            </h2>

            {errorList.length > 1 && Object.keys(touched).length > 0 && (
              <div className="arc-panel p-[var(--g-s4)] flex flex-col gap-[var(--g-s2)]" role="alert">
                <p className="arc-kicker text-[color:var(--g-acc-hi)]">{errorList.length} fields need fixing</p>
                <ul className="flex flex-col gap-[var(--g-s1)]">
                  {errorList.map(([key, msg]) => (
                    <li key={key}>
                      <button type="button" className="arc-open text-left arc-body underline decoration-[var(--g-acc)] text-[color:var(--g-fg)]" onClick={() => focusField(key)}>
                        {LABELS[key]} — {msg}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form className="flex flex-col gap-[var(--g-s4)]" onSubmit={onSubmit} noValidate>
              {mode === 'signup' && (
                <Field id="auth-gamertag" label="Gamertag" error={showError('gamertag')}>
                  <input
                    id="auth-gamertag" type="text" autoComplete="username" maxLength={24} className="arc-field"
                    value={values.gamertag} placeholder="kestrel_0x"
                    aria-invalid={showError('gamertag') ? true : undefined}
                    aria-describedby={showError('gamertag') ? 'auth-gamertag-error' : 'auth-gamertag-help'}
                    onChange={(e) => set({ gamertag: e.target.value })}
                    onBlur={() => touch('gamertag')}
                  />
                  {!showError('gamertag') && <p id="auth-gamertag-help" className="arc-meta mt-[6px]">3–16 characters. Letters, numbers, dot, dash, underscore.</p>}
                </Field>
              )}

              <Field id="auth-email" label="Email" error={showError('email')}>
                <input
                  id="auth-email" type="email" autoComplete="email" className="arc-field"
                  value={values.email} placeholder="you@example.com"
                  aria-invalid={showError('email') ? true : undefined}
                  aria-describedby={showError('email') ? 'auth-email-error' : undefined}
                  onChange={(e) => set({ email: e.target.value })}
                  onBlur={() => touch('email')}
                />
              </Field>

              <Field id="auth-password" label="Password" error={showError('password')}>
                <div className="relative">
                  <input
                    id="auth-password" type={reveal ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className="arc-field !pr-[64px]"
                    value={values.password} placeholder="At least 8 characters"
                    aria-invalid={showError('password') ? true : undefined}
                    aria-describedby={showError('password') ? 'auth-password-error' : undefined}
                    onChange={(e) => set({ password: e.target.value })}
                    onBlur={() => touch('password')}
                  />
                  <button
                    type="button"
                    className="arc-open absolute right-[6px] top-1/2 -translate-y-1/2 px-[10px] py-[8px] arc-meta"
                    aria-pressed={reveal}
                    aria-label={reveal ? 'Hide password' : 'Show password'}
                    onClick={() => setReveal((r) => !r)}
                  >
                    {reveal ? 'Hide' : 'Show'}
                  </button>
                </div>
              </Field>

              {mode === 'signup' && (
                <Field id="auth-confirm" label="Confirm password" error={showError('confirm')}>
                  <input
                    id="auth-confirm" type={reveal ? 'text' : 'password'} autoComplete="new-password" className="arc-field"
                    value={values.confirm} placeholder="Re-type the password above"
                    aria-invalid={showError('confirm') ? true : undefined}
                    aria-describedby={showError('confirm') ? 'auth-confirm-error' : undefined}
                    onChange={(e) => set({ confirm: e.target.value })}
                    onBlur={() => touch('confirm')}
                  />
                </Field>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="flex items-start gap-[var(--g-s3)] cursor-pointer">
                    <input
                      id="auth-terms" type="checkbox" className="w-[22px] h-[22px] accent-[var(--g-acc)] mt-[2px]"
                      checked={values.terms}
                      aria-invalid={showError('terms') ? true : undefined}
                      aria-describedby={showError('terms') ? 'auth-terms-error' : undefined}
                      onChange={(e) => set({ terms: e.target.checked })}
                      onBlur={() => touch('terms')}
                    />
                    <span className="arc-label">I accept the terms of service and the privacy policy.</span>
                  </label>
                  {showError('terms') && <p id="auth-terms-error" className="arc-error mt-[6px]">{showError('terms')}</p>}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-[var(--g-s3)] pt-[var(--g-s3)] border-t border-[color:var(--g-rule-soft)]">
                <button type="submit" className="arc-btn arc-btn--solid" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Checking…' : mode === 'login' ? 'Enter the lobby' : 'Create account'}
                </button>
                <button type="button" className="arc-btn" onClick={onBrowse}>
                  <CloseIcon className="w-5 h-5" />
                  Browse without an account
                </button>
                {status === 'done' && (
                  <p className="arc-ok flex items-center gap-[var(--g-s1)]" role="status">
                    <PlayIcon className="w-5 h-5" /> Access granted. Opening your lobby…
                  </p>
                )}
              </div>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="arc-label block mb-[6px]" htmlFor={id}>{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="arc-error mt-[6px]">{error}</p>}
    </div>
  );
}
