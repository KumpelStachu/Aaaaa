import { router, protectedProcedure } from 'server/trpc'

export const userRouter = router({
	places: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.place.findMany({
			where: { userId: ctx.session.user.id },
			include: {
				PhotosPlace: true,
			},
		})
	}),
	routes: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.route.findMany({
			where: { userId: ctx.session.user.id },
			include: {
				placeRoute: {
					include: {
						place: {
							include: {
								PhotosPlace: true,
							},
						},
					},
				},
			},
		})
	}),
	likedPlaces: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.place.findMany({
			where: {
				LikePlace: {
					some: {
						userId: ctx.session.user.id,
					},
				},
			},
			include: {
				PhotosPlace: true,
			},
		})
	}),
	likedRoutes: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.route.findMany({
			where: {
				LikeRoute: {
					some: {
						userId: ctx.session.user.id,
					},
				},
			},
			include: {
				placeRoute: {
					include: {
						place: {
							include: {
								PhotosPlace: true,
							},
						},
					},
				},
			},
		})
	}),
})
