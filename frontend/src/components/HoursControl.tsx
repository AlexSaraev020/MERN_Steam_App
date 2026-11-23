import { ClockIcon } from './icons';
import { formatHours } from '../data/games';

type Props = {
  hours: number;
  onAdd: (hours: number) => void;
  /** Names the title the hours belong to, for screen readers. */
  label: string;
};

/* Two buttons that do the whole job: the total is what you read, +1 h / +5 h is
   what you press. The earlier version asked you to type a number and then submit
   it, which reads like a form field sitting on a shelf. */
export default function HoursControl({ hours, onAdd, label }: Props) {
  return (
    <div className="arc-hours">
      <p className="arc-hours-total" role="status">
        <ClockIcon className="arc-icon arc-icon--sm" />
        <span className="arc-num arc-num-lg arc-num--warm">{formatHours(hours)}</span>
        <span className="arc-unit">h logged</span>
      </p>
      <div className="arc-hours-add">
        {[1, 5].map((h) => (
          <button
            key={h}
            type="button"
            className="arc-btn"
            onClick={() => onAdd(h)}
            aria-label={`Log ${h} more ${h === 1 ? 'hour' : 'hours'} for ${label}`}
          >
            +{h} h
          </button>
        ))}
      </div>
    </div>
  );
}
