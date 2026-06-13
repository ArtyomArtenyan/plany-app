'use client';

import { useEffect, useState } from 'react';
import { Board, Lists, Task } from '../superbase/types';
import {
	createBoardWithDefaults,
	createList,
	createTask,
	deleteTask,
	getBoard,
	getBoards,
	getList,
	getTasks,
	updateBoard,
	updateTask,
} from '../services';
import { useUser } from '@clerk/nextjs';
import { useSuperbase } from '../superbase/SupabaseProvider';

export const useBoards = () => {
	const { user } = useUser();

	const [boards, setBoards] = useState<Board[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { supabase } = useSuperbase();

	useEffect(() => {
		if (!user || !supabase) return;

		const userId = user.id;
		async function loadBoards() {
			try {
				setIsLoading(true);
				const boardsData = await getBoards(supabase!, userId);
				setBoards(boardsData);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else setError('Failed to load Boards');
			} finally {
				setIsLoading(false);
			}
		}

		loadBoards();
	}, [user, supabase]);

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
	return { createBoard, boards, isLoading, error };
};

export function useBoard(boardId: string) {
	const { user } = useUser();
	const [board, setBoard] = useState<Board | null>(null);
	const [lists, setLists] = useState<Lists[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { supabase } = useSuperbase();
	useEffect(() => {
		if (!boardId || !supabase) return;

		async function loadBoard() {
			try {
				setIsLoading(true);
				const [boardData, listsData] = await Promise.all([
					getBoard(supabase!, boardId),
					getList(supabase!, boardId),
				]);
				setBoard(boardData);
				setLists(listsData);

				if (listsData.length > 0) {
					const tasksData = await getTasks(
						supabase!,
						listsData.map(l => l.id),
					);
					setTasks(tasksData);
				}
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else setError('Failed to load Boards');
			} finally {
				setIsLoading(false);
			}
		}

		loadBoard();
	}, [supabase, boardId]);

	async function boardUpdate(boardId: string, updates: Partial<Board>) {
		try {
			setIsLoading(true);
			const updatedData = await updateBoard(supabase!, boardId, updates);
			setBoard(updatedData);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else setError('Failed to update Board');
		} finally {
			setIsLoading(false);
		}
	}

	async function addList(title: string) {
		if (!user || !supabase || !board) return;
		try {
			const newList = await createList(
				supabase,
				board.id,
				title,
				lists.length,
				user.id,
			);
			setLists(prev => [...prev, newList]);
		} catch (err) {
			console.error(err);
		}
	}

	async function addTask(taskData: {
		list_id: number;
		title: string;
		description: string | null;
		assignee: string | null;
		due_date: string | null;
		priority: 'low' | 'medium' | 'high';
	}) {
		if (!user || !supabase) return;
		try {
			const listTasks = tasks.filter(t => t.list_id === taskData.list_id);
			const newTask = await createTask(supabase, {
				...taskData,
				sort_order: listTasks.length,
			});
			setTasks(prev => [...prev, newTask]);
		} catch (err) {
			console.error(err);
		}
	}

	async function taskUpdate(taskId: number, updates: Partial<Task>) {
		if (!user || !supabase) return;
		try {
			const updatedTask = await updateTask(supabase, taskId, updates);
			setTasks(prev => prev.map(t => (t.id === taskId ? updatedTask : t)));
		} catch (err) {
			console.error(err);
		}
	}

	async function taskDelete(taskId: number) {
		if (!user || !supabase) return;
		try {
			await deleteTask(supabase, taskId);
			setTasks(prev => prev.filter(t => t.id !== taskId));
		} catch (err) {
			console.error(err);
		}
	}

	return {
		isLoading,
		error,
		board,
		lists,
		tasks,
		boardUpdate,
		addList,
		addTask,
		taskUpdate,
		taskDelete,
	};
}
