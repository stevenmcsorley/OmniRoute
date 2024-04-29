const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const express = require('express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const typeDefs = require('./schema');
const { resolvers } = require('./resolvers');

(async () => {
  const app = express();
  const httpServer = createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      },
    }],
  });

  await server.start();
  server.applyMiddleware({ app });

  const subscriptionServer = SubscriptionServer.create({
    execute,
    subscribe,
    schema: server.schema,
  }, {
    server: httpServer,
    path: server.graphqlPath,
  });

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}${server.graphqlPath}`)
  );
})();
