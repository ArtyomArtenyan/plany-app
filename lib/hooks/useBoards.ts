'use client';

import { useEffect, useState } from 'react';
import { Board } from '../superbase/types';
import { createBoardWithDefaults, getBoards } from '../services';
import { useUser } from '@clerk/nextjs';
import { useSuperbase } from '../superbase/SupabaseProvider';

export const useBoards = () => {
	const { user } = useUser();

	const [boards, setBoards] = useState<Board[]>([]);
	const [loaded, setLoading] = useState<Boolean>(false);
	const [error, setError] = useState<String | null>(null);
	const { supabase } = useSuperbase();

	useEffect(() => {
		if (!user || !supabase) return;

		loadBoards();
	}, [user, supabase]);

	async function loadBoards() {
		if (!user) {
			throw new Error('User not authenticated');
		}
		try {
			setLoading(true);
			const boardsData = await getBoards(supabase!, user.id);
			setBoards(boardsData);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else setError('Failed to load Boards');
		} finally {
			setLoading(false);
		}
	}

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
	return { createBoard, boards, loaded, error };
};
