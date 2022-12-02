import { router, publicProcedure } from 'server/trpc'

export const authRouter = router({
	session: publicProcedure.query(({ ctx }) => {
		return ctx.session
	}),
})
