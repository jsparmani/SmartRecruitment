import 'dotenv/config';
import "reflect-metadata";
import express from 'express';
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {UserResolver} from "./resolvers/UserResolver";
import {createConnection} from "typeorm";

(async () => {
    const app = express();
    app.get('/', (_req, res) => {
        res.send("Hello");
    })


    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({req, res}) => ({req, res})
    })

    await createConnection();

    apolloServer.applyMiddleware({app});

    const port:any = process.env.PORT
    app.listen(port, () => {
        console.log(`Express server started on ${port}`);
    })
})()
