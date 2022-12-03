import { AppShell, Burger, Group, MediaQuery, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import AppHeader from './AppHeader'
import AppNavbar from './AppNavbar'

type Props = {
	children: React.ReactNode
}

export default function Layout({ children }: Props) {
	const [opened, { toggle, close }] = useDisclosure(false)
	const router = useRouter()

	useEffect(() => {
		router.events.on('routeChangeStart', close)
		return () => router.events.off('routeChangeStart', close)
	})

	return (
		<AppShell
			header={
				<AppHeader>
					<MediaQuery largerThan="md" styles={{ display: 'none' }}>
						<Group>
							<Burger opened={opened} onClick={toggle} size="md" />
							<Title order={2}>Travello</Title>
						</Group>
					</MediaQuery>
				</AppHeader>
			}
			navbarOffsetBreakpoint={9999}
			navbar={<AppNavbar opened={opened} />}
			sx={t => ({ backgroundColor: t.colorScheme === 'dark' ? t.colors.dark[8] : 'white' })}
		>
			{children}
		</AppShell>
	)
}
