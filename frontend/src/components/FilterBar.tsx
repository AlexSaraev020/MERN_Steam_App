import { GENRES, PRICE_BANDS, SORTS, type Genre, type PriceBand, type SortKey } from '../data/games';

export type Filters = { genre: Genre | null; band: PriceBand; sort: SortKey };
export const DEFAULT_FILTERS: Filters = { genre: null, band: 'all', sort: 'score' };

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
  /** Unique prefix so Home and All games never share control IDs. */
  idPrefix: string;
};

/* Shared by Home and All games so both filter bars behave identically. */
export default function FilterBar({ value, onChange, idPrefix }: Props) {
  const active = value.genre !== null || value.band !== 'all';

  return (
    <div className="flex flex-col gap-[var(--g-s4)]">
      <div className="arc-rail" role="group" aria-label="Genre filter">
        <button type="button" className="arc-chip" aria-pressed={value.genre === null} onClick={() => onChange({ ...value, genre: null })}>
          All genres
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            type="button"
            className="arc-chip"
            aria-pressed={value.genre === g}
            onClick={() => onChange({ ...value, genre: value.genre === g ? null : g })}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-[var(--g-s4)] justify-between">
        <div className="arc-rail flex-1 min-w-0" role="group" aria-label="Price filter">
          {PRICE_BANDS.map((b) => (
            <button
              key={b.key}
              type="button"
              className="arc-chip"
              aria-pressed={value.band === b.key}
              onClick={() => onChange({ ...value, band: b.key })}
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-[var(--g-s3)]">
          <label className="arc-label" htmlFor={`${idPrefix}-sort`}>Sort</label>
          <select
            id={`${idPrefix}-sort`}
            className="arc-field !min-h-[44px] !py-[10px] !text-[15px] w-[190px]"
            value={value.sort}
            onChange={(e) => onChange({ ...value, sort: e.target.value as SortKey })}
          >
            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <button type="button" className="arc-btn" disabled={!active} onClick={() => onChange({ ...DEFAULT_FILTERS, sort: value.sort })}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
