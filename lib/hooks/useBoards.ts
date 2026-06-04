'use client';

import { useState } from 'react';
import { Board } from '../superbase/types';
import { createBoardWithDefaults } from '../services';
import { useUser } from '@clerk/nextjs';
import { useSuperbase } from '../superbase/SupabaseProvider';

export const useBoards = () => {
	const { user } = useUser();

	const [boards, setBoards] = useState<Board[]>([]);
	const { supabase } = useSuperbase();

	async function createBoard({
		title,
		description,
		color,
	}: {
		title: string;
		description: string | null;
		color: string;
	}) {
		if (!user) {
			throw new Error('User not authenticated');
		}
		try {
			if (!supabase) {
				throw new Error('Supabase not initialized');
			}
			const newBoard = await createBoardWithDefaults(
				supabase,
				title,
				description,
				color,
				user.id,
			);
			setBoards(prev => [newBoard, ...prev]);
		} catch (error) {
			console.error(error);
		}
	}
	return { createBoard };
};
