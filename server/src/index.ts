import { ResponseResolver } from './resolvers/response';
import 'reflect-metadata';
import { JobResolver } from './resolvers/job';
import { __prod__ } from './constants';
import { CompanyResolver } from './resolvers/company';
import { ProfileResolver } from './resolvers/profile';
import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';
import { createConnection } from 'typeorm';

(async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        ProfileResolver,
        CompanyResolver,
        JobResolver,
        ResponseResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  const conn = await createConnection();

  await conn.runMigrations();

  apolloServer.applyMiddleware({ app });

  const port: any = process.env.PORT;
  app.listen(port, () => {
    console.log(`Express server started on ${port}`);
  });
})();
