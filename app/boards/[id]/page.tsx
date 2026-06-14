'use client';

import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBoard } from '@/lib/hooks/useBoards';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Lineicons } from '@lineiconshq/react-lineicons';
import {
	PlusStroke,
	Spinner3Outlined,
	Trash3Outlined,
} from '@lineiconshq/free-icons';
import { Task } from '@/lib/superbase/types';

// Components
import { BoardColumn } from './components/BoardColumn';
import { AddTaskDialog } from './components/AddTaskDialog';
import { EditTaskDialog } from './components/EditTaskDialog';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const colors = [
	{ id: 'red', className: 'bg-red-500' },
	{ id: 'orange', className: 'bg-orange-500' },
	{ id: 'amber', className: 'bg-amber-500' },
	{ id: 'yellow', className: 'bg-yellow-500' },
	{ id: 'lime', className: 'bg-lime-500' },
	{ id: 'green', className: 'bg-green-500' },
	{ id: 'emerald', className: 'bg-emerald-500' },
	{ id: 'teal', className: 'bg-teal-500' },
	{ id: 'cyan', className: 'bg-cyan-500' },
	{ id: 'blue', className: 'bg-blue-500' },
	{ id: 'violet', className: 'bg-violet-500' },
	{ id: 'pink', className: 'bg-pink-500' },
];

const BoardPage = () => {
	const { id } = useParams<{ id: string }>();
	const {
		board,
		lists,
		tasks,
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

	const [isEditBoard, setIsEditBoard] = useState(false);
	const [boardTitle, setBoardTitle] = useState('');
	const [boardDescription, setBoardDescription] = useState('');

	const [boardColor, setBoardColor] = useState('');

	const [isAddingList, setIsAddingList] = useState(false);
	const [newListTitle, setNewListTitle] = useState('');

	const [addingTaskToList, setAddingTaskToList] = useState<number | null>(null);
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDescription, setTaskDescription] = useState<string | null>(null);
	const [taskAssignee, setTaskAssignee] = useState<string | null>(null);
	const [taskDueDate, setTaskDueDate] = useState<string | null>(null);
	const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>(
		'medium',
	);

	const [isTaskDetail, setIsTaskDetail] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isTaskCompleted, setIsTaskCompleted] = useState(false);

	// Board handlers
	const handleBoardUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!boardTitle.trim() || !board) return;
		try {
			await boardUpdate(id, {
				title: boardTitle.trim(),
				description: boardDescription.trim(),
				color: boardColor,
			});
		} catch {
		} finally {
			setIsEditBoard(false);
		}
	};

	const handleBoardDelete = async () => {
		if (
			confirm(
				`Are you sure you want to delete the board "${board?.title}"? This action cannot be undone.`,
			)
		) {
			try {
				await boardDelete(id);
				window.location.href = '/dashboard';
			} catch (err) {
				console.error(err);
			}
		}
	};

	const handleAddList = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newListTitle.trim()) return;
		await addList(newListTitle.trim());
		setNewListTitle('');
		setIsAddingList(false);
	};

	// Task handlers
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
		resetTaskForm();
		setAddingTaskToList(null);
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

		setIsTaskDetail(false);
		setSelectedTask(null);
	};

	const handleDeleteTask = async (taskId?: number) => {
		const idToDelete = taskId || selectedTask?.id;
		if (idToDelete && confirm('Are you sure you want to delete this task?')) {
			await taskDelete(idToDelete);
			setIsTaskDetail(false);
			setSelectedTask(null);
		}
	};

	const openEditDialog = (task: Task) => {
		setSelectedTask(task);
		setTaskTitle(task.title);
		setTaskDescription(task.description);
		setTaskAssignee(task.assignee);
		setTaskDueDate(task.due_date);
		setTaskPriority(task.priority);
		setIsTaskCompleted(task.is_completed);
		setIsTaskDetail(true);
	};

	const resetTaskForm = () => {
		setTaskTitle('');
		setTaskDescription(null);
		setTaskAssignee(null);
		setTaskDueDate(null);
		setTaskPriority('medium');
	};

	return (
		<div
			className={`min-h-screen flex flex-col transition-colors duration-700 ${board?.color ? board.color + '/10' : 'bg-[#F4F5F7]'}`}
		>
			<Navbar
				boardTitle={board?.title}
				boardDescription={board?.description}
				isEditBoard={() => {
					setIsEditBoard(true);
					setBoardTitle(board?.title ?? '');
					setBoardDescription(board?.description ?? '');
					setBoardColor(board?.color ?? '');
				}}
			/>

			{error && (
				<div className='container mx-auto px-4 mt-4'>
					<div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2'>
						{error}
					</div>
				</div>
			)}

			{isLoading ? (
				<div className='flex items-center justify-center min-h-screen'>
					<Lineicons
						className='animate-spin rounded-full h-12 w-12'
						icon={Spinner3Outlined}
					/>
					Loaded Lists
				</div>
			) : (
				<main className='flex-1 overflow-y-auto sm:overflow-x-auto sm:overflow-y-hidden custom-scrollbar'>
					<div className='flex flex-col sm:flex-row h-full p-2 xs:p-4 sm:p-8 gap-4 sm:gap-6 items-start'>
						{lists.map(list => (
							<BoardColumn
								key={list.id}
								list={list}
								tasks={tasks.filter(t => t.list_id === list.id)}
								onAddTask={setAddingTaskToList}
								onEditTask={openEditDialog}
								onUpdateTask={taskUpdate}
								onDeleteTask={handleDeleteTask}
								onUpdateList={listUpdate}
								onDeleteList={listDelete}
							/>
						))}

						<div className='w-full sm:w-87.5 shrink-0 mb-8 sm:mb-0'>
							{isAddingList ? (
								<div className='bg-[#EBECF0] rounded-2xl p-3 border border-gray-200 shadow-sm space-y-3 animate-in fade-in zoom-in-95 duration-200'>
									<Input
										autoFocus
										placeholder='Enter list title...'
										value={newListTitle}
										onChange={e => setNewListTitle(e.target.value)}
										onKeyDown={e => {
											if (e.key === 'Enter') handleAddList(e);
											if (e.key === 'Escape') setIsAddingList(false);
										}}
										className='bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 text-sm py-5 px-4'
									/>
									<div className='flex items-center gap-2'>
										<Button
											size='sm'
											onClick={handleAddList}
											className='rounded-xl px-5 bg-blue-600 hover:bg-blue-700 text-white border-none h-10 text-xs font-bold uppercase'
										>
											Add list
										</Button>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => setIsAddingList(false)}
											className='rounded-xl h-10 text-gray-500 hover:bg-gray-300/50'
										>
											<Lineicons
												icon={PlusStroke}
												className='rotate-45 size-4'
											/>
										</Button>
									</div>
								</div>
							) : (
								<button
									onClick={() => setIsAddingList(true)}
									className='w-full flex items-center bg-gray-200/50 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl py-4 px-6 border-2 border-dashed border-gray-300 transition-all group'
								>
									<Lineicons
										icon={PlusStroke}
										className='mr-2 size-4 group-hover:scale-110 transition-transform'
									/>
									<span className='text-sm uppercase tracking-wider'>
										Add another list
									</span>
								</button>
							)}
						</div>
					</div>
				</main>
			)}

			<AddTaskDialog
				isOpen={addingTaskToList !== null}
				onClose={() => {
					setAddingTaskToList(null);
					resetTaskForm();
				}}
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
				isOpen={isTaskDetail}
				onClose={() => {
					setIsTaskDetail(false);
					setSelectedTask(null);
					resetTaskForm();
				}}
				onSubmit={handleUpdateTask}
				onDelete={handleDeleteTask}
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

			<Dialog open={isEditBoard} onOpenChange={setIsEditBoard}>
				<DialogContent className='w-[95vw]! max-w-140! mx-auto!'>
					<DialogHeader className='flex flex-row items-center justify-between space-y-0'>
						<DialogTitle>Edit Board</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleBoardUpdate} className='space-y-4'>
						<div className='space-y-2'>
							<Label
								htmlFor='boardTitle'
								className='text-sm tracking-wider text-gray-500'
							>
								Board Title
							</Label>
							<Input
								id='boardTitle'
								value={boardTitle}
								onChange={e => setBoardTitle(e.target.value)}
								placeholder='Enter board title...'
							/>
						</div>
						<div className='space-y-2'>
							<Label
								htmlFor='editTaskDescription'
								className='text-sm tracking-wider text-gray-500'
							>
								Description
							</Label>

							<textarea
								id='editTaskDescription'
								value={boardDescription || ''}
								onChange={e => setBoardDescription(e.target.value)}
								className='flex w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 resize-none min-h-25 max-h-60 overflow-y-auto'
							/>
						</div>
						<div className='space-y-3'>
							<Label className='text-sm tracking-wider text-gray-500'>
								Board Theme
							</Label>
							<div className='grid grid-cols-6 gap-3 items-center'>
								{colors.map(color => (
									<button
										key={color.id}
										type='button'
										onClick={() => setBoardColor(color.className)}
										className={`${color.className} size-12 rounded-full transition-all active:scale-90 ${boardColor === color.className ? 'ring-2 ring-offset-2 ring-blue-500 scale-110 shadow-lg' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
									/>
								))}
							</div>
						</div>
						<div className='flex justify-end items-center gap-3 pt-4'>
							<Button
								variant='ghost'
								type='button'
								onClick={handleBoardDelete}
								className='mr-auto text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl'
							>
								<Lineicons icon={Trash3Outlined} className='mr-2 size-4' />
							</Button>
							<Button
								variant='ghost'
								type='button'
								onClick={() => setIsEditBoard(false)}
								className='rounded-xl px-6 h-12 font-bold text-gray-500'
							>
								Cancel
							</Button>
							<Button
								type='submit'
								disabled={isLoading || !boardTitle.trim()}
								className='rounded-xl px-8 h-12 font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all'
							>
								{isLoading ? 'Saving...' : 'Save Changes'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default BoardPage;
