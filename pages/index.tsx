import { Card, Grid, Image, Stack, Title } from '@mantine/core'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

export default function Home() {
	const places = trpc.user.places.useQuery()
	const routes = trpc.user.routes.useQuery()
	const likedPlaces = trpc.user.likedPlaces.useQuery()
	const likedRoutes = trpc.user.likedRoutes.useQuery()

	return (
		<Stack>
			<Title>Moje miejsca</Title>
			<Grid mb="xl">
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

			<Title>Moje trasy</Title>
			<Grid mb="xl">
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

			<Title>Polubione miejsca</Title>
			<Grid mb="xl">
				{likedPlaces.data?.map(place => (
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

			<Title>Polubione trasy</Title>
			<Grid mb="xl">
				{likedRoutes.data?.map(route => (
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
		</Stack>
	)
}
