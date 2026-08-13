import Link from "next/link";
import Search from '@/app/ui/search';

export default async function Home() {

  const getActors = async () => {
    const res = await fetch('https://dummyjson.com/products');
    return res.json();
  }

  const data = await getActors();
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16">
        
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
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center gap-20 rounded-full px-5 bg-[#3B1299] transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="/results"
            rel="noopener noreferrer"
          >
            Find Degrees
          </Link>
        </div>
        
      </main>
    </div>
  );
}
