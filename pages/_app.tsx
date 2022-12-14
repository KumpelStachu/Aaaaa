import Layout from 'components/Layout'
import RouterTransition from 'components/RouterTransition'
import { MantineProvider } from '@mantine/core'
import { trpc } from 'utils/trpc'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NotificationsProvider } from '@mantine/notifications'

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>travello</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{ colorScheme: 'dark', defaultRadius: 'md', primaryColor: 'green' }}
			>
				<RouterTransition />
				<Layout>
					<NotificationsProvider>
						<Component {...pageProps} />
					</NotificationsProvider>
				</Layout>
			</MantineProvider>

			<ReactQueryDevtools />
		</>
	)
}

export default trpc.withTRPC(App)
