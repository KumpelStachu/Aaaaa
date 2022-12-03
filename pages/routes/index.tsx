import { Card, Grid, Image, Title } from '@mantine/core'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

export default function PlacesPage() {
	const routes = trpc.route.listAll.useQuery()

	return (
		<Grid>
			{routes.data?.map(route => (
				<Grid.Col key={route.id} span="content">
					<Card component={Link} href={`/routes/${route.id}`} withBorder>
						<Card.Section>
							<Image
								alt={route.name}
								src={route.placeRoute[0].place.PhotosPlace[0].url}
								withPlaceholder
								height={300}
							/>
						</Card.Section>
						<Title order={2} m="xs" mt="lg">
							{route.name}
						</Title>
					</Card>
				</Grid.Col>
			))}
		</Grid>
	)
}
