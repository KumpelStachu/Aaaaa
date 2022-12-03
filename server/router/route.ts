import { addRouteSchema } from 'server/schema'
import { protectedProcedure, router } from 'server/trpc'
import { z } from 'zod'

export const routeRouter = router({
	findRouteById: protectedProcedure.input(z.string().cuid()).query(async ({ ctx, input }) => {
		const route = await ctx.prisma.route.findUniqueOrThrow({
			where: { id: input },
			include: {
				LikeRoute: true,
				commentRoute: {
					include: {
						author: true,
					},
				},
				placeRoute: {
					include: {
						place: {
							include: {
								VisitedPlace: {
									where: {
										userId: ctx.session.user.id,
									},
								},
								PhotosPlace: true,
								author: true,
							},
						},
					},
				},
			},
		})

		return {
			...route,
			likedByMe: !!route.LikeRoute.find(l => l.userId === ctx.session.user.id),
		}
	}),

	listAll: protectedProcedure.query(async ({ ctx }) => {
		return ctx.prisma.route.findMany({
			where: {
				OR: [{ public: true }, { userId: ctx.session.user.id }],
			},
			include: {
				placeRoute: {
					include: {
						place: {
							include: {
								PhotosPlace: true,
								author: true,
							},
						},
					},
				},
			},
			orderBy: {
				LikeRoute: { _count: 'desc' },
			},
		})
	}),

	addRoute: protectedProcedure
		.input(addRouteSchema)
		.mutation(async ({ ctx, input: { places, ...input } }) => {
			return ctx.prisma.route.create({
				data: {
					...input,
					author: {
						connect: {
							id: ctx.session.user.id,
						},
					},
					placeRoute: {
						createMany: {
							data: places.map((placeId, index) => ({
								index,
								placeId,
							})),
						},
					},
					public: ctx.session.user.points >= 100 && input.public,
				},
			})
		}),

	removeRoute: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
		return ctx.prisma.route.delete({
			where: {
				id: input,
				userId: ctx.session.user.id,
			},
		})
	}),

	likeRoute: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
		return ctx.prisma.likeRoute.create({
			data: {
				route: {
					connect: {
						id: input,
						LikeRoute: {
							none: {
								userId: ctx.session.user.id,
							},
						},
					},
				},
				user: {
					connect: {
						id: ctx.session.user.id,
					},
				},
			},
		})
	}),

	dislikeRoute: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
		return ctx.prisma.likeRoute.deleteMany({
			where: {
				routeId: input,
				userId: ctx.session.user.id,
			},
		})
	}),

	addComment: protectedProcedure
		.input(
			z.object({
				routeId: z.string().cuid(),
				comment: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.commentRoute.create({
				data: {
					author: {
						connect: {
							id: ctx.session.user.id,
						},
					},
					route: {
						connect: {
							id: input.routeId,
						},
					},
					comment: input.comment,
				},
			})
		}),

	editComment: protectedProcedure
		.input(
			z.object({
				id: z.string().cuid(),
				routeId: z.string().cuid(),
				comment: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.commentRoute.update({
				data: {
					author: {
						connect: {
							id: ctx.session.user.id,
						},
					},
					route: {
						connect: {
							id: input.routeId,
						},
					},
					comment: input.comment,
				},
				where: {
					id: input.id,
					userId: ctx.session.user.id,
				},
			})
		}),

	removeComment: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
		return ctx.prisma.commentRoute.delete({
			where: {
				id: input,
				userId: ctx.session.user.id,
			},
		})
	}),
})
