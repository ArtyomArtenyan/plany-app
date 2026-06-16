'use client';

import { useState } from 'react';
import {
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragOverEvent,
	DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Lists, Task } from '../superbase/types';

interface UseBoardDndProps {
	lists: Lists[];
	setLists: (lists: Lists[]) => void;
	tasks: Task[];
	setTasks: (tasks: (prev: Task[]) => Task[]) => void;
	listUpdate: (id: number, updates: Partial<Lists>) => Promise<void>;
	taskUpdate: (id: number, updates: Partial<Task>) => Promise<void>;
}

export const useBoardDnd = ({
	lists,
	setLists,
	tasks,
	setTasks,
	listUpdate,
	taskUpdate,
}: UseBoardDndProps) => {
	const [activeColumn, setActiveColumn] = useState<Lists | null>(null);
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const activeData = active.data.current;

		if (activeData?.type === 'Column') {
			setActiveColumn(activeData.list);
		} else if (activeData?.type === 'Task') {
			setActiveTask(activeData.task);
		}
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;

		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		const activeData = active.data.current;
		const overData = over.data.current;

		if (!activeData || !overData) return;

		if (activeData.type !== 'Task') return;
		if (overData.type !== 'Task') return;

		const isActiveATask = activeData.type === 'Task';
		const isOverATask = overData.type === 'Task';

		if (isActiveATask && isOverATask) {
			const activeTask = activeData.task;
			const overTask = overData.task;

			if (activeTask.list_id !== overTask.list_id) {
				setTasks(prev => {
					const activeIndex = prev.findIndex(t => t.id === activeId);
					const overIndex = prev.findIndex(t => t.id === overId);

					const updated = [...prev];
					if (activeIndex !== -1 && overIndex !== -1) {
						updated[activeIndex] = {
							...updated[activeIndex],
							list_id: overTask.list_id,
						};
						return arrayMove(updated, activeIndex, overIndex);
					}
					return prev;
				});
			}
		}

		const isOverAColumn = overData.type === 'Column';
		if (isActiveATask && isOverAColumn) {
			const activeTask = activeData.task;
			const overColumn = overData.list;

			if (activeTask.list_id !== overColumn.id) {
				setTasks(prev => {
					const activeIndex = prev.findIndex(t => t.id === activeId);
					const updated = [...prev];
					if (activeIndex !== -1) {
						updated[activeIndex] = {
							...updated[activeIndex],
							list_id: overColumn.id,
						};
						return arrayMove(updated, activeIndex, activeIndex);
					}
					return prev;
				});
			}
		}
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		setActiveColumn(null);
		setActiveTask(null);

		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		const activeData = active.data.current;
		const overData = over.data.current;

		if (!activeData || !overData) return;

		if (activeData.type === 'Column') {
			if (activeId === overId) return;

			const oldIndex = lists.findIndex(l => l.id === activeId);
			const newIndex = lists.findIndex(l => l.id === overId);

			const newLists = arrayMove(lists, oldIndex, newIndex);

			setLists(newLists);

			await Promise.all(
				newLists.map((l, index) => listUpdate(l.id, { sort_order: index })),
			);

			return;
		}

		if (activeData.type === 'Task') {
			const activeTask = activeData.task;

			const overTask = overData.type === 'Task' ? overData.task : null;
			const overColumn = overData.type === 'Column' ? overData.list : null;

			const sourceListId = activeTask.list_id;
			const destListId = overTask?.list_id ?? overColumn?.id;

			if (!destListId) return;

			if (sourceListId === destListId && activeId === overId) return;

			let updated = [...tasks];

			const fromIndex = updated.findIndex(t => t.id === activeId);
			const toIndex = updated.findIndex(t => t.id === overId);

			if (fromIndex !== -1 && toIndex !== -1) {
				updated = arrayMove(updated, fromIndex, toIndex);
			}

			updated = updated.map(t =>
				t.id === activeId ? { ...t, list_id: destListId } : t,
			);

			setTasks(() => updated);

			const destTasks = updated
				.filter(t => t.list_id === destListId)
				.map((t, i) => ({
					...t,
					sort_order: i,
				}));

			const sourceTasks =
				sourceListId !== destListId
					? updated
							.filter(t => t.list_id === sourceListId)
							.map((t, i) => ({
								...t,
								sort_order: i,
							}))
					: [];

			try {
				await Promise.all([
					...destTasks.map((t, i) =>
						taskUpdate(t.id, {
							list_id: destListId,
							sort_order: i,
						}),
					),
					...sourceTasks.map((t, i) =>
						taskUpdate(t.id, {
							sort_order: i,
						}),
					),
				]);
			} catch (err) {
				console.error('Task reorder failed:', err);
			}
		}
	};

	return {
		activeColumn,
		activeTask,
		sensors,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	};
};
