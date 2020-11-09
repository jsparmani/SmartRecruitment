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
import { verify } from 'jsonwebtoken';
import { User } from './entity/User';
import { createAccessToken } from './utils/auth';

(async () => {
  const app = express();

  app.post('/refresh_token', async (req, res) => {
    const token = req.headers.refreshtoken as string;
    console.log(token);
    if (!token) {
      return res.send({ ok: false, accessToken: '' });
    }
    let payload: any;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: '' });
    }

    let user = await User.findOne(payload.userId);

    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' });
    }

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

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
