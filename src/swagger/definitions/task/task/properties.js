import { type as T } from '../../../constants'

export const id = {
	description: 'id',
	type: T.integer,
	example: 1000000,
}

export const isCompleted = {
	description: 'is completed',
	type: T.boolean,
}

export const title = {
	description: 'title',
	type: T.string,
	example: 'title',
}

export const content = {
	description: 'content',
	type: T.string,
	example: 'content',
}

export const deadline = {
	description: 'deadline timestamp',
	type: T.integer,
	example: 1000000,
}
