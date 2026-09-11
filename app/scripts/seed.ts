// scripts/seed.ts
import { readQuery } from '@/app/lib/neo4j';
import * as dotenv from 'dotenv';
import path from 'path';
import {TMDBActorDetails, TMDBMovieCredits, TMDBTVCredits, TMDBPopularActors} from '@/app/types/actor';
// Load environment variables from Next.js defaults
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.NEO4J_URI;
const username = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !username || !password) {
  console.error("Missing Neo4j environment variables.");
  process.exit(1);
}

async function getActorMoviesAndTVShows(actorId: Number): Promise<[any, any[]]>{
  console.log('Starting Actor Movie And TVShow Search')
    // Current step Make function to automate this process, run it on list of actor ids possibly also collected from API 
    const url_1 = `https://api.themoviedb.org/3/person/${actorId}`;
    const url1 = `https://api.themoviedb.org/3/person/${actorId}/movie_credits`;
    const url2 = `https://api.themoviedb.org/3/person/${actorId}/tv_credits`;
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
    //console.log('Actor 1 Movie data:', data1.cast.map(item => item.id));
    //console.log('Actor 1 TV data:', data2.cast.map(item => item.name));
    //console.log('Actor 2 data:', data2);

    const actor = { id: data_1.id, name: data_1.name };

    let movies = data1.cast.map(item => ({
      id: item.id,
      title: item.title
    }));

    movies = movies.concat(data2.cast.map(item => ({
      // Multiply ID by 100 to account for a Movie ID being identical to a TV ID
      id: (item.id*100),
      title: item.name
    })));

    return [actor, movies];
}


async function seedGraph(pageNumber: Number) {
  console.log('🌱 Starting graph database seeding...', new Date().toISOString());

  try {
    // 1. Optional: Clear existing nodes and relationships (Skip in production!)
    // console.log('🧹 Clearing existing graph data...');
    // await readQuery('MATCH (n) DETACH DELETE n');
    console.log('Sample Data Input');
    // 2. Seed Data from The Movie DataBase API
    // Current step Make function to automate this process, run it on list of actor ids possibly also collected from API
    // List of Actor IDs
    const url_pop = `https://api.themoviedb.org/3/person/popular?page=${pageNumber}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MjZkZjJkZjQyZWU4YTc4N2ZmNjc3MDJkNTc5MmI3MCIsIm5iZiI6MTc4NjY1NDc2Ny40ODE5OTk5LCJzdWIiOiI2YTdlMzAyZjYwMDY0MmYxYTUzZGEyMzMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Eqt0uU3rEbtQvOqROJri2sgmjhiGdmV_I9t_Lhnp-HE'
        }
    };
    const [res_pop] = await Promise.all([
        fetch(url_pop, options)
    ]);
    const [data_pop] = await Promise.all([
        res_pop.json() as Promise<TMDBPopularActors>
    ]);

    //console.log('Actor 1 Full Response:', JSON.stringify(data_1, null, 2));
    //console.log('Actor 1 Info:', data_pop.results.map(item => item.id));



  //   const ActorMovieTuple = await getActorMoviesAndTVShows(4724);
  //   //1461
  //   const ActorMovieTuple2 = await getActorMoviesAndTVShows(1461);
  const ActorsAndMovies = await Promise.all(
    data_pop.results.map(item => getActorMoviesAndTVShows(item.id))
  ); // List of tuples: [[actor, movies[]]]
  
  // console.log('ActorsAndMovies', ActorsAndMovies.map(([actor, movies])=> 
  //       movies.map(movie => ({
  //         movieTitle:movie.title,
  //         actorName: actor.name
  //       }))
  //     ));
    // relationships is a list of lists, where each inner list contains all relationships for one actor
    const relationships = ActorsAndMovies.map(([actor, movies]) => 
      movies.map(movie => ({
        movieId: movie.id,
        actorId: actor.id,
        type: 'ACTED_IN'
      }))
    );
    
    //console.log('ACTORS', ActorsAndMovies);
    //console.log('RELATIONSHIPS', relationships);

    console.log('END of Sample Data Input 1');
    // 3. Batch Create Nodes using UNWIND for high performance
    console.log('📦 Creating Actor and Movie nodes...');
    
    // Extract all actors from the tuples
    const allActors = ActorsAndMovies.map(([actor]) => actor);
    await readQuery(`
      UNWIND $actors AS actor
      MERGE (a:Actor {id: actor.id})
      SET a.name = actor.name
    `, { actors: allActors });

    // Extract all movies from the tuples (flatten)
    const allMovies = ActorsAndMovies.flatMap(([, movies]) => movies);
    await readQuery(`
      UNWIND $movies AS movie
      MERGE (m:Movie {id: movie.id})
      SET m.title = movie.title
    `, { movies: allMovies });

    // 4. Batch Create Relationships
    console.log('🔗 Connecting graph entities...');
    // Flatten the relationships (list of lists -> single list)
    const allRelationships = relationships.flat();
    await readQuery(`
      UNWIND $rels AS rel
      MATCH (a:Actor {id: rel.actorId})
      MATCH (m:Movie {id: rel.movieId})
      MERGE (a)-[:ACTED_IN]->(m)
      RETURN count(*)
    `, { rels: allRelationships });

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// helper function to delay between each call to the API to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function multipleSeed(){
  console.log("MULTIPLE LOOP SEEDING")
  for (let i = 12; i < 14; i++) {
    console.log("Loop", i);
    seedGraph(i);
    await delay(20000); // 10 second delay between loops
  }
}

multipleSeed();
