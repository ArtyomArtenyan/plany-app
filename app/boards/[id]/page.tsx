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

	return (
		<div
			className={`min-h-screen flex flex-col transition-colors duration-700 ${board?.color ? board.color + '/10' : 'bg-[#F4F5F7]'}`}
		>
			<Navbar
				boardTitle={board?.title}
				boardDescription={board?.description}
				isEditBoard={openEditBoard}
			/>

			{error && (
				<div className='container mx-auto px-4 mt-4'>
					<div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl'>
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
							tasks={tasks}
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
								tasks={tasks.filter(t => t.list_id === activeColumn.id)}
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
