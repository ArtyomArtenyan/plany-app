import { Board, Lists, Task } from './superbase/types';
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
export async function getBoard(
	supabase: SupabaseClient,
	boardId: string,
): Promise<Board> {
	const { data, error } = await supabase
		.from('boards')
		.select('*')
		.eq('id', boardId)
		.single();

	if (error) throw new Error(error.message);

	return data;
}

export async function updateBoard(
	supabase: SupabaseClient,
	boardId: string,
	updates: Partial<Board>,
): Promise<Board> {
	const { data, error } = await supabase
		.from('boards')
		.update({ ...updates, updated_at: new Date().toISOString() })
		.eq('id', boardId)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
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

export async function getList(
	supabase: SupabaseClient,
	boardId: string,
): Promise<Lists[]> {
	const { data, error } = await supabase
		.from('lists')
		.select('*')
		.eq('board_id', boardId)
		.order('sort_order', { ascending: true });

	if (error) throw new Error(error.message);

	return data;
}

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

/**
 * Tasks
 **/

export async function getTasks(
	supabase: SupabaseClient,
	listIds: number[],
): Promise<Task[]> {
	if (listIds.length === 0) return [];

	const { data, error } = await supabase
		.from('tasks')
		.select('*')
		.in('list_id', listIds)
		.order('sort_order', { ascending: true });

	if (error) throw new Error(error.message);
	return data || [];
}

export async function createTask(
	supabase: SupabaseClient,
	taskData: {
		list_id: number;
		title: string;
		description: string | null;
		assignee: string | null;
		due_date: string | null;
		priority: 'low' | 'medium' | 'high';
		sort_order: number;
		is_completed: boolean;
	},
): Promise<Task> {
	const { data, error } = await supabase
		.from('tasks')
		.insert({ ...taskData, created_at: new Date().toISOString() })
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}

export async function updateTask(
	supabase: SupabaseClient,
	taskId: number,
	updates: Partial<Task>,
): Promise<Task> {
	const { data, error } = await supabase
		.from('tasks')
		.update(updates)
		.eq('id', taskId)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}

export async function deleteTask(
	supabase: SupabaseClient,
	taskId: number,
): Promise<void> {
	const { error } = await supabase.from('tasks').delete().eq('id', taskId);

	if (error) throw new Error(error.message);
}
