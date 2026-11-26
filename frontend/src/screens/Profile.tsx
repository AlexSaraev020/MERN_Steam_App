import { useState, type FormEvent } from 'react';
import { type Route } from '../components/ArcadeNav';
import { type CardActions } from '../components/GameCard';
import GameCard from '../components/GameCard';
import HoursControl from '../components/HoursControl';
import { CheckIcon, CogIcon } from '../components/icons';
import { type Game, formatHours, type Playtime, totalHours } from '../data/games';
import { type ServerUser } from '../actions/apiRequests';

type SaveResult = { ok: true; data: any } | { ok: false; message: string };

type Props = CardActions & {
  account: ServerUser;
  games: Game[];
  playtime: Playtime;
  onAddPlaytime: (id: string, hours: number) => void;
  onSaveAccount: (next: { name: string; bio: string }) => Promise<SaveResult>;
  onSignOut: () => void;
  onNavigate: (route: Route) => void;
};

type Errors = Partial<Record<'gamertag' | 'bio', string>>;

const TAG_MIN = 3;
const TAG_MAX = 16;
const BIO_MAX = 160;

const validate = (draft: { name: string; bio: string }): Errors => {
  const errors: Errors = {};
  const tag = draft.name.trim();
  if (tag.length < TAG_MIN || tag.length > TAG_MAX) errors.gamertag = `Gamertag must be ${TAG_MIN}–${TAG_MAX} characters. Trim it or add more letters.`;
  else if (!/^[A-Za-z0-9_.-]+$/.test(tag)) errors.gamertag = 'Gamertag allows letters, numbers, dot, dash and underscore only.';
  if (draft.bio.length > BIO_MAX) errors.bio = `Bio is ${draft.bio.length} characters — ${draft.bio.length - BIO_MAX} over the limit. Shorten it.`;
  return errors;
};

/* Two grids, both on data the app really holds: playtime logged in this browser and
   favourites stored on the account. The editor behind the cog stays closed until you
   ask for it, so the profile reads as a shelf instead of a form. */
export default function Profile({
  account, games, favourites, playtime, onAddPlaytime, onToggleFavourite, onOpen,
  onSaveAccount, onSignOut, onNavigate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: account.name, bio: account.bio });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [serverError, setServerError] = useState('');

  const byId = new Map(games.map((g) => [g.id, g]));
  const played = Object.entries(playtime)
    .map(([id, hours]) => ({ game: byId.get(id), hours }))
    .filter((row): row is { game: Game; hours: number } => !!row.game)
    .sort((a, b) => b.hours - a.hours);
  const favouriteGames = games.filter((g) => favourites.includes(g.id));
  const initials = account.name.slice(0, 2).toUpperCase() || '——';

  const stats = [
    { label: 'Hours logged', value: formatHours(totalHours(playtime)) },
    { label: 'Titles played', value: String(played.length).padStart(2, '0') },
    { label: 'Favourites', value: String(favouriteGames.length).padStart(2, '0') },
  ];

  const openEditor = () => {
    setDraft({ name: account.name, bio: account.bio });
    setErrors({});
    setServerError('');
    setStatus('idle');
    setEditing(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate(draft);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setStatus('saving');
    setServerError('');
    const result = await onSaveAccount({ name: draft.name.trim(), bio: draft.bio });
    if (!result.ok) { setStatus('idle'); setServerError(result.message); return; }
    setStatus('saved');
  };

  return (
    <main id="main" className="arc-main">
      {/* ------------------------------------------------------------ header */}
      <header className="arc-wrap arc-profile-head">
        <div className="arc-profile-id">
          <div className="arc-avatar" aria-hidden="true">{initials}</div>
          <div>
            <p className="arc-meta">Account</p>
            <h1 className="arc-title">{account.name}</h1>
            {account.bio && <p className="arc-body">{account.bio}</p>}
          </div>
        </div>

        <div className="arc-profile-actions">
          <ul className="arc-stats">
            {stats.map((s) => (
              <li key={s.label} className="arc-stat">
                <span className="arc-num arc-num-xl arc-num--warm">{s.value}</span>
                <span className="arc-meta">{s.label}</span>
              </li>
            ))}
          </ul>
          <div>
            <button
              type="button"
              className="arc-btn"
              aria-expanded={editing}
              aria-controls="pf-editor"
              onClick={() => (editing ? setEditing(false) : openEditor())}
            >
              <CogIcon className="arc-icon" />
              {editing ? 'Close editor' : 'Edit profile'}
            </button>
            <button type="button" className="arc-btn" onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------- edit form, behind the cog */}
      {editing && (
        <section id="pf-editor" aria-label="Edit profile" className="arc-wrap">
          <div className="arc-panel">
            <h2 className="arc-h2">Edit profile</h2>
            <form className="arc-stack--tight" onSubmit={onSubmit} noValidate>
              <div className="arc-field-block">
                <label className="arc-label" htmlFor="pf-tag">Gamertag</label>
                <input
                  id="pf-tag" name="gamertag" className="arc-field" value={draft.name} maxLength={24}
                  aria-invalid={errors.gamertag ? true : undefined}
                  aria-describedby={errors.gamertag ? 'pf-tag-error' : undefined}
                  onChange={(e) => { setDraft({ ...draft, name: e.target.value }); setStatus('idle'); }}
                  onBlur={() => setErrors(validate(draft))}
                />
                {errors.gamertag && <p id="pf-tag-error" className="arc-error">{errors.gamertag}</p>}
              </div>

              <div className="arc-field-block">
                <div className="arc-backbar">
                  <label className="arc-label" htmlFor="pf-bio">Bio</label>
                  <span className={`arc-meta ${draft.bio.length > BIO_MAX ? 'arc-strong' : ''}`}>
                    {draft.bio.length} / {BIO_MAX}
                  </span>
                </div>
                <textarea
                  id="pf-bio" name="bio" rows={3} className="arc-field arc-field--area" value={draft.bio}
                  aria-invalid={errors.bio ? true : undefined}
                  aria-describedby={errors.bio ? 'pf-bio-error' : 'pf-bio-help'}
                  onChange={(e) => { setDraft({ ...draft, bio: e.target.value }); setStatus('idle'); }}
                  onBlur={() => setErrors(validate(draft))}
                />
                {errors.bio
                  ? <p id="pf-bio-error" className="arc-error">{errors.bio}</p>
                  : <p id="pf-bio-help" className="arc-help">Shown on your profile card. 160 characters max.</p>}
              </div>

              <div className="arc-auth-actions">
                <button type="submit" className="arc-btn arc-btn--solid" disabled={status === 'saving'}>
                  {status === 'saving' ? 'Saving…' : 'Save profile'}
                </button>
                <button
                  type="button" className="arc-btn" disabled={status === 'saving'}
                  onClick={() => { setDraft({ name: account.name, bio: account.bio }); setErrors({}); setStatus('idle'); setServerError(''); }}
                >
                  Discard changes
                </button>
                {status === 'saved' && (
                  <p className="arc-ok" role="status">
                    <CheckIcon className="arc-icon arc-icon--sm" /> Saved on the account.
                  </p>
                )}
                {serverError && <p className="arc-error" role="alert">The server refused the save: {serverError}</p>}
              </div>
            </form>
          </div>
        </section>
      )}

      <div className="arc-wrap arc-stack">
        {/* ------------------------------------------------------------- played */}
        <section aria-label="Games played">
          <div className="arc-section-head">
            <h2 className="arc-h2">Games played</h2>
            {played.length > 0 && (
              <p className="arc-count">
                <span className="arc-num arc-num-md">{String(played.length).padStart(2, '0')}</span>
                <span className="arc-unit">titles logged on this device</span>
              </p>
            )}
          </div>

          {played.length === 0 ? (
            <p className="arc-panel arc-body arc-empty">
              No hours logged yet. Open any title and log its hours, and it builds up here.
            </p>
          ) : (
            <ul className="arc-grid arc-grid--pair">
              {played.map((row, i) => (
                <li key={row.game.id} className="arc-shelf">
                  <GameCard
                    game={row.game} variant="grid" index={i}
                    favourite={favourites.includes(row.game.id)}
                    onToggleFavourite={onToggleFavourite} onOpen={onOpen}
                  />
                  <HoursControl
                    hours={row.hours}
                    onAdd={(h) => onAddPlaytime(row.game.id, h)}
                    label={row.game.title}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ---------------------------------------------------------- favourites */}
        <section aria-label="Favourite games">
          <div className="arc-section-head">
            <h2 className="arc-h2">Favourites</h2>
            {favouriteGames.length > 0 && (
              <p className="arc-count">
                <span className="arc-num arc-num-md">{String(favouriteGames.length).padStart(2, '0')}</span>
                <span className="arc-unit">saved on the account</span>
              </p>
            )}
          </div>

          {favouriteGames.length === 0 ? (
            <p className="arc-panel arc-body arc-empty">
              Nothing hearted yet on this account. Heart any title in{' '}
              <button type="button" className="arc-open arc-link" onClick={() => onNavigate('games')}>Search</button>{' '}
              and it lands here and stays after a reload.
            </p>
          ) : (
            <ul className="arc-grid arc-grid--pair">
              {favouriteGames.map((g, i) => (
                <li key={g.id} className="arc-shelf">
                  <GameCard
                    game={g} variant="grid" index={i}
                    favourite
                    onToggleFavourite={onToggleFavourite} onOpen={onOpen}
                  />
                  <HoursControl
                    hours={playtime[g.id] ?? 0}
                    onAdd={(h) => onAddPlaytime(g.id, h)}
                    label={`${g.title} favourite`}
                  />
                </li>
              ))}
            </ul>
          )}

          <p className="arc-meta">
            Favourites are saved on the account · hours logged on this device
          </p>
        </section>
      </div>
    </main>
  );
}
