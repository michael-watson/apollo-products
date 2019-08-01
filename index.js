const { gql, ApolloServer } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

// sample data
const products = [
  { upc: "1", sku: "TABLE1", name: "Table", price: 899 },
  { upc: "2", sku: "COUCH1", name: "Couch", price: 1299 },
  { upc: "3", sku: "CHAIR1", name: "Chair", price: 54 }
];

const typeDefs = gql`
  extend type Query {
    topProducts(first: Int): [Product]
  }

  type Product @key(fields: "upc") {
    upc: String!
    sku: String!
    name: String
    price: String
  }
`;

const resolvers = {
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    }
  },
  Product: {
    __resolveReference(object) {
      return products.find(
        product => product.upc === object.upc || product.sku === object.sku
      );
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  engine: true
});


const port = process.env.PORT || 4003

server.listen({ port }).then(({ url }) => {
  console.log(`Apollo Server is now running at ${url}`);
});
