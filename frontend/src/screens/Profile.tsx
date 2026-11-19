import { useState, type CSSProperties, type FormEvent } from 'react';
import { type Route } from '../components/ArcadeNav';
import { type CardActions } from '../components/GameCard';
import { CheckIcon, HeartIcon } from '../components/icons';
import { GAME_BY_ID, type Game, GENRES, type Genre, type Profile as ProfileData, formatDate } from '../data/games';

type Props = CardActions & {
  profile: ProfileData;
  games: Game[];
  onSaveProfile: (next: ProfileData) => void;
  onNavigate: (route: Route) => void;
};

type Errors = Partial<Record<'gamertag' | 'bio', string>>;

const BIO_MAX = 160;

const validate = (draft: ProfileData): Errors => {
  const errors: Errors = {};
  const tag = draft.gamertag.trim();
  if (tag.length < 3 || tag.length > 16) errors.gamertag = 'Gamertag must be 3–16 characters. Trim it or add more letters.';
  else if (!/^[A-Za-z0-9_.-]+$/.test(tag)) errors.gamertag = 'Gamertag allows letters, numbers, dot, dash and underscore only.';
  if (draft.bio.length > BIO_MAX) errors.bio = `Bio is ${draft.bio.length} characters — ${draft.bio.length - BIO_MAX} over the limit. Shorten it.`;
  return errors;
};

export default function Profile({ profile, games, favourites, onToggleFavourite, onOpen, onSaveProfile, onNavigate }: Props) {
  const [draft, setDraft] = useState<ProfileData>(profile);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const favouriteGames = favourites.map((id) => GAME_BY_ID[id]).filter(Boolean);
  const stats = [
    { label: 'Games owned', value: profile.owned.length },
    { label: 'Favourites', value: favourites.length },
    { label: 'Hours this week', value: profile.weeklyHours },
  ];

  const onBlurField = () => setErrors(validate(draft));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = validate(draft);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setStatus('saving');
    window.setTimeout(() => {
      onSaveProfile({ ...draft, gamertag: draft.gamertag.trim() });
      setStatus('saved');
    }, 700);
  };

  return (
    <main id="main" className="flex flex-col gap-[var(--g-s7)] pb-[var(--g-s9)]">
      {/* ------------------------------------------------------------ header */}
      <header className="arc-crt relative arc-panel !bg-[var(--g-panel-2)] px-[var(--g-s5)] md:px-[var(--g-s7)] py-[var(--g-s6)] flex flex-wrap items-end gap-[var(--g-s6)]">
        <div className="flex items-end gap-[var(--g-s5)]">
          <div
            className="arc-crt relative grid place-items-center w-[92px] h-[92px] shrink-0 bg-[var(--g-panel)] shadow-[inset_0_0_0_1px_var(--g-acc),0_0_28px_-6px_rgba(239,68,68,.55)]"
            style={{ ['--g-hue']: 348 } as CSSProperties}
            aria-hidden="true"
          >
            <span className="arc-num text-[40px] text-[color:var(--g-fg)]">{profile.initials}</span>
          </div>
          <div>
            <p className="arc-kicker">Account · {profile.id.toUpperCase()} · joined {formatDate(profile.joined)}</p>
            <h1 className="arc-title mt-[var(--g-s1)]">{profile.gamertag}</h1>
            <p className="arc-body max-w-[56ch] mt-[var(--g-s2)]">{profile.bio}</p>
            <p className="arc-meta mt-[var(--g-s2)]">
              Favourite genre: <span className="text-[color:var(--g-fg)]">{profile.favouriteGenre}</span> ·
              Library is <span className="text-[color:var(--g-fg)]">{profile.publicLibrary ? 'public' : 'private'}</span>
            </p>
          </div>
        </div>

        <ul className="arc-stagger grid grid-cols-3 gap-[var(--g-s5)] md:ml-auto">
          {stats.map((s) => (
            <li key={s.label} className="arc-stat">
              <p className="arc-num text-[clamp(34px,4.4vw,60px)] text-[color:var(--g-acc-hi)]">
                {String(s.value).padStart(2, '0')}
              </p>
              <p className="arc-kicker mt-[4px]">{s.label}</p>
            </li>
          ))}
        </ul>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] gap-[var(--g-s6)] px-[var(--g-s4)] md:px-[var(--g-s6)]">
        {/* ----------------------------------------------------------- edit form */}
        <section aria-label="Edit profile" className="arc-panel p-[var(--g-s5)] md:p-[var(--g-s6)]">
          <h2 className="arc-h2 flex items-center gap-[var(--g-s3)] mb-[var(--g-s5)]">
            <span className="arc-slash" aria-hidden="true" />
            Edit profile
          </h2>

          <form className="flex flex-col gap-[var(--g-s5)]" onSubmit={onSubmit} noValidate>
            <div>
              <label className="arc-label block mb-[6px]" htmlFor="pf-tag">Gamertag</label>
              <input
                id="pf-tag"
                name="gamertag"
                className="arc-field"
                value={draft.gamertag}
                maxLength={24}
                aria-invalid={errors.gamertag ? true : undefined}
                aria-describedby={errors.gamertag ? 'pf-tag-error' : undefined}
                onChange={(e) => { setDraft({ ...draft, gamertag: e.target.value }); setStatus('idle'); }}
                onBlur={onBlurField}
              />
              {errors.gamertag && <p id="pf-tag-error" className="arc-error mt-[6px]">{errors.gamertag}</p>}
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-[var(--g-s3)] mb-[6px]">
                <label className="arc-label" htmlFor="pf-bio">Bio</label>
                <span className={`arc-meta ${draft.bio.length > BIO_MAX ? 'text-[color:var(--g-acc-hi)]' : ''}`}>
                  {draft.bio.length} / {BIO_MAX}
                </span>
              </div>
              <textarea
                id="pf-bio"
                name="bio"
                rows={3}
                className="arc-field !h-auto min-h-[92px] resize-y"
                value={draft.bio}
                aria-invalid={errors.bio ? true : undefined}
                aria-describedby={errors.bio ? 'pf-bio-error' : 'pf-bio-help'}
                onChange={(e) => { setDraft({ ...draft, bio: e.target.value }); setStatus('idle'); }}
                onBlur={onBlurField}
              />
              {errors.bio
                ? <p id="pf-bio-error" className="arc-error mt-[6px]">{errors.bio}</p>
                : <p id="pf-bio-help" className="arc-meta mt-[6px]">Shown on your profile card. 160 characters max.</p>}
            </div>

            <div className="grid gap-[var(--g-s4)] sm:grid-cols-2">
              <div>
                <label className="arc-label block mb-[6px]" htmlFor="pf-genre">Favourite genre</label>
                <select
                  id="pf-genre"
                  className="arc-field"
                  value={draft.favouriteGenre}
                  onChange={(e) => setDraft({ ...draft, favouriteGenre: e.target.value as Genre })}
                >
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <span className="arc-label block mb-[6px]">Library visibility</span>
                <div className="flex gap-[var(--g-s2)]" role="group" aria-label="Library visibility">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      className="arc-chip"
                      aria-pressed={draft.publicLibrary === v}
                      onClick={() => setDraft({ ...draft, publicLibrary: v })}
                    >
                      {v ? 'Public' : 'Private'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-[var(--g-s3)] pt-[var(--g-s2)] border-t border-[color:var(--g-rule-soft)]">
              <button type="submit" className="arc-btn arc-btn--solid" disabled={status === 'saving'}>
                {status === 'saving' ? 'Saving…' : 'Save profile'}
              </button>
              <button
                type="button"
                className="arc-btn"
                disabled={status === 'saving'}
                onClick={() => { setDraft(profile); setErrors({}); setStatus('idle'); }}
              >
                Discard changes
              </button>
              {status === 'saved' && (
                <p className="arc-ok flex items-center gap-[var(--g-s1)]" role="status">
                  <CheckIcon className="w-5 h-5" /> Profile updated.
                </p>
              )}
            </div>
          </form>
        </section>

        {/* ------------------------------------------------------- favourites rail */}
        <section aria-label="Favourite games" className="min-w-0">
          <h2 className="arc-h2 flex items-center gap-[var(--g-s3)] mb-[var(--g-s4)]">
            <span className="arc-slash" aria-hidden="true" />
            Favourites
            <span className="arc-num arc-num-md ml-auto">{String(favouriteGames.length).padStart(2, '0')}</span>
          </h2>

          {favouriteGames.length === 0 ? (
            <p className="arc-panel p-[var(--g-s5)] arc-body">
              You have no favourites yet — the rail is empty because nothing is hearted. Tap the heart on any card in{' '}
              <button type="button" className="arc-open underline decoration-[var(--g-acc)] text-[color:var(--g-fg)]" onClick={() => onNavigate('games')}>All games</button>{' '}
              to fill it.
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-[var(--g-s3)]">
                {favouriteGames.map((g, i) => (
                  <li key={g.id} className="arc-row grid-cols-[72px_1fr_auto] gap-[var(--g-s4)]">
                    <div className="arc-crt arc-art" style={{ ['--g-hue']: g.hue } as CSSProperties}>
                      {g.cover
                        ? <img src={g.cover} alt={`Cover art for ${g.title}`} width={460} height={215} loading="lazy" />
                        : <span className="arc-art-code">{String(i + 1).padStart(2, '0')}</span>}
                    </div>
                    <div className="min-w-0">
                      <h3 className="arc-h3">
                        <button type="button" className="arc-open text-left truncate max-w-full hover:text-[color:var(--g-acc-hi)] focus-visible:outline-none focus-visible:text-[color:var(--g-acc-hi)]" onClick={() => onOpen(g.id)}>
                          {g.title}
                        </button>
                      </h3>
                      <p className="arc-meta mt-[4px]">{g.genres.join(' / ')}</p>
                    </div>
                    <button
                      type="button"
                      className="arc-heart !static"
                      aria-pressed="true"
                      aria-label={`Remove ${g.title} from favourites`}
                      onClick={() => onToggleFavourite(g.id)}
                    >
                      <HeartIcon className="w-5 h-5" filled />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="arc-meta mt-[var(--g-s3)]">
                {games.length} titles in the catalogue · {profile.owned.length} owned
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
