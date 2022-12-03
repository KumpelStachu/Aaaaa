import { Card, Grid, Image, Title } from '@mantine/core'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

export default function PlacesPage() {
	const places = trpc.place.listAll.useQuery()

	return (
		<Grid>
			{places.data?.map(place => (
				<Grid.Col key={place.id} span="content">
					<Card component={Link} href={`/places/${place.id}`} withBorder>
						<Card.Section>
							<Image
								alt={place.name}
								src={place.PhotosPlace[0]?.url}
								withPlaceholder
								height={300}
							/>
						</Card.Section>
						<Title order={2} m="xs" mt="lg">
							{place.name}
						</Title>
					</Card>
				</Grid.Col>
			))}
		</Grid>
	)
}
