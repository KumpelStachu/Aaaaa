import { ActionIcon, Button, Menu } from '@mantine/core'
import { IconBrandDiscord, IconLogout, IconUser } from '@tabler/icons'
import useSession from 'hooks/useSession'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function UserDropdown() {
	const { session } = useSession()

	if (!session) {
		return (
			<Button
				variant="default"
				onClick={() => signIn('discord')}
				leftIcon={<IconBrandDiscord size={20} />}
			>
				Zaloguj się
			</Button>
		)
	}

	return (
		<Menu width={200} position="bottom-end" withinPortal>
			<Menu.Target>
				<Button variant="default" rightIcon={<IconUser size={20} />}>
					{session.user.name}
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				{/* <Menu.Item component={Link} href={`/u/${session.user.name}`} icon={<IconUser size={16} />}>
					Mój profil
				</Menu.Item>

				<Menu.Divider /> */}

				<Menu.Item icon={<IconLogout size={16} />} onClick={() => signOut()}>
					Wyloguj się
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}
