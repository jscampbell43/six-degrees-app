import Link from "next/link";
import { readQuery } from '@/app/lib/neo4j';
import path from "path";
import React from "react";
import ResultsDisplay from './results-display';

// Results page - displays the degrees of separation path between two actors
export default async function Results({
  searchParams,
}: {
  searchParams: Promise<{ actor1?: string; actor2?: string }>;
}) {
  // Extract actor names from URL parameters
  const params = await searchParams;
  const actor1 = params?.actor1 ? decodeURIComponent(params.actor1) : '';
  const actor2 = params?.actor2 ? decodeURIComponent(params.actor2) : '';

  // Query Neo4j database to find shortest path between actors
  const values = await readQuery(`
      MATCH (src:Actor {name: "${actor1}"}), (dst:Actor {name: "${actor2}"})
      MATCH p = shortestPath((src)-[:ACTED_IN*..10]-(dst))
      RETURN p
    `, { actor1, actor2 });
  
  // Extract the path from Neo4j results
  const neo4jPath = values && values.length > 0 ? values[0].p as any : null;
  
  // Serialize Neo4j path to plain objects (required for passing to client components)
  // Neo4j returns complex class objects that can't be serialized for client components
  const serializedPath = neo4jPath ? {
    length: neo4jPath.length,
    segments: neo4jPath.segments?.map((segment: any) => ({
      start: {
        labels: segment.start.labels,
        properties: segment.start.properties
      },
      end: {
        labels: segment.end.labels,
        properties: segment.end.properties
      },
      relationship: {
        type: segment.relationship.type
      }
    }))
  } : null;
  
    return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32">
        {/* Display the animated path results */}
        <ResultsDisplay neo4jPath={serializedPath} />
        
        {/* Button to start a new search */}
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