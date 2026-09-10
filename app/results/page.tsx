import Link from "next/link";
import { readQuery } from '@/app/lib/neo4j';
import path from "path";

export default async function Results({
  searchParams,
}: {
  searchParams: Promise<{ actor1?: string; actor2?: string }>;
}) {
  const params = await searchParams;
  const actor1 = params?.actor1 ? decodeURIComponent(params.actor1) : '';
  const actor2 = params?.actor2 ? decodeURIComponent(params.actor2) : '';

  const values = await readQuery(`
      MATCH (src:Actor {name: "${actor1}"}), (dst:Actor {name: "${actor2}"})
      MATCH p = shortestPath((src)-[:ACTED_IN*..10]-(dst))
      RETURN p
    `, { actor1, actor2 });
  
  // Log detailed path information
  const neo4jPath = values && values.length > 0 ? values[0].p as any : null;
  if (neo4jPath) {
    console.log("Path found:", neo4jPath);
    console.log("Path length:", neo4jPath.length);

    if (neo4jPath.segments) {
      console.log("Path segments:");
      neo4jPath.segments.forEach((segment: any, index: number) => {
        console.log(`Segment ${index}:`);
        console.log(`  Start: ${segment.start.labels[0]} - ${segment.start.properties.name || segment.start.properties.title}`);
        console.log(`  End: ${segment.end.labels[0]} - ${segment.end.properties.name || segment.end.properties.title}`);
        console.log(`  Relationship: ${segment.relationship.type}`);
      });
    }
  } else {
    console.log("No path found between actors");
  }
  
    return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 border-2 border-red-500">
        <div className="flex gap-20 w-full mb-8 border-2 border-blue-500">
          <div className="flex-1 text-left border-2 border-green-500 p-4">
            {neo4jPath?.segments?.map((segment: any, index: number) => (
              <div key={index} className="mb-4">
                <h1>Segment {index}:</h1>
                <p>Start: {segment.start.labels[0]} - {segment.start.properties.name || segment.start.properties.title}</p>
                <p>End: {segment.end.labels[0]} - {segment.end.properties.name || segment.end.properties.title}</p>
                <p>Relationship: {segment.relationship.type}</p>
              </div>
            ))}
          </div>
          <div className="flex-1 text-left border-2 border-yellow-500 p-4">
            <h1>
              {actor2 || 'No actor selected'}
            </h1>
            {/* <ul>
              {credits2.cast?.slice(0, 5).map((item: any, index: number) => (
                <li key={index}>{item.title || 'No title'}</li>
              )) || <li>No data found</li>}
            </ul> */}
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