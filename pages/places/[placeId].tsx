import { Carousel } from '@mantine/carousel'
import {
	ActionIcon,
	Avatar,
	Button,
	Card,
	Grid,
	Group,
	Image,
	Paper,
	Rating,
	Stack,
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
	IconQrcode,
} from '@tabler/icons'
import Map from 'components/leaflet/Map'
import Marker from 'components/leaflet/Marker'
import useSession from 'hooks/useSession'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'

export default function PlacePage() {
	const { session } = useSession()
	const { query } = useRouter()
	const placeId = query.placeId as string

	const utils = trpc.useContext()
	const like = trpc.place.likePlace.useMutation({
		onSuccess() {
			utils.place.findPlaceById.invalidate(placeId)
		},
	})
	const dislike = trpc.place.dislikePlace.useMutation({
		onSuccess() {
			utils.place.findPlaceById.invalidate(placeId)
		},
	})
	const place = trpc.place.findPlaceById.useQuery(placeId)

	const form = useForm({
		initialValues: {
			comment: '',
		},
	})

	const addComment = trpc.place.addComment.useMutation({
		onSuccess() {
			utils.place.findPlaceById.invalidate(placeId)
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

	if (!place.data) return null

	return (
		<Stack spacing="xl">
			<Grid gutter="lg">
				<Grid.Col md="auto">
					<Paper radius="lg" sx={{ overflow: 'hidden' }}>
						<Carousel slideGap="lg" loop withIndicators>
							{place.data?.PhotosPlace.map(photo => (
								<Carousel.Slide key={photo.id}>
									<Image withPlaceholder src={photo.url} radius="lg" height={800} alt={photo.url} />
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
									<Title order={2}>{place.data?.name}</Title>

									<Group spacing="sm">
										{!!place.data?.QrCodes.length && (
											<ActionIcon
												radius="lg"
												size="xl"
												variant="light"
												component={Link}
												href={`/api/qr/${place.data?.QrCodes[0].value}`}
												target="_blank"
											>
												<IconQrcode size={28} />
											</ActionIcon>
										)}
										<ActionIcon
											hidden={!session}
											radius="lg"
											size="xl"
											variant="light"
											color="red"
											onClick={() =>
												place.data?.likedByMe ? dislike.mutate(placeId) : like.mutate(placeId)
											}
											loading={like.isLoading || dislike.isLoading}
										>
											{place.data?.likedByMe ? (
												<IconHeartMinus size={28} />
											) : (
												<IconHeartPlus size={28} />
											)}
										</ActionIcon>
									</Group>
								</Group>
								<Text>{place.data?.description}</Text>
								<Group position="apart" align="end">
									<Stack spacing="xs">
										<Text weight="bold">Trudność terenu:</Text>
										<Rating
											value={place.data?.difficulty}
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
										href={`https://www.google.pl/maps/search/${place.data.location}`}
										target="_blank"
									>
										<IconMapSearch size={28} />
									</ActionIcon>
								</Group>
							</Stack>
						</Card>

						{place.data && (
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
								<Map
									center={place.data.location.split(',').map(v => Number(v)) as [number, number]}
								>
									<Marker
										position={
											place.data.location.split(',').map(v => Number(v)) as [number, number]
										}
									/>
								</Map>
							</Paper>
						)}
					</Stack>
				</Grid.Col>
			</Grid>

			<Card hidden={!session}>
				<form onSubmit={form.onSubmit(({ comment }) => addComment.mutate({ placeId, comment }))}>
					<Group align="start">
						<Textarea
							required
							label="Komentarz"
							placeholder="Wpisz treść komentarza"
							minRows={4}
							sx={{ flexGrow: 1 }}
							{...form.getInputProps('comment')}
						/>
						<Button type="submit" loading={addComment.isLoading} mt="xl">
							Dodaj komentarz
						</Button>
					</Group>
				</form>
			</Card>

			<Stack hidden={!place.data?.CommentPlace.length}>
				<Title order={2}>Komentarze</Title>
				{place.data?.CommentPlace.map(comment => (
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
	)
}
