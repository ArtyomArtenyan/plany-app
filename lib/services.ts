import { createClient } from './superbase/server';
import { Board } from './superbase/types';

/**
 * BOARDS SERVICES
 **/
export async function getBoards(userId: string): Promise<Board[]> {
	const supabase = await createClient();
	console.log('supabase:', supabase);
	const { data, error } = await supabase
		.from('boards')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });

	if (error) throw new Error(error.message);
	return data as Board[];
}

export async function createBoard(
	board: Omit<Board, 'id' | 'created_at' | 'updated_at'>,
): Promise<Board> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from('boards')
		.insert(board)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}
