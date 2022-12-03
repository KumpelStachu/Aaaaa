import { z } from 'zod'

export const addPlaceSchema = z.object({
	name: z
		.string()
		.min(6, 'Nazwa musi mieć przynajmniej 6 znaków')
		.max(50, 'Nazwa może mieć maksymalnie 50 znaków'),
	description: z
		.string()
		.min(10, 'Opis musi mieć przynajmniej 10 znaków')
		.max(300, 'Opis może mieć maksymalnie 300 znaków'),
	photos: z.string().url().array().min(1).min(1, 'Musisz dodać zdjęcie'),
	location: z
		.string()
		.refine(s => s.split(',').every(s => !isNaN(Number(s))), 'Niepoprawne koordynaty'),
	difficulty: z.number().min(1).max(5),
	public: z.boolean().default(false),
})

export const editPlaceSchema = z.object({
	id: z.string().cuid(),
	name: z.string().min(4).max(100),
	description: z.string(),
	location: z.string(),
	difficulty: z.number().min(1).max(5),
	public: z.boolean().default(false),
})

export const addRouteSchema = z.object({
	name: z
		.string()
		.min(6, 'Nazwa musi mieć przynajmniej 6 znaków')
		.max(50, 'Nazwa może mieć maksymalnie 50 znaków'),
	description: z
		.string()
		.min(10, 'Opis musi mieć przynajmniej 10 znaków')
		.max(300, 'Opis może mieć maksymalnie 300 znaków'),
	price: z
		.number({ required_error: 'Cena jest wymagana' })
		.step(0.01)
		.nonnegative('Cena musi być nieujemna'),
	places: z.string().cuid().array().min(2, 'Musisz wybrać przynajmniej 2 miejsca'),
	difficulty: z.number().min(1).max(5),
	public: z.boolean().default(false),
})
