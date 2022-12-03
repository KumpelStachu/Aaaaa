import { Carousel } from '@mantine/carousel'
import {
	ActionIcon,
	Avatar,
	Button,
	Card,
	Flex,
	Grid,
	Group,
	Image,
	Paper,
	Rating,
	Stack,
	Stepper,
	Text,
	Textarea,
	Title,
	useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
	IconHeartMinus,
	IconHeartPlus,
	IconMapSearch,
	IconMoodEmpty,
	IconMoodHappy,
	IconMoodKid,
	IconMoodSadSquint,
	IconMoodSmile,
} from '@tabler/icons'
import Map from 'components/leaflet/Map'
import Marker from 'components/leaflet/Marker'
import Popup from 'components/leaflet/Popup'
import useSession from 'hooks/useSession'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'

export default function PlacePage() {
	const { session } = useSession()
	const { query } = useRouter()
	const routeId = query.routeId as string

	const utils = trpc.useContext()
	const like = trpc.route.likeRoute.useMutation({
		onSuccess() {
			utils.route.findRouteById.invalidate(routeId)
		},
	})
	const dislike = trpc.route.dislikeRoute.useMutation({
		onSuccess() {
			utils.route.findRouteById.invalidate(routeId)
		},
	})
	const route = trpc.route.findRouteById.useQuery(routeId)

	const form = useForm({
		initialValues: {
			comment: '',
		},
	})

	const addComment = trpc.route.addComment.useMutation({
		onSuccess() {
			utils.route.findRouteById.invalidate(routeId)
			form.setFieldValue('comment', '')
		},
	})

	const getEmptyIcon = (value: number) => {
		const defaultProps = {
			size: 24,
			color: 'gray',
		}
		switch (value) {
			case 1:
				return <IconMoodKid {...defaultProps} />
			case 2:
				return <IconMoodHappy {...defaultProps} />
			case 3:
				return <IconMoodSmile {...defaultProps} />
			case 4:
				return <IconMoodEmpty {...defaultProps} />
			case 5:
				return <IconMoodSadSquint {...defaultProps} />
		}
	}

	const getFullIcon = (value: number) => {
		const defaultProps = {
			size: 24,
		}
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const theme = useMantineTheme()

		switch (value) {
			case 1:
				return <IconMoodKid {...defaultProps} color={theme.colors.green[7]} />
			case 2:
				return <IconMoodHappy {...defaultProps} color={theme.colors.lime[7]} />
			case 3:
				return <IconMoodSmile {...defaultProps} color={theme.colors.yellow[7]} />
			case 4:
				return <IconMoodEmpty {...defaultProps} color={theme.colors.orange[7]} />
			case 5:
				return <IconMoodSadSquint {...defaultProps} color={theme.colors.red[7]} />
		}
	}

	if (!route.data) return null

	return (
		<Stack spacing="xl">
			<Grid gutter="lg">
				<Grid.Col md="auto">
					<Paper radius="lg" sx={{ overflow: 'hidden' }}>
						<Carousel slideGap="lg" loop withIndicators>
							{route.data?.placeRoute
								.flatMap(pr => pr.place.PhotosPlace)
								.map(photo => (
									<Carousel.Slide key={photo.id}>
										<Image
											withPlaceholder
											src={photo.url}
											radius="lg"
											height={800}
											alt={photo.url}
										/>
									</Carousel.Slide>
								))}
						</Carousel>
					</Paper>
				</Grid.Col>

				<Grid.Col md={5}>
					<Stack
						sx={t => ({
							[t.fn.largerThan('md')]: {
								height: '100%',
							},
						})}
					>
						<Card>
							<Stack>
								<Group position="apart">
									<Title order={2}>{route.data?.name}</Title>

									<Group spacing="sm">
										<ActionIcon
											hidden={!session}
											radius="lg"
											size="xl"
											variant="light"
											color="red"
											onClick={() =>
												route.data?.likedByMe ? dislike.mutate(routeId) : like.mutate(routeId)
											}
											loading={like.isLoading || dislike.isLoading}
										>
											{route.data?.likedByMe ? (
												<IconHeartMinus size={28} />
											) : (
												<IconHeartPlus size={28} />
											)}
										</ActionIcon>
									</Group>
								</Group>
								<Text>{route.data?.description}</Text>
								<Group spacing="xs">
									<Text weight="bold">Cena:</Text>
									<Text>{route.data?.price}zł</Text>
								</Group>
								<Group position="apart" align="end">
									<Stack spacing="xs">
										<Text weight="bold">Trudność trasy:</Text>
										<Rating
											value={route.data?.difficulty}
											emptySymbol={getEmptyIcon}
											fullSymbol={getFullIcon}
											highlightSelectedOnly
											readOnly
										/>
									</Stack>
									<ActionIcon
										radius="lg"
										size="xl"
										variant="light"
										color="cyan"
										component={Link}
										href={`https://www.google.pl/maps/dir/${route.data.placeRoute
											.map(pr => pr.place.location)
											.join('/')}`}
										target="_blank"
									>
										<IconMapSearch size={28} />
									</ActionIcon>
								</Group>
							</Stack>
						</Card>

						{route.data && (
							<Paper
								radius="md"
								sx={t => ({
									isolation: 'isolate',
									overflow: 'hidden',
									flexGrow: 1,
									'&>div': {
										height: '100%',
									},
									[t.fn.smallerThan('md')]: {
										height: 400,
									},
								})}
							>
								<Map center={[51.9427955, 19.1979511]} zoom={6}>
									{route.data.placeRoute.map(pr => (
										<Marker
											key={pr.place.id}
											position={
												pr.place.location.split(',').map(v => Number(v)) as [number, number]
											}
										>
											<Popup>{pr.place.name}</Popup>
										</Marker>
									))}
								</Map>
							</Paper>
						)}
					</Stack>
				</Grid.Col>
			</Grid>

			<Flex
				align="start"
				gap="xl"
				sx={t => ({
					[t.fn.smallerThan('md')]: {
						flexDirection: 'column',
					},
				})}
			>
				<Stepper
					orientation="vertical"
					active={route.data.placeRoute.reduce(
						(a, v, i) => a + (v.place.VisitedPlace.length && a >= i ? 1 : 0),
						0
					)}
				>
					{route.data.placeRoute.map(pr => (
						<Stepper.Step key={pr.place.id} label={pr.place.name} data-active />
					))}
				</Stepper>

				<Stack
					sx={t => ({
						flexGrow: 1,
						[t.fn.smallerThan('md')]: {
							width: '100%',
						},
					})}
				>
					<Card hidden={!session}>
						<form
							onSubmit={form.onSubmit(({ comment }) => addComment.mutate({ routeId, comment }))}
						>
							<Group align="start">
								<Textarea
									required
									label="Komentarz"
									placeholder="Wpisz treść komentarza"
									minRows={3}
									sx={{ flexGrow: 1 }}
									{...form.getInputProps('comment')}
								/>
								<Button type="submit" loading={addComment.isLoading} mt="xl">
									Dodaj komentarz
								</Button>
							</Group>
						</form>
					</Card>

					<Stack hidden={!route.data?.commentRoute.length}>
						<Title order={2}>Komentarze</Title>
						{route.data?.commentRoute.map(comment => (
							<Card key={comment.id}>
								<Group align="start">
									<Avatar src={comment.author.image} size="lg" />
									<Stack>
										<Text size="xl" weight="bold">
											{comment.author.name}
										</Text>
										<Text>{comment.comment}</Text>
									</Stack>
								</Group>
							</Card>
						))}
					</Stack>
				</Stack>
			</Flex>
		</Stack>
	)
}
