import { FaUniversity } from 'react-icons/fa';

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <FaUniversity size={size} color="black" data-testid="logo-icon" />
      <span className="font-bold text-lg tracking-wide  select-none"></span>
    </div>
  );
}
