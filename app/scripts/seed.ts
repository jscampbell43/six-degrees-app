// scripts/seed.ts
import { readQuery } from '@/app/lib/neo4j';
import * as dotenv from 'dotenv';
import path from 'path';
import {TMDBActorDetails, TMDBMovieCredits, TMDBTVCredits} from '@/app/types/actor';
// Load environment variables from Next.js defaults
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.NEO4J_URI;
const username = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !username || !password) {
  console.error("Missing Neo4j environment variables.");
  process.exit(1);
}


async function seedGraph() {
  console.log('🌱 Starting graph database seeding...', new Date().toISOString());

  try {
    // 1. Optional: Clear existing nodes and relationships (Skip in production!)
    console.log('🧹 Clearing existing graph data...');
    await readQuery('MATCH (n) DETACH DELETE n');
    console.log('Sample Data Input');
    // 2. Seed Data from The Movie DataBase API
    // Current step figure out how to get IDs for this search combined credits 
    const url_1 = `https://api.themoviedb.org/3/person/${4724}`;
    const url1 = `https://api.themoviedb.org/3/person/${4724}/movie_credits`;
    const url2 = `https://api.themoviedb.org/3/person/${4724}/tv_credits`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MjZkZjJkZjQyZWU4YTc4N2ZmNjc3MDJkNTc5MmI3MCIsIm5iZiI6MTc4NjY1NDc2Ny40ODE5OTk5LCJzdWIiOiI2YTdlMzAyZjYwMDY0MmYxYTUzZGEyMzMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Eqt0uU3rEbtQvOqROJri2sgmjhiGdmV_I9t_Lhnp-HE'
        }
    };

    const [res_1, res1, res2] = await Promise.all([
        fetch(url_1, options),
        fetch(url1, options),
        fetch(url2, options)
    ]);
    const [data_1, data1, data2] = await Promise.all([
        res_1.json() as Promise<TMDBActorDetails>,
        res1.json() as Promise<TMDBMovieCredits>,
        res2.json() as Promise<TMDBTVCredits>
    ]);

    //console.log('Actor 1 Full Response:', JSON.stringify(data_1, null, 2));
    console.log('Actor 1 Info:', data_1.name);
    console.log('Actor 1 Movie data:', data1.cast.map(item => item.id));
    console.log('Actor 1 TV data:', data2.cast.map(item => item.id));
    //console.log('Actor 2 data:', data2);

    const actors = [
      { id: data_1.id, name: data_1.name },
      { id: 'u2', name: 'Bob' },
    ];

    const movies = data1.cast.map(item => ({
      id: item.id,
      title: item.title
    }));

    const relationships = movies.map(item =>({
      movieId: item.id, 
      actorId: actors[0].id, 
      type: 'ACTED_IN'
    }));

    console.log('ACTORS', actors);
    console.log('MOVIES', movies);
    console.log('RELATIONSHIPS', relationships);

    console.log('END of Sample Data Input 1');
    // 3. Batch Create Nodes using UNWIND for high performance
    console.log('📦 Creating Actor and Movie nodes...');
    await readQuery(`
      UNWIND $actors AS actor
      MERGE (a:Actor {id: actor.id, name: actor.name})
    `, { actors });

    await readQuery(`
      UNWIND $movies AS movie
      MERGE (m:Movie {id: movie.id, title: movie.title})
    `, { movies });

    // 4. Batch Create Relationships
    console.log('🔗 Connecting graph entities...');
    await readQuery(`
      UNWIND $rels AS rel
      MATCH (a:Actor {id: rel.actorId})
      MATCH (m:Movie {id: rel.movieId})
      MERGE (a)-[:ACTED_IN]->(m)
      RETURN count(*)
    `, { rels: relationships });

    // console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedGraph();