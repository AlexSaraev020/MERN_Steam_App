import { useState, type FormEvent, type ReactNode } from 'react';
import { CloseIcon } from '../components/icons';
import { loginAccount, registerAccount, rememberToken, toServerUser, type ServerUser } from '../actions/apiRequests';

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
  signedIn: boolean;
  gamertag: string;
  onSignIn: (account: ServerUser) => void;
  onSignOut: () => void;
  onBrowse: () => void;
  onOpenProfile: () => void;
};

export default function Auth({ signedIn, gamertag, onSignIn, onSignOut, onBrowse, onOpenProfile }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [reveal, setReveal] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending'>('idle');

  const set = (patch: Partial<Values>) => { setValues((v) => ({ ...v, ...patch })); setStatus('idle'); };
  const touch = (key: keyof Values) => { setTouched((t) => ({ ...t, [key]: true })); setErrors(validate(mode, values)); };

  const errorList = Object.entries(errors) as [keyof Errors, string][];
  const showError = (key: keyof Errors) => (touched[key] ? errors[key] : undefined);

  const switchMode = (next: Mode) => {
    setMode(next); setErrors({}); setTouched({}); setStatus('idle');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate(mode, values);
    setErrors(next);
    setTouched({ gamertag: true, email: true, password: true, confirm: true, terms: true });
    if (Object.keys(next).length > 0) return;

    const email = values.email.trim();
    setStatus('sending');
    const first = mode === 'login'
      ? await loginAccount({ email, password: values.password, rememberMe: true })
      : await registerAccount({ name: values.gamertag.trim(), email, password: values.password });
    /* /register answers with the account, not a session — sign it in right away. */
    const result = first.ok && mode === 'signup'
      ? await loginAccount({ email, password: values.password, rememberMe: true })
      : first;

    if (!result.ok) {
      setStatus('idle');
      const field: keyof Errors = /password/i.test(result.message) ? 'password' : 'email';
      setErrors({ ...next, [field]: result.message });
      setTouched({ gamertag: true, email: true, password: true, confirm: true, terms: true });
      return;
    }
    rememberToken(result.data.token);
    onSignIn(toServerUser(result.data));
  };

  const focusField = (key: keyof Errors) => document.getElementById(`auth-${key}`)?.focus();

  return (
    <main id="main" className="arc-auth">
      {/* ------------------------------------------------ the promise, plainly */}
      <section className="arc-auth-aside" aria-label="What signing in gives you">
        <div className="arc-auth-copy">
          <p className="arc-eyebrow">IGDB catalogue, scored by its players</p>
          <h1 className="arc-title-hero">Enter the lobby</h1>
          <p className="arc-lead">
            One library, no storefront noise. Sign in and the titles you heart are waiting for you
            next time.
          </p>
        </div>
        {/* Only what the catalogue can back. Sessions, hours and live player counts
            are not in this feed, so they are not on this page. */}
        <div className="arc-stats">
          <p className="arc-stat">
            <span className="arc-num arc-num--hero arc-num--warm">388k</span>
            <span className="arc-meta">titles searchable on IGDB</span>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- form */}
      <section className="arc-auth-form" aria-label="Account">
        {signedIn ? (
          <div className="arc-panel arc-stack--tight">
            <p className="arc-meta">Session active</p>
            <h2 className="arc-title">You are in, {gamertag}</h2>
            <p className="arc-body">Your favourites and your profile text are saved on the account, so they
              are here again the next time you open this on any device you sign in on.</p>
            <div className="arc-view-group">
              <button type="button" className="arc-btn arc-btn--solid" onClick={onOpenProfile}>Open profile</button>
              <button type="button" className="arc-btn" onClick={onSignOut}>Sign out</button>
            </div>
          </div>
        ) : (
          <>
            <div className="arc-view-group" role="group" aria-label="Account action">
              <button type="button" className="arc-btn" aria-pressed={mode === 'login'} onClick={() => switchMode('login')}>
                Sign in
              </button>
              <button type="button" className="arc-btn" aria-pressed={mode === 'signup'} onClick={() => switchMode('signup')}>
                Create account
              </button>
            </div>

            <h2 className="arc-h2">{mode === 'login' ? 'Welcome back' : 'New player'}</h2>

            {errorList.length > 1 && Object.keys(touched).length > 0 && (
              <div className="arc-panel arc-error-summary" role="alert">
                <p className="arc-error">{errorList.length} fields need fixing</p>
                <ul className="arc-list">
                  {errorList.map(([key, msg]) => (
                    <li key={key}>
                      <button type="button" className="arc-open arc-link" onClick={() => focusField(key)}>
                        {LABELS[key]}: {msg}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form className="arc-stack--tight" onSubmit={onSubmit} noValidate>
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
                  {!showError('gamertag') && <p id="auth-gamertag-help" className="arc-help">3–16 characters. Letters, numbers, dot, dash, underscore.</p>}
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
                <div className="arc-field-shell">
                  <input
                    id="auth-password" type={reveal ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className="arc-field arc-field--reveal"
                    value={values.password} placeholder="At least 8 characters"
                    aria-invalid={showError('password') ? true : undefined}
                    aria-describedby={showError('password') ? 'auth-password-error' : undefined}
                    onChange={(e) => set({ password: e.target.value })}
                    onBlur={() => touch('password')}
                  />
                  <button
                    type="button"
                    className="arc-reveal"
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
                  <label className="arc-auth-row" htmlFor="auth-terms">
                    <input
                      id="auth-terms" type="checkbox" className="arc-checkbox"
                      checked={values.terms}
                      aria-invalid={showError('terms') ? true : undefined}
                      aria-describedby={showError('terms') ? 'auth-terms-error' : undefined}
                      onChange={(e) => set({ terms: e.target.checked })}
                      onBlur={() => touch('terms')}
                    />
                    <span className="arc-label">I accept the terms of service and the privacy policy.</span>
                  </label>
                  {showError('terms') && <p id="auth-terms-error" className="arc-error">{showError('terms')}</p>}
                </div>
              )}

              <div className="arc-auth-actions">
                <button type="submit" className="arc-btn arc-btn--solid" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Checking…' : mode === 'login' ? 'Enter the lobby' : 'Create account'}
                </button>
                <button type="button" className="arc-btn" onClick={onBrowse}>
                  <CloseIcon className="arc-icon" />
                  Browse without an account
                </button>
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
    <div className="arc-field-block">
      <label className="arc-label" htmlFor={id}>{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="arc-error">{error}</p>}
    </div>
  );
}
