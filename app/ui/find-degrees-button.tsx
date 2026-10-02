'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Button component that navigates to results page with selected actors
// Constructs URL parameters from current search state
export default function FindDegreesButton() {
  const searchParams = useSearchParams();
  const actor1 = searchParams.get('actor1') || '';
  const actor2 = searchParams.get('actor2') || '';
  
  // Build query string for results page URL
  const params = new URLSearchParams();
  if (actor1) params.set('actor1', actor1);
  if (actor2) params.set('actor2', actor2);
  const queryString = params.toString();

  return (
    <Link
      className="button-glow flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 bg-[#dae9f7] border-2 border-[#c5d0e0]
            transition-colors hover:bg-[#e8f0fa] hover:border-2 hover:border-white hover:shadow-[0_0_20px_white] dark:hover:bg-[#ccc] md:w-[180px] whitespace-nowrap font-bold"
      href={`/results${queryString ? `?${queryString}` : ''}`}
      rel="noopener noreferrer"
    >
      Find Degrees
    </Link>
  );
}
