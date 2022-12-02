import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { prisma } from 'server/prisma'

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
	const session = await unstable_getServerSession(req, res, authOptions)

	return {
		req,
		res,
		session,
		prisma,
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
