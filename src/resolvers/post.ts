import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
	
	// Query all posts
	@Query(() => [Post])
	posts(@Ctx() { em }: MyContext): Promise<Post[]> {
		return em.find(Post, {});
	}
	
	// Query a single post
	@Query(() => Post, { nullable: true })
	post(
		@Arg('id', () => Int) id: number,
		@Ctx() { em }: MyContext
	): Promise<Post | null> {
		return em.findOne(Post, { id });
	}

	// Creates a new post
	@Mutation(() => Post, { nullable: true })
	async createPost(
		@Arg('title', () => String) title: string,
		@Ctx() { em }: MyContext
	): Promise<Post | null> {
		const post = em.create(Post, { title });
		if (!post) return null;
		await em.persistAndFlush(post);
		return post;
	}

	// Update a post
	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Arg('id', () => Int) id: number,
		@Arg('title', () => String) title: string,
		@Ctx() { em }: MyContext
	): Promise<Post | null> {
		const post = await em.findOne(Post, { id });
		if (!post) return null;
		if (typeof title !== "undefined") {
			post.title = title;
			await em.persistAndFlush(post);
		}
		return post;
	}

	// Deletes a post
	@Mutation(() => Boolean)
	async deletePost(
		@Arg('id', () => Int) id: number,
		@Ctx() { em }: MyContext
	): Promise<boolean> {
		try {
			await em.nativeDelete(Post, { id });
		} catch (error) {
			return false;
		}
		return true;
	}
}