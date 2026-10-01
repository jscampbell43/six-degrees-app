import Link from "next/link";
import { readQuery } from '@/app/lib/neo4j';
import path from "path";
import React from "react";
import ResultsDisplay from './results-display';

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
  
  // Serialize the Neo4j path to plain objects for client component
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
        <ResultsDisplay neo4jPath={serializedPath} />
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