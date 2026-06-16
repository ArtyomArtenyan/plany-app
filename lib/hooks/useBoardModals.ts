'use client';

import { useState } from 'react';
import { Board, Task } from '../superbase/types';

export const useBoardModals = (board: Board | null) => {
	// Board Edit States
	const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
	const [boardTitle, setBoardTitle] = useState('');
	const [boardDescription, setBoardDescription] = useState('');
	const [boardColor, setBoardColor] = useState('');

	// List Add States
	const [isAddingList, setIsAddingList] = useState(false);
	const [newListTitle, setNewListTitle] = useState('');

	// Task Add States
	const [addingTaskToList, setAddingTaskToList] = useState<number | null>(null);
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDescription, setTaskDescription] = useState<string | null>(null);
	const [taskAssignee, setTaskAssignee] = useState<string | null>(null);
	const [taskDueDate, setTaskDueDate] = useState<string | null>(null);
	const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>(
		'medium',
	);

	// Task Edit States
	const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isTaskCompleted, setIsTaskCompleted] = useState(false);

	const openEditBoard = () => {
		setIsEditBoardOpen(true);
		setBoardTitle(board?.title ?? '');
		setBoardDescription(board?.description ?? '');
		setBoardColor(board?.color ?? '');
	};

	const closeEditBoard = () => {
		setIsEditBoardOpen(false);
	};

	const openAddTask = (listId: number) => {
		setAddingTaskToList(listId);
		resetTaskForm();
	};

	const closeAddTask = () => {
		setAddingTaskToList(null);
		resetTaskForm();
	};

	const openEditTask = (task: Task) => {
		setSelectedTask(task);
		setTaskTitle(task.title);
		setTaskDescription(task.description);
		setTaskAssignee(task.assignee);
		setTaskDueDate(task.due_date);
		setTaskPriority(task.priority);
		setIsTaskCompleted(task.is_completed);
		setIsTaskDetailOpen(true);
	};

	const closeEditTask = () => {
		setIsTaskDetailOpen(false);
		setSelectedTask(null);
		resetTaskForm();
	};

	const resetTaskForm = () => {
		setTaskTitle('');
		setTaskDescription(null);
		setTaskAssignee(null);
		setTaskDueDate(null);
		setTaskPriority('medium');
		setIsTaskCompleted(false);
	};

	return {
		// Board
		isEditBoardOpen,
		setIsEditBoardOpen,
		boardTitle,
		setBoardTitle,
		boardDescription,
		setBoardDescription,
		boardColor,
		setBoardColor,
		openEditBoard,
		closeEditBoard,

		// List
		isAddingList,
		setIsAddingList,
		newListTitle,
		setNewListTitle,

		// Add Task
		addingTaskToList,
		setAddingTaskToList,
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

		// Edit Task
		isTaskDetailOpen,
		setIsTaskDetailOpen,
		selectedTask,
		setSelectedTask,
		isTaskCompleted,
		setIsTaskCompleted,
		openEditTask,
		closeEditTask,
	};
};
