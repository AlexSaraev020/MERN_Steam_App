/* One icon family for the storefront: 24x24 grid, 1.7 stroke, rounded joins.
   Size always comes from the class on the glyph (.arc-icon, --sm, --lg) so a
   glyph never inherits geometry from a parent selector. */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { filled?: boolean };

function Icon({ filled, children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable={false}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const HeartIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 20.5 4.8 13.4a4.4 4.4 0 1 1 6.2-6.2l1 1 1-1a4.4 4.4 0 1 1 6.2 6.2Z" /></Icon>
);

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}><path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" /><path d="m15.4 15.4 4.1 4.1" /></Icon>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Icon {...p}><path d="M14.5 5 8 12l6.5 7" /></Icon>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}><path d="M9.5 5 16 12l-6.5 7" /></Icon>
);

export const GridIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></Icon>
);

export const RowsIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 5h16M4 12h16M4 19h16" /></Icon>
);

export const SlidersIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 8h11M19 8h1M4 16h4M12 16h8" /><path d="M17 5v6M7 13v6" /></Icon>
);

export const GamepadIcon = (p: IconProps) => (
  <Icon {...p}><path d="M7 8h10a4 4 0 0 1 4 4l-1 6a2.5 2.5 0 0 1-4.3 1.3L14 18h-4l-1.7 1.3A2.5 2.5 0 0 1 4 18l-1-6a4 4 0 0 1 4-4Z" /><path d="M8 12v3M6.5 13.5h3M15.5 13h.01M18 15.5h.01" /></Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M4.5 20.5h15l-.9-4.2a2.6 2.6 0 0 0-2.5-2H7.9a2.6 2.6 0 0 0-2.5 2Z" /></Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}><path d="m6 6 12 12M18 6 6 18" /></Icon>
);

export const PlayIcon = (p: IconProps) => (
  <Icon {...p}><path d="M8 5.5 18.5 12 8 18.5Z" /></Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}><path d="m5 12.5 4.5 4.5L19 7" /></Icon>
);

/* Eight teeth on a ring, plus the axle hole. The earlier version was a circle
   with eight free spokes and read as a sun. */
export const CogIcon = (p: IconProps) => (
  <Icon {...p}><path d="M9.99 4.98L10.15 2.48A9.7 9.7 0 0 1 13.85 2.48L14.01 4.98A7.3 7.3 0 0 1 15.54 5.62L17.42 3.96A9.7 9.7 0 0 1 20.04 6.58L18.38 8.46A7.3 7.3 0 0 1 19.02 9.99L21.52 10.15A9.7 9.7 0 0 1 21.52 13.85L19.02 14.01A7.3 7.3 0 0 1 18.38 15.54L20.04 17.42A9.7 9.7 0 0 1 17.42 20.04L15.54 18.38A7.3 7.3 0 0 1 14.01 19.02L13.85 21.52A9.7 9.7 0 0 1 10.15 21.52L9.99 19.02A7.3 7.3 0 0 1 8.46 18.38L6.58 20.04A9.7 9.7 0 0 1 3.96 17.42L5.62 15.54A7.3 7.3 0 0 1 4.98 14.01L2.48 13.85A9.7 9.7 0 0 1 2.48 10.15L4.98 9.99A7.3 7.3 0 0 1 5.62 8.46L3.96 6.58A9.7 9.7 0 0 1 6.58 3.96L8.46 5.62Z" /><path d="M12 8.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z" /></Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z" /><path d="M12 7.6V12l3.5 2.2" /></Icon>
);

export const UsersIcon = (p: IconProps) => (
  <Icon {...p}><path d="M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M3 19.5h12l-.7-3.4a2.2 2.2 0 0 0-2.1-1.6H5.8a2.2 2.2 0 0 0-2.1 1.6Z" /><path d="M16 5.2a3.2 3.2 0 0 1 0 6.6M17.6 14.6a2.4 2.4 0 0 1 2.2 1.8l.7 3.1h-4.2" /></Icon>
);
