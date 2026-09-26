import Link from "next/link";
import { readQuery } from '@/app/lib/neo4j';
import path from "path";
import React from "react";

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
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32">
        <div className="flex w-full mb-8 justify-center items-center">  
          {/* Show the first element (start of first segment, each segment has start and end, this pattern avoids duplicate names or title being shown) */}
          {neo4jPath?.segments?.[0] && (
            <div className="flex items-center justify-center text-center outline-2 border-2 rounded-md bg-[#5ba4f0] border-[#afc5db] p-4">
              <h1 className="font-bold">{neo4jPath.segments[0].start.properties.name}</h1>
            </div>
          )}
          {/* Map through segments and show "arrow" + end node for each */}
          {neo4jPath?.segments?.map((segment: any, index: number) => {
            return (
              <React.Fragment key={index}>
                {/*Arrow*/}
                <div className="flex items-center justify-center">
                  <div className="w-8 border-t-2 border-gray-600 transform"></div>
                </div>
                {/*Segment containing either an Actor name or Movie title*/}
                <div className={segment.end.properties.name?
                  "flex items-center justify-center text-center outline-2 border-2 rounded-md bg-[#5ba4f0] border-[#afc5db] p-4":
                  "flex items-center justify-center text-center outline-2 border-2 rounded-md bg-[#c5e0fa] border-[#afc5db] p-4"}>
                  <h1 className="font-bold">{segment.end.properties.name || segment.end.properties.title}</h1>
                </div>
              </React.Fragment>
            )
          })}
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 bg-[#c5e0fa] border-2 border-[#afc5db]
            transition-colors hover:bg-[#dae9f7] hover:border-2 hover:border-white hover:shadow-[0_0_10px_white] dark:hover:bg-[#ccc] md:w-[180px] whitespace-nowrap font-bold"
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