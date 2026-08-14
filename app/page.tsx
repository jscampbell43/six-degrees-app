import Search from '@/app/ui/search';
import FindDegreesButton from '@/app/ui/find-degrees-button';
import { Suspense } from 'react';

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ actor1?: string; actor2?: string }>;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16">
        
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex gap-20 w-full mb-8">
            {/* Search Actor 1 */}
            <div className="flex-1">
              <label htmlFor="actor1" className="mb-2 block text-sm font-medium">
                Choose Actor 1
              </label>
              <div className="relative">
                <Search
                  placeholder = "Search an actor by name"
                  queryKey = "actor1"
                />
              </div>
            </div>

            {/* Search Actor 2 */}
            <div className="flex-1">
              <label htmlFor="actor2" className="mb-2 block text-sm font-medium">
                Choose Actor 2
              </label>
              <div className="relative">
                <Search
                  placeholder = "Search an actor by name"
                  queryKey = "actor2"
                />
              </div>
            </div>
          
          </div>
        </Suspense>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Suspense fallback={<div>Loading...</div>}>
            <FindDegreesButton />
          </Suspense>
        </div>
        
      </main>
    </div>
  );
}
