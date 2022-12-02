import { trpc } from 'utils/trpc'
import type { Session } from 'next-auth'

type UseSession<R> =
	| {
			session: R extends true ? Session : Session | null
			status: R extends true ? 'authenticated' : 'authenticated' | 'unauthenticated'
			loading: false
			invalidate(): Promise<void>
	  }
	| {
			session: null
			status: 'loading'
			loading: true
			invalidate(): Promise<void>
	  }

export default function useSession<R extends boolean = false>(): UseSession<R> {
	const { data, isLoading } = trpc.auth.session.useQuery(undefined)
	const utils = trpc.useContext()

	return {
		session: data ?? null,
		status: isLoading ? 'loading' : data ? 'authenticated' : 'unauthenticated',
		loading: isLoading,
		invalidate: () => utils.auth.session.invalidate(),
	} as UseSession<R>
}
