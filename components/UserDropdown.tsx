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
				Log in
			</Button>
		)
	}

	return (
		<Menu width={200} position="bottom-end" withinPortal>
			<Menu.Target>
				<ActionIcon size="lg" variant="default">
					<IconUser size={20} />
				</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item component={Link} href={`/u/${session.user.name}`} icon={<IconUser size={16} />}>
					My profile
				</Menu.Item>

				<Menu.Divider />

				<Menu.Item icon={<IconLogout size={16} />} onClick={() => signOut()}>
					Log out
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}
