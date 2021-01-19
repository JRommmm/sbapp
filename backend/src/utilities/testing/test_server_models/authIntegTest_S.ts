const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { execute, toPromise } = require('apollo-link');

export const startTestServer = async server => {
    // if using apollo-server-express...
    // const app = express();
    // server.applyMiddleware({ app });
    // const httpServer = await app.listen(0);
    //console.log(server);
  
    const httpServer = await server.listen({ port: 0 });
  
    const link = new HttpLink({
      uri: `http://localhost:${httpServer.port}`,
      fetch,
    });
  
    const executeOperation = ({ query, variables = {} }) =>
      execute(link, { query, variables });
  
    return {
      link,
      stop: () => httpServer.server.close(),
      graphql: executeOperation,
    };
  };
  
  module.exports.startTestServer = startTestServer;