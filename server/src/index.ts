import {User} from "./entity/User";
import "dotenv/config";
import "reflect-metadata";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {UserResolver} from "./resolvers/user";
import {createConnection} from "typeorm";

(async () => {
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate: false,
        }),
        context: ({req, res}) => ({req, res}),
    });

    await createConnection({
        type: "postgres",
        database: "airecruitments",
        username: "test",
        password: "test",
        logging: true,
        synchronize: true,
        entities: [User],
    });

    apolloServer.applyMiddleware({app});

    const port: any = process.env.PORT;
    app.listen(port, () => {
        console.log(`Express server started on ${port}`);
    });
})();
