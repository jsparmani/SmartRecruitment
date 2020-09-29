const graphql = require("graphql");

const {GraphQLSchema, GraphQLObjectType} = graphql;

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {},
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
