import { Container, Text } from '@mantine/core'
import useSession from 'hooks/useSession'

export default function Home() {
	const { session } = useSession()

	return (
		<Container size="lg">
			{session ? <Text>Hello {session.user.name}</Text> : <Text>Not logged in</Text>}
		</Container>
	)
}
