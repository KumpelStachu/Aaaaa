import { TRPCError } from '@trpc/server'
import { addPlaceSchema, editPlaceSchema } from 'server/schema'
import { protectedProcedure, router } from 'server/trpc'
import { z } from 'zod'

export const placeRouter = router({
	findPlaceById: protectedProcedure.input(z.string().cuid()).query(async ({ ctx, input }) => {
		const place = await ctx.prisma.place.findUniqueOrThrow({
			where: { id: input },
			include: {
				LikePlace: true,
				PhotosPlace: true,
				CommentPlace: {
					include: {
						author: true,
					},
				},
				QrCodes: {
					where: {
						place: {
							userId: ctx.session.user.id,
						},
					},
				},
			},
		})

		return {
			...place,
			likedByMe: !!place.LikePlace.find(l => l.userId === ctx.session.user.id),
		}
	}),

	listAll: protectedProcedure.query(async ({ ctx }) => {
		return ctx.prisma.place.findMany({
			where: {
				OR: [{ public: true }, { userId: ctx.session.user.id }],
			},
			include: {
				PhotosPlace: true,
			},
			orderBy: {
				LikePlace: { _count: 'desc' },
			},
		})
	}),

	addPlace: protectedProcedure
		.input(addPlaceSchema)
		.mutation(async ({ ctx, input: { photos, ...input } }) => {
			return ctx.prisma.place.create({
				data: {
					...input,
					author: {
						connect: {
							id: ctx.session.user.id,
						},
					},
					PhotosPlace: {
						create: photos.map(url => ({ url })),
					},
					QrCodes: {
						create: {},
					},
					public: ctx.session.user.points >= 100 && input.public,
				},
				include: {
					QrCodes: true,
					LikePlace: true,
					CommentPlace: true,
				},
			})
		}),

	removePlace: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
		return ctx.prisma.place.delete({
			where: {
				id: input,
				userId: ctx.session.user.id,
			},
		})
	}),

	editPlace: protectedProcedure.input(editPlaceSchema).mutation(async ({ ctx, input }) => {
		return ctx.prisma.place.update({
			data: {
				...input,
				author: {
					connect: {
						id: ctx.session.user.id,
					},
				},
				public: ctx.session.user.points >= 100 && input.public,
			},
			where: { id: input.id, userId: ctx.session.user.id },
		})
	}),

	addComment: protectedProcedure
		.input(
			z.object({
				placeId: z.string().cuid(),
				comment: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.commentPlace.create({
				data: {
					author: {
						connect: {
							id: ctx.session.user.id,
						},
					},
					place: {
						connect: {
							id: input.placeId,
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
				placeId: z.string().cuid(),
				comment: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.commentPlace.update({
				data: {
					author: {
						connect: {
							id: ctx.session.user.id,
						},
					},
					place: {
						connect: {
							id: input.placeId,
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
		return ctx.prisma.commentPlace.delete({
			where: {
				id: input,
				userId: ctx.session.user.id,
			},
		})
	}),

	addPhotoPlace: protectedProcedure
		.input(z.object({ id: z.string().cuid(), url: z.string().url() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.place.update({
				where: {
					id: input.id,
					userId: ctx.session.user.id,
				},
				data: {
					PhotosPlace: {
						create: {
							url: input.url,
						},
					},
				},
			})
		}),

	removePhotoPlace: protectedProcedure
		.input(z.object({ id: z.string().cuid(), photoId: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.place.update({
				where: {
					id: input.id,
					userId: ctx.session.user.id,
				},
				data: {
					PhotosPlace: {
						delete: {
							id: input.photoId,
						},
					},
				},
			})
		}),

	visitPlace: protectedProcedure.input(z.string().uuid()).query(async ({ ctx, input }) => {
		const code = await ctx.prisma.qrCodes.findFirst({ where: { value: input } })
		if (!code) throw new TRPCError({ code: 'NOT_FOUND' })
		const visited = await ctx.prisma.visitedPlace.findFirst({
			where: { placeId: code.placeId, userId: ctx.session.user.id },
		})
		if (visited) throw new TRPCError({ code: 'CONFLICT' })
		await ctx.prisma.user.update({
			where: {
				id: ctx.session.user.id,
				Place: {
					none: {
						id: code.placeId,
					},
				},
			},
			data: { points: { increment: 1 } },
		})
		return ctx.prisma.visitedPlace.create({
			data: {
				place: { connect: { id: code.placeId } },
				user: { connect: { id: ctx.session.user.id } },
			},
		})
	}),

	getQrCode: protectedProcedure.input(z.string().cuid()).query(async ({ ctx, input }) => {
		return ctx.prisma.qrCodes.findFirst({
			where: {
				place: {
					id: input,
					userId: ctx.session.user.id,
				},
			},
		})
	}),

	generateQrCode: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
		const place = await ctx.prisma.place.findUnique({ where: { id: input } })
		if (place && place.userId == ctx.session.user.id) {
			return ctx.prisma.qrCodes.create({ data: { place: { connect: { id: input } } } })
		}
	}),

	likePlace: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
		return ctx.prisma.likePlace.create({
			data: {
				place: {
					connect: {
						id: input,
						LikePlace: {
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

	dislikePlace: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
		return ctx.prisma.likePlace.deleteMany({
			where: {
				placeId: input,
				userId: ctx.session.user.id,
			},
		})
	}),

	likeComment: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
		const comment = await ctx.prisma.commentPlace.findUniqueOrThrow({
			where: {
				id: input,
				LikeComment: {
					none: {
						userId: ctx.session.user.id,
					},
				},
			},
		})

		return ctx.prisma.likeComment.create({
			data: {
				comment: {
					connect: {
						id: comment.id,
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

	dislikeComment: protectedProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
		return ctx.prisma.commentPlace.deleteMany({
			where: {
				placeId: input,
				userId: ctx.session.user.id,
			},
		})
	}),
})
