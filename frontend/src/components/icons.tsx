/* One icon family for the whole redesign: 24x24, 1.6 stroke, square caps.
   Size is always set at the call site with Tailwind (w-5 h-5 …) so the glyphs
   never inherit sizing from a parent selector. */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { filled?: boolean };

function Icon({ filled, children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="square"
      strokeLinejoin="miter"
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

export const UsersIcon = (p: IconProps) => (
  <Icon {...p}><path d="M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M3 19.5h12l-.7-3.4a2.2 2.2 0 0 0-2.1-1.6H5.8a2.2 2.2 0 0 0-2.1 1.6Z" /><path d="M16 5.2a3.2 3.2 0 0 1 0 6.6M17.6 14.6a2.4 2.4 0 0 1 2.2 1.8l.7 3.1h-4.2" /></Icon>
);
