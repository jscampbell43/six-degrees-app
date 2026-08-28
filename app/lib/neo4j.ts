var neo4j = require('neo4j-driver')

let driver: any = null;

// Singleton pattern with one Driver maintained and shared across the app
export function getDriver(){
  try {
    if (!driver) {
      const uri = process.env.NEO4J_URI;
      const username = process.env.NEO4J_USERNAME;
      const password = process.env.NEO4J_PASSWORD;

      if (!uri || !username || !password) {
        throw new Error('Missing required environment variables');
      }

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

export async function readQuery(cypher: string, params = {}){
    // Use GetDriver to get singleton driver 
    console.log("Entering Read Query function")
    let driver = getDriver();
    
    if (!driver) {
      throw new Error('Failed to establish Neo4j driver connection');
    }
    
    // Open a session
    const session = driver.session();

    try{
      // Execute cypher statement
      const res = await session.run(cypher, params);
      // Process Results
      const values = res.records.map((record: any) => record.toObject())

      console.log(values)
      return values;
    }
    finally{
      // Close Session
      await session.close();
    }
}
