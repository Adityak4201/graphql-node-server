const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const connectMongoDB = require("./db/mongo");
const schema = require("./schema/schema");

require("dotenv").config();

const main = () => {
  const app = express();
  const PORT = process.env.PORT || 4000;
  connectMongoDB();
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  );

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

main();
