import {
	Button,
	Container,
	MultiSelect,
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
import useSession from 'hooks/useSession'
import { useRouter } from 'next/router'
import { addPlaceSchema } from 'server/schema'
import { trpc } from 'utils/trpc'
import { z } from 'zod'

export default function AddPlacePage() {
	const { session } = useSession()
	const router = useRouter()

	const addPlace = trpc.place.addPlace.useMutation({
		onError(error) {
			showNotification({
				message: error.message,
			})
		},
		onSuccess(data) {
			router.push(`/places/${data.id}`)
		},
	})

	const form = useForm<z.infer<typeof addPlaceSchema>>({
		clearInputErrorOnChange: true,
		validateInputOnBlur: true,
		initialValues: {
			name: '',
			description: '',
			difficulty: 3,
			location: '51.9427955,19.1979511',
			public: false,
			photos: [],
		},
		validate: zodResolver(addPlaceSchema),
	})

	return (
		<Container>
			<form onSubmit={form.onSubmit(values => addPlace.mutate(values))}>
				<Stack spacing="lg">
					<Title>Dodawanie miejsca</Title>
					<TextInput
						required
						label="Nazwa"
						placeholder="Nazwa miejsca"
						{...form.getInputProps('name')}
					/>
					<Textarea
						required
						label="Opis"
						placeholder="Opis miejsca"
						{...form.getInputProps('description')}
						minRows={3}
					/>
					<MultiSelect
						required
						label="Zdjęcia"
						placeholder="Wprowadź adresy zdjęć"
						searchable
						creatable
						clearable
						data={form.values.photos}
						onCreate={item => form.insertListItem('photos', item)}
						getCreateLabel={label => `Dodaj ${label}`}
						{...form.getInputProps('photos')}
					/>
					<Slider
						labelAlwaysOn
						label="Trudność terenu"
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
							<Marker
								draggable
								position={form.values.location.split(',').map(v => Number(v)) as [number, number]}
								eventHandlers={{
									moveend: e =>
										form.setFieldValue('location', Object.values(e.target._latlng).join(',')),
								}}
							/>
						</Map>
					</Paper>

					<Button type="submit" loading={addPlace.isLoading}>
						Dodaj miejsce
					</Button>
				</Stack>
			</form>
		</Container>
	)
}
