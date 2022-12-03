import { Button, ButtonProps, Group, Header, MediaQuery } from '@mantine/core'
import {
	IconHome,
	IconMap2,
	IconMapPin,
	IconMapSearch,
	IconSignRight,
	TablerIcon,
} from '@tabler/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import UserDropdown from './UserDropdown'

type Props = {
	children: React.ReactNode
}

export default function AppHeader({ children }: Props) {
	return (
		<Header height={56} px="sm">
			<Group style={{ height: '100%' }} spacing="xs" position="apart" noWrap>
				{children}
				<MediaQuery smallerThan="md" styles={{ display: 'none' }}>
					<Group spacing="xs">
						<NavLink href="/" icon={IconHome} exact>
							Strona główna
						</NavLink>
						<NavLink href="/places" exact icon={IconMap2}>
							Lista miejsc
						</NavLink>
						<NavLink href="/places/new" icon={IconMapPin}>
							Dodaj miejsce
						</NavLink>
						<NavLink href="/routes" exact icon={IconMapSearch}>
							Lista tras
						</NavLink>
						<NavLink href="/routes/new" icon={IconSignRight}>
							Dodaj trasę
						</NavLink>
					</Group>
				</MediaQuery>

				<UserDropdown />
			</Group>
		</Header>
	)
}

type NavProps = ButtonProps & {
	exact?: boolean
	href: string
	icon?: TablerIcon
	leftIcon?: undefined
	hidden?: boolean
}

function NavLink({ icon, exact, href, ...props }: NavProps) {
	const { asPath } = useRouter()
	const Icon = icon

	return (
		<Button
			component={Link}
			href={href}
			variant={(exact ? asPath === href : asPath.startsWith(href)) ? 'light' : 'subtle'}
			leftIcon={Icon && <Icon size={20} />}
			{...props}
		/>
	)
}
