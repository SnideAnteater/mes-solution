require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const sequelize = require("./db");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const seedDatabase = require("./seed");

async function startServer() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, async () => {
    console.log(
      "Server is running at http://localhost:4000" + server.graphqlPath
    );
    try {
      await sequelize.authenticate();
      console.log("Database connected!");
      await sequelize.sync();
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  });
}

startServer();
seedDatabase();
