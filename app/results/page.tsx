import Link from "next/link";
import '@/app/lib/neo4j';

export default async function Results({
  searchParams,
}: {
  searchParams: Promise<{ actor1?: string; actor2?: string }>;
}) {
  const params = await searchParams;
  const actor1 = params?.actor1 ? decodeURIComponent(params.actor1) : '';
  const actor2 = params?.actor2 ? decodeURIComponent(params.actor2) : '';

  const url1 = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(actor1)}&include_adult=false&language=en-US&page=1`;
  const url2 = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(actor2)}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MjZkZjJkZjQyZWU4YTc4N2ZmNjc3MDJkNTc5MmI3MCIsIm5iZiI6MTc4NjY1NDc2Ny40ODE5OTk5LCJzdWIiOiI2YTdlMzAyZjYwMDY0MmYxYTUzZGEyMzMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Eqt0uU3rEbtQvOqROJri2sgmjhiGdmV_I9t_Lhnp-HE'
    }
  };

  const [res1, res2] = await Promise.all([
    fetch(url1, options),
    fetch(url2, options)
  ]);
  const [data1, data2] = await Promise.all([
    res1.json(),
    res2.json()
  ]);

  console.log('Actor 1 data:', data1);
  console.log('Actor 2 data:', data2);

  // Extract actor IDs from the search results
  const actor1Id = data1.results?.[0]?.id;
  const actor2Id = data2.results?.[0]?.id;

  // Fetch combined credits for both actors using their IDs
  const creditsUrl1 = `https://api.themoviedb.org/3/person/${actor1Id}/combined_credits?language=en-US`;
  const creditsUrl2 = `https://api.themoviedb.org/3/person/${actor2Id}/combined_credits?language=en-US`;

  const [creditsRes1, creditsRes2] = await Promise.all([
    fetch(creditsUrl1, options),
    fetch(creditsUrl2, options)
  ]);
  const [credits1, credits2] = await Promise.all([
    creditsRes1.json(),
    creditsRes2.json()
  ]);

  console.log('Actor 1 credits:', credits1);
  console.log('Actor 2 credits:', credits2);

    return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 border-2 border-red-500">
        <div className="flex gap-20 w-full mb-8 border-2 border-blue-500">
          <div className="flex-1 text-left border-2 border-green-500 p-4">
            <h1>
              {actor1 || 'No actor selected'}
            </h1>
            <ul>
              {credits1.cast?.slice(0, 5).map((item: any, index: number) => (
                <li key={index}>{item.title || 'No title'}</li>
              )) || <li>No data found</li>}
            </ul>
          </div>
          <div className="flex-1 text-left border-2 border-yellow-500 p-4">
            <h1>
              {actor2 || 'No actor selected'}
            </h1>
            <ul>
              {credits2.cast?.slice(0, 5).map((item: any, index: number) => (
                <li key={index}>{item.title || 'No title'}</li>
              )) || <li>No data found</li>}
            </ul>
          </div>
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