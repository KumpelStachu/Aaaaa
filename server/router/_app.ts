import { router } from '../trpc'
import { authRouter } from './auth'
import { placeRouter } from './place'
import { routeRouter } from './route'
import { userRouter } from './user'

export const appRouter = router({
	auth: authRouter,
	place: placeRouter,
	user: userRouter,
	route: routeRouter,
})

export type AppRouter = typeof appRouter
