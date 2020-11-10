import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

const main = async () => {

	// Connects to the database
	const orm = await MikroORM.init(microConfig);

	// Run migrations
	await orm.getMigrator().up();

	// Creates a object of 'post' and persists into database
	// const post = orm.em.create(Post, { title: 'my first post' });
	// await orm.em.persistAndFlush(post)

	// Find posts with 'find' function into database
	// const posts = await orm.em.find(Post, {});
	// console.log(posts);

	// The nativeInsert should create the object before send to database
	// but always crashes
	// await orm.em.nativeInsert(Post, { title: 'my second post' })

	const app = express();
	
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver],
			validate: false,
		}),
		context: () => ({ em: orm.em })
	});

	apolloServer.applyMiddleware({ app });
	
	app.listen(4000, () => {
		console.log("Server started on localhost:4000");
	});
};

main().catch(err => {
	console.log(err)
});