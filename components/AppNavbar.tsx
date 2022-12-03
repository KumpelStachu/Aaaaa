import { MediaQuery, Navbar, ScrollArea, Stack } from '@mantine/core'
import { IconHome, IconMap2, IconMapPin, IconMapSearch, IconSignRight } from '@tabler/icons'
import NavbarLink from './NavbarLink'

type Props = {
	opened: boolean
}

export default function AppNavbar({ opened }: Props) {
	return (
		<MediaQuery largerThan="md" styles={{ display: 'none' }}>
			<Navbar width={{ md: 260 }} hiddenBreakpoint="md" hidden={!opened}>
				<ScrollArea>
					<Stack spacing="xs" p="xs">
						<NavbarLink href="/" icon={IconHome} exact>
							Strona główna
						</NavbarLink>
						<NavbarLink href="/places" icon={IconMap2} exact>
							Lista miejsc
						</NavbarLink>
						<NavbarLink href="/places/new" icon={IconMapPin}>
							Dodaj miejsce
						</NavbarLink>
						<NavbarLink href="/routes" icon={IconMapSearch} exact>
							Lista tras
						</NavbarLink>
						<NavbarLink href="/routes/new" icon={IconSignRight}>
							Dodaj trasę
						</NavbarLink>
					</Stack>
				</ScrollArea>
			</Navbar>
		</MediaQuery>
	)
}
