import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core"
import path from 'path';

export default {
	migrations: {
		path: path.join(__dirname, "./migrations"), 
		pattern: /^[\w-]+\d+\.[tj]s$/,
	},
	entities: [Post],
	dbName: 'lireddit',
	user: 'postgres',
	password: 'postgres',
	type: 'postgresql',
	debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];

// For exporting objects in typescript, we can cast then to const,
// but this will remove autocompletions, and is a workaround.
// So instead, we can check the type of the parameter used by MikroORM.init
// and cast object to the first element of a list of parameters of the same type.