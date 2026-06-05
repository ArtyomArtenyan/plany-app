import { Board, Lists } from './superbase/types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Boards
 **/
export async function getBoards(
	supabase: SupabaseClient,
	userId: string,
): Promise<Board[]> {
	const { data, error } = await supabase
		.from('boards')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });

	if (error) throw new Error(error.message);
	return data || [];
}

export async function createBoard(
	supabase: SupabaseClient,
	title: string,
	description: string | null,
	color: string | null,
	userId: string,
): Promise<Board> {
	const { data, error } = await supabase
		.from('boards')
		.insert({ title, description, color, user_id: userId })
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}

/**
 * Lists
 **/

export async function createList(
	supabase: SupabaseClient,
	boardId: number,
	title: string,
	sortOrder: number,
	userId: string,
): Promise<Lists> {
	const { data, error } = await supabase
		.from('lists')
		.insert({
			board_id: boardId,
			title,
			sort_order: sortOrder,
			user_id: userId,
		})
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}

export async function createBoardWithDefaults(
	supabase: SupabaseClient,
	title: string,
	description: string | null,
	color: string,
	userId: string,
): Promise<Board> {
	const board = await createBoard(supabase, title, description, color, userId);

	const defaultLists = [
		{ title: 'To-Do', sort_order: 0 },
		{ title: 'In Progress', sort_order: 1 },
		{ title: 'Review', sort_order: 2 },
		{ title: 'Done', sort_order: 3 },
	];

	await Promise.all(
		defaultLists.map(list =>
			createList(supabase, board.id, list.title, list.sort_order, userId),
		),
	);

	return board;
}
