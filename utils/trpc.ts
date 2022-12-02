import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import type { AppRouter } from 'server/router/_app'
import superjson from 'superjson'

const getBaseUrl = () => {
	if (typeof window !== 'undefined') return ''
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
	return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCNext<AppRouter>({
	config({ ctx }) {
		return {
			transformer: superjson,
			links: [
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
					headers() {
						if (ctx?.req) {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const { connection, ...headers } = ctx.req.headers
							return { ...headers, 'x-ssr': 1 }
						}
						return {}
					},
				}),
			],
		}
	},
	responseMeta({ clientErrors }) {
		if (clientErrors.length) {
			return {
				status: clientErrors[0].data?.httpStatus ?? 500,
			}
		}

		return {}
	},
	ssr: true,
})
