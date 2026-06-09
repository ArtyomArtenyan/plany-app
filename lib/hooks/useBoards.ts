'use client';

import { useEffect, useState } from 'react';
import { Board, Lists } from '../superbase/types';
import {
	createBoardWithDefaults,
	getBoard,
	getBoards,
	getList,
	updateBoard,
} from '../services';
import { useUser } from '@clerk/nextjs';
import { useSuperbase } from '../superbase/SupabaseProvider';

export const useBoards = () => {
	const { user } = useUser();

	const [boards, setBoards] = useState<Board[]>([]);
	const [loaded, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
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

export function useBoard(boardId: string) {
	const { user } = useUser();
	const [board, setBoard] = useState<Board | null>(null);
	const [list, setList] = useState<Lists[]>([]);

	const [loaded, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<String | null>(null);
	const { supabase } = useSuperbase();
	useEffect(() => {
		if (!boardId || !supabase) return;

		loadBoard();
	}, [supabase, boardId]);

	async function loadBoard() {
		if (!boardId) {
			throw new Error('User not authenticated');
		}
		try {
			setLoading(true);
			const [boardData, listData] = await Promise.all([
				getBoard(supabase!, boardId),
				getList(supabase!, boardId),
			]);
			setBoard(boardData);
			setList(listData);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else setError('Failed to load Boards');
		} finally {
			setLoading(false);
		}
	}

	async function boardUpdate(boardId: string, updates: Partial<Board>) {
		try {
			setLoading(true);
			const updatedData = await updateBoard(supabase!, boardId, updates);
			setBoard(updatedData);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else setError('Failed to update Board');
		} finally {
			setLoading(false);
		}
	}
	return { loaded, error, board, list, boardUpdate };
}
