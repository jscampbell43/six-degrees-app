import Link from "next/link";

export default async function Results({
  searchParams,
}: {
  searchParams: Promise<{ actor1?: string; actor2?: string }>;
}) {
  const params = await searchParams;
  const actor1 = params?.actor1 ? decodeURIComponent(params.actor1) : '';
  const actor2 = params?.actor2 ? decodeURIComponent(params.actor2) : '';

    return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16">
        <div>
          <h1>
            ACTOR 1: {actor1 || 'No actor selected'}
          </h1>
        </div>
        <div>
          <h1>
            ACTOR 2: {actor2 || 'No actor selected'}
          </h1>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 bg-[#3B1299] transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="/"
            rel="noopener noreferrer"
          >
            New Match
          </Link>
        </div>
      </main>
    </div>
  );
}