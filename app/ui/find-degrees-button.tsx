'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function FindDegreesButton() {
  const searchParams = useSearchParams();
  const actor1 = searchParams.get('actor1') || '';
  const actor2 = searchParams.get('actor2') || '';
  
  const params = new URLSearchParams();
  if (actor1) params.set('actor1', actor1);
  if (actor2) params.set('actor2', actor2);
  const queryString = params.toString();

  return (
    <Link
      className="flex h-12 w-full items-center justify-center gap-20 rounded-full px-5 bg-[#3B1299] transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
      href={`/results${queryString ? `?${queryString}` : ''}`}
      rel="noopener noreferrer"
    >
      Find Degrees
    </Link>
  );
}
