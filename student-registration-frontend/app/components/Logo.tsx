import Image from 'next/image';

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="Logo" width={size} height={size} priority />
      <span className="font-bold text-lg tracking-wide text-indigo-700 select-none">RegSys</span>
    </div>
  );
}
