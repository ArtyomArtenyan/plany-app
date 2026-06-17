'use client';

import Navbar from '@/components/navbar';
import { useBoard } from '@/lib/hooks/useBoards';
import { useBoardModals } from '@/lib/hooks/useBoardModals';
import { useBoardDnd } from '@/lib/hooks/useBoardDnd';
import { useParams } from 'next/navigation';
import { Lineicons } from '@lineiconshq/react-lineicons';
import { Spinner3Outlined } from '@lineiconshq/free-icons';

// Components
import { BoardColumn } from './components/BoardColumn';
import { TaskCard } from './components/TaskCard';
import { AddTaskDialog } from './components/AddTaskDialog';
import { EditTaskDialog } from './components/EditTaskDialog';
import { EditBoardDialog } from './components/EditBoardDialog';
import { BoardContent } from './components/BoardContent';

import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import {
	SortableContext,
	horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';

import { BoardPageSkeleton } from '@/components/skeletons/BoardSkeleton';

const BoardPage = () => {
	const { id } = useParams<{ id: string }>();
	const {
		board,
		lists,
		setLists,
		tasks,
		setTasks,
		isLoading,
		error,
		boardUpdate,
		boardDelete,
		addList,
		listUpdate,
		listDelete,
		addTask,
		taskUpdate,
		taskDelete,
	} = useBoard(id);

	const {
		isEditBoardOpen,
		boardTitle,
		setBoardTitle,
		boardDescription,
		setBoardDescription,
		boardColor,
		setBoardColor,
		openEditBoard,
		closeEditBoard,
		isAddingList,
		setIsAddingList,
		newListTitle,
		setNewListTitle,
		addingTaskToList,
		taskTitle,
		setTaskTitle,
		taskDescription,
		setTaskDescription,
		taskAssignee,
		setTaskAssignee,
		taskDueDate,
		setTaskDueDate,
		taskPriority,
		setTaskPriority,
		openAddTask,
		closeAddTask,
		isTaskDetailOpen,
		selectedTask,
		isTaskCompleted,
		setIsTaskCompleted,
		openEditTask,
		closeEditTask,
	} = useBoardModals(board);

	const [priorityFilter, setPriorityFilter] = useState<
		'all' | 'low' | 'medium' | 'high'
	>('all');

	const {
		activeColumn,
		activeTask,
		sensors,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	} = useBoardDnd({
		lists,
		setLists,
		tasks,
		setTasks,
		listUpdate,
		taskUpdate,
	});

	// Handlers
	const handleBoardUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!boardTitle.trim() || !board) return;
		await boardUpdate(id, {
			title: boardTitle.trim(),
			description: boardDescription.trim(),
			color: boardColor,
		});
		closeEditBoard();
	};

	const handleBoardDelete = async () => {
		if (
			confirm(
				`Are you sure you want to delete the board "${board?.title}"? This action cannot be undone.`,
			)
		) {
			await boardDelete(id);
			window.location.href = '/dashboard';
		}
	};

	const handleAddList = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newListTitle.trim()) return;
		await addList(newListTitle.trim());
		setNewListTitle('');
		setIsAddingList(false);
	};

	const handleAddTask = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!taskTitle.trim() || addingTaskToList === null) return;
		await addTask({
			list_id: addingTaskToList,
			title: taskTitle.trim(),
			description: taskDescription,
			assignee: taskAssignee,
			due_date: taskDueDate,
			priority: taskPriority,
		});
		closeAddTask();
	};

	const handleUpdateTask = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedTask || !taskTitle.trim()) return;
		await taskUpdate(selectedTask.id, {
			title: taskTitle.trim(),
			description: taskDescription,
			assignee: taskAssignee,
			due_date: taskDueDate,
			priority: taskPriority,
			is_completed: isTaskCompleted,
		});
		closeEditTask();
	};

	const handleDeleteTask = async (taskId?: number) => {
		const idToDelete = taskId || selectedTask?.id;
		if (idToDelete && confirm('Are you sure you want to delete this task?')) {
			await taskDelete(idToDelete);
			closeEditTask();
		}
	};

	const filteredTasks = tasks.filter(task => {
		if (priorityFilter === 'all') return true;
		return task.priority === priorityFilter;
	});

	const stats = {
		total: tasks.length,
		completed: tasks.filter(t => t.is_completed).length,
		high: tasks.filter(t => t.priority === 'high').length,
		medium: tasks.filter(t => t.priority === 'medium').length,
		low: tasks.filter(t => t.priority === 'low').length,
	};

	return (
		<div
			className={`min-h-screen flex flex-col transition-colors duration-700 ${board?.color ? board.color + '/10' : 'bg-[#F4F5F7]'}`}
		>
			<Navbar
				boardTitle={board?.title}
				boardDescription={board?.description}
				isEditBoard={openEditBoard}
				priorityFilter={priorityFilter}
				setPriorityFilter={setPriorityFilter as any}
			/>

			<div className='bg-white/40 backdrop-blur-sm border-b border-gray-200/50 py-2 px-4 sm:px-8'>
				<div className='container mx-auto flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-gray-600'>
					<div className='flex items-center gap-2'>
						<span className='font-semibold text-gray-900'>Total Tasks:</span>
						<span className='bg-gray-200/50 px-2 py-0.5 rounded-full'>{stats.total}</span>
					</div>
					<div className='flex items-center gap-2'>
						<span className='font-semibold text-gray-900'>Completed:</span>
						<span className='bg-green-100 text-green-700 px-2 py-0.5 rounded-full'>
							{stats.completed} / {stats.total}
						</span>
					</div>
					<div className='hidden md:flex items-center gap-4 border-l border-gray-300 pl-8'>
						<div className='flex items-center gap-1.5'>
							<div className='size-2 rounded-full bg-red-500' />
							<span>High: {stats.high}</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<div className='size-2 rounded-full bg-yellow-500' />
							<span>Medium: {stats.medium}</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<div className='size-2 rounded-full bg-blue-500' />
							<span>Low: {stats.low}</span>
						</div>
					</div>
					<div className='ml-auto hidden lg:block text-gray-400'>
						Last updated: {board ? new Date(board.updated_at).toLocaleDateString() : '...'}
					</div>
				</div>
			</div>

			{error && (
				<div className='container mx-auto px-4 mt-4'>
					<div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl'>
						{error}
					</div>
				</div>
			)}

			{isLoading ? (
				<main className='flex-1 overflow-hidden'>
					<BoardPageSkeleton />
				</main>
			) : (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCorners}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={lists.map(l => l.id)}
						strategy={horizontalListSortingStrategy}
					>
						<BoardContent
							lists={lists}
							tasks={filteredTasks}
							isAddingList={isAddingList}
							setIsAddingList={setIsAddingList}
							newListTitle={newListTitle}
							setNewListTitle={setNewListTitle}
							handleAddList={handleAddList}
							openAddTask={openAddTask}
							openEditTask={openEditTask}
							taskUpdate={taskUpdate}
							taskDelete={handleDeleteTask}
							listUpdate={listUpdate}
							listDelete={listDelete}
						/>
					</SortableContext>
					<DragOverlay>
						{activeColumn ? (
							<BoardColumn
								list={activeColumn}
								tasks={filteredTasks.filter(t => t.list_id === activeColumn.id)}
								onAddTask={() => {}}
								onEditTask={() => {}}
								onUpdateTask={async () => {}}
								onDeleteTask={async () => {}}
								onUpdateList={async () => {}}
								onDeleteList={async () => {}}
							/>
						) : activeTask ? (
							<TaskCard
								task={activeTask}
								openEditDialog={() => {}}
								onUpdate={async () => {}}
								onDelete={async () => {}}
							/>
						) : null}
					</DragOverlay>
				</DndContext>
			)}

			<AddTaskDialog
				isOpen={addingTaskToList !== null}
				onClose={closeAddTask}
				onSubmit={handleAddTask}
				taskTitle={taskTitle}
				setTaskTitle={setTaskTitle}
				taskDescription={taskDescription}
				setTaskDescription={setTaskDescription}
				taskAssignee={taskAssignee}
				setTaskAssignee={setTaskAssignee}
				taskDueDate={taskDueDate}
				setTaskDueDate={setTaskDueDate}
				taskPriority={taskPriority}
				setTaskPriority={setTaskPriority}
			/>

			<EditTaskDialog
				isOpen={isTaskDetailOpen}
				onClose={closeEditTask}
				onSubmit={handleUpdateTask}
				onDelete={() => handleDeleteTask()}
				taskTitle={taskTitle}
				setTaskTitle={setTaskTitle}
				taskDescription={taskDescription}
				setTaskDescription={setTaskDescription}
				taskAssignee={taskAssignee}
				setTaskAssignee={setTaskAssignee}
				taskDueDate={taskDueDate}
				setTaskDueDate={setTaskDueDate}
				taskPriority={taskPriority}
				setTaskPriority={setTaskPriority}
				isCompleted={isTaskCompleted}
				setIsCompleted={setIsTaskCompleted}
			/>

			<EditBoardDialog
				isOpen={isEditBoardOpen}
				onClose={closeEditBoard}
				onSubmit={handleBoardUpdate}
				onDelete={handleBoardDelete}
				boardTitle={boardTitle}
				setBoardTitle={setBoardTitle}
				boardDescription={boardDescription}
				setBoardDescription={setBoardDescription}
				boardColor={boardColor}
				setBoardColor={setBoardColor}
				isLoading={isLoading}
			/>
		</div>
	);
};

export default BoardPage;
