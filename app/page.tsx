import Search from '@/app/ui/search';
import FindDegreesButton from '@/app/ui/find-degrees-button';
import { Suspense } from 'react';

// Main home page - allows users to search for two actors and find their degrees of separation
export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ actor1?: string; actor2?: string }>;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16">
        
        {/* Search section with two actor search inputs */}
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-20 w-full mb-8 items-center sm:items-stretch">
            {/* Search Actor 1 */}
            <div className="flex-1 w-[95%] sm:w-auto mx-auto sm:mx-0">
              <label htmlFor="actor1" className="mb-2 block text-sm font-bold text-center sm:text-left">
                Choose Actor 1
              </label>
              <div className="relative">
                <Search
                  placeholder="Search an actor by name"
                  queryKey="actor1"
                />
              </div>
            </div>

            {/* Search Actor 2 */}
            <div className="flex-1 w-[95%] sm:w-auto mx-auto sm:mx-0">
              <label htmlFor="actor2" className="mb-2 block text-sm font-bold text-center sm:text-left">
                Choose Actor 2
              </label>
              <div className="relative">
                <Search
                  placeholder="Search an actor by name"
                  queryKey="actor2"
                />
              </div>
            </div>
          
          </div>
        </Suspense>
        
        {/* Button to trigger the degrees of separation search */}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Suspense fallback={<div>Loading...</div>}>
            <FindDegreesButton />
          </Suspense>
        </div>
        
      </main>
    </div>
  );
}
