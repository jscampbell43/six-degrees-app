// scripts/seed.ts
import { readQuery } from '@/app/lib/neo4j';
import * as dotenv from 'dotenv';
import path from 'path';

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
  console.log('🌱 Starting graph database seeding...');

  try {
    // 1. Optional: Clear existing nodes and relationships (Skip in production!)
    console.log('🧹 Clearing existing graph data...');
    await readQuery('MATCH (n) DETACH DELETE n');
    console.log('Sample Data Input');
    // 2. Seed Data from The Movie DataBase API
    // Current step figure out how to get IDs for this search combined credits 

    const url1 = `https://api.themoviedb.org/3/person/${person_id}/combined_credits`;
    const url2 = `https://api.themoviedb.org/3/person/${person_id}/combined_credits`;
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

    const actors = [
      { id: 'u1', name: 'Alice' },
      { id: 'u2', name: 'Bob' },
    ];

    const movies = [
      { id: 'p1', title: 'Graph Databases in Next.js' },
    ];

    const relationships = [
      { userId: 'u1', postId: 'p1', type: 'AUTHORED' },
      { userId: 'u2', postId: 'p1', type: 'LIKED' },
    ];

    console.log('END of Sample Data Input 1');
    // 3. Batch Create Nodes using UNWIND for high performance
    console.log('📦 Creating User and Post nodes...');
    await readQuery(`
      UNWIND $users AS user
      MERGE (u:User {id: user.id, name: user.name})
    `, { actors });

    await readQuery(`
      UNWIND $posts AS post
      MERGE (p:Post {id: post.id, title: post.title})
    `, { movies });

    // 4. Batch Create Relationships
    console.log('🔗 Connecting graph entities...');
    await readQuery(`
      UNWIND $rels AS rel
      MATCH (u:User {id: rel.userId})
      MATCH (p:Post {id: rel.postId})
      CALL apoc.do.when(
        rel.type = 'AUTHORED',
        'MERGE (u)-[:AUTHORED]->(p) RETURN u',
        'MERGE (u)-[:LIKED]->(p) RETURN u',
        {u:u, p:p}
      ) YIELD value
      RETURN count(*)
    `, { rels: relationships });

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedGraph();