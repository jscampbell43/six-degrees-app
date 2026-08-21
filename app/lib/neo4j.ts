(async () => {
  var neo4j = require('neo4j-driver')

  let driver

  try {
    driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD))
    await driver.verifyConnectivity()
    console.log('Connection established')
  } catch(err) {
    if (err instanceof Error) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    } else {
      console.log(`Connection error\n${err}`)
    }
    await driver.close()
    return
  }

  // Use the driver to run queries

  await driver.close()
})();