import {
	Button,
	Container,
	MultiSelect,
	NumberInput,
	Paper,
	Slider,
	Stack,
	Switch,
	Textarea,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import Map from 'components/leaflet/Map'
import Marker from 'components/leaflet/Marker'
import Popup from 'components/leaflet/Popup'
import useSession from 'hooks/useSession'
import { useRouter } from 'next/router'
import { addRouteSchema } from 'server/schema'
import { trpc } from 'utils/trpc'
import { z } from 'zod'

export default function AddPlacePage() {
	const { session } = useSession()
	const router = useRouter()

	const places = trpc.place.listAll.useQuery()
	const addPlace = trpc.route.addRoute.useMutation({
		onError(error) {
			showNotification({
				message: error.message,
			})
		},
		onSuccess(data) {
			router.push(`/routes/${data.id}`)
		},
	})

	const form = useForm<z.infer<typeof addRouteSchema>>({
		clearInputErrorOnChange: true,
		validateInputOnBlur: true,
		initialValues: {
			name: '',
			description: '',
			difficulty: 3,
			price: 0,
			public: false,
			places: [],
		},
		validate: zodResolver(addRouteSchema),
	})

	return (
		<Container>
			<form onSubmit={form.onSubmit(values => addPlace.mutate(values))}>
				<Stack spacing="lg">
					<Title>Dodawanie trasy</Title>
					<TextInput
						required
						label="Nazwa"
						placeholder="Nazwa trasy"
						{...form.getInputProps('name')}
					/>
					<Textarea
						required
						label="Opis"
						placeholder="Opis trasy"
						{...form.getInputProps('description')}
						minRows={3}
					/>
					<NumberInput
						required
						label="Cena"
						placeholder="Cena za osobę"
						{...form.getInputProps('price')}
					/>
					<MultiSelect
						required
						label="Miejsca"
						placeholder="Wybierz miejsca"
						searchable
						clearable
						data={places.data?.map(p => ({ value: p.id, label: p.name })) ?? []}
						{...form.getInputProps('places')}
					/>
					<Slider
						labelAlwaysOn
						label="Trudność trasy"
						size="lg"
						mt="lg"
						min={1}
						max={5}
						step={1}
						marks={[
							{ value: 1, label: 1 },
							{ value: 2, label: 2 },
							{ value: 3, label: 3 },
							{ value: 4, label: 4 },
							{ value: 5, label: 5 },
						]}
						{...form.getInputProps('difficulty')}
					/>
					<Switch
						label="Publiczność"
						disabled={(session?.user.points ?? 0) < 100}
						{...form.getInputProps('public', { type: 'checkbox' })}
					/>

					<Paper
						radius="md"
						sx={{
							isolation: 'isolate',
							overflow: 'hidden',
							'&>div': {
								aspectRatio: '1',
								width: '100%',
							},
						}}
					>
						<Map center={[51.9427955, 19.1979511]} zoom={7}>
							{places.data
								?.filter(p => form.values.places.includes(p.id))
								.map(place => (
									<Marker
										key={place.id}
										position={place.location.split(',').map(v => Number(v)) as [number, number]}
									>
										<Popup>{place.name}</Popup>
									</Marker>
								))}
						</Map>
					</Paper>

					<Button type="submit" loading={addPlace.isLoading}>
						Dodaj trasę
					</Button>
				</Stack>
			</form>
		</Container>
	)
}
