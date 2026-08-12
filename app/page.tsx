import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16">
        <div className="flex gap-4 w-full">
          {/* Select Actor 1 */}
          <div className="flex-1">
            <label htmlFor="actor1" className="mb-2 block text-sm font-medium">
              Choose Actor
            </label>
            <div className="relative">
              <select
                id="actor1"
                name="actor1"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue="Kevin Bacon"
              >
                <option value="" disabled>
                  Select Actor
                </option>
                <option>
                  George Clooney
                </option>
              </select>
            </div>
          </div>

          {/* Select Actor 2 */}
          <div className="flex-1">
            <label htmlFor="actor2" className="mb-2 block text-sm font-medium">
              Choose Actor
            </label>
            <div className="relative">
              <select
                id="actor2"
                name="actor2"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue="Kevin Bacon"
              >
                <option value="" disabled>
                  Select Actor
                </option>
                <option>
                  George Clooney
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 bg-[#3B1299] transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
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
