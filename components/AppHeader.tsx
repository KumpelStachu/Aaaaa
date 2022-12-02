import { Button, ButtonProps, Group, Header } from '@mantine/core'
import { IconHome, TablerIcon } from '@tabler/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import UserDropdown from './UserDropdown'

export default function AppHeader() {
	return (
		<Header height={56} px="sm">
			<Group style={{ height: '100%' }} spacing="xs" position="apart" noWrap>
				<NavLink href="/" icon={IconHome} exact>
					Home page
				</NavLink>

				<UserDropdown />
			</Group>
		</Header>
	)
}

type NavProps = ButtonProps & {
	exact?: boolean
	href: string
	icon: TablerIcon
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
			leftIcon={<Icon size={20} />}
			{...props}
		/>
	)
}
