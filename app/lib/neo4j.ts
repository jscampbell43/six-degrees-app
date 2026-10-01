var neo4j = require('neo4j-driver')

let driver: any = null;

// Singleton pattern - maintains one Neo4j driver instance across the app
// More efficient than creating new connections for each query
export function getDriver(){
  try {
    // Create driver only if it doesn't exist
    if (!driver) {
      const uri = process.env.NEO4J_URI;
      const username = process.env.NEO4J_USERNAME;
      const password = process.env.NEO4J_PASSWORD;

      if (!uri || !username || !password) {
        throw new Error('Missing required environment variables');
      }

      // Create Neo4j driver instance with credentials from environment variables
      driver = neo4j.driver(
      uri, 
      neo4j.auth.basic(username, password)
      );
    }
    return driver;
  } catch(err) {
    if (err instanceof Error) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    } else {
      console.log(`Connection error\n${err}`)
    }
    return
  }
}

// Executes read-only Cypher queries against the Neo4j database
// Uses the singleton driver pattern for efficient connection management
export async function readQuery(cypher: string, params = {}){
    // Get the singleton driver instance
    let driver = getDriver();
    
    if (!driver) {
      throw new Error('Failed to establish Neo4j driver connection');
    }
    
    // Open a Neo4j session for this query
    const session = driver.session();

    try{
      // Execute the Cypher query with provided parameters
      const res = await session.run(cypher, params);
      // Convert Neo4j records to plain JavaScript objects
      const values = res.records.map((record: any) => record.toObject())

      return values;
    }
    finally{
      // Always close the session to prevent connection leaks
      await session.close();
    }
}
