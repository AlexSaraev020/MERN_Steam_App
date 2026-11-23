import { SORTS, type Genre, type SortKey } from '../data/games';

/* No price filter: every title the catalogue serves is free to play. */
export type Filters = { genre: Genre | null; sort: SortKey };
export const DEFAULT_FILTERS: Filters = { genre: null, sort: 'new' };

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
  /** genreFacets(games): only the genres this catalogue really carries. */
  genres: Genre[];
  /** Unique prefix so Home and Search game never share control IDs. */
  idPrefix: string;
};

/* Shared by Home and Search game so both filter bars behave identically. */
export default function FilterBar({ value, onChange, genres, idPrefix }: Props) {
  const active = value.genre !== null;

  return (
    <div className="arc-filter">
      <div className="arc-rail arc-rail--chips" role="group" aria-label="Genre filter">
        <button type="button" className="arc-chip" aria-pressed={value.genre === null} onClick={() => onChange({ ...value, genre: null })}>
          All genres
        </button>
        {genres.map((g) => (
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

      <div className="arc-filter-tail">
        <label className="arc-label" htmlFor={`${idPrefix}-sort`}>Sort</label>
        <select
          id={`${idPrefix}-sort`}
          className="arc-field arc-field--select"
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
  );
}
