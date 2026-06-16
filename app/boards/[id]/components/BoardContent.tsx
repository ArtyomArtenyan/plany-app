'use client';

import { Lists, Task } from '@/lib/superbase/types';
import { BoardColumn } from './BoardColumn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lineicons } from '@lineiconshq/react-lineicons';
import { PlusStroke } from '@lineiconshq/free-icons';

interface BoardContentProps {
	lists: Lists[];
	tasks: Task[];
	isAddingList: boolean;
	setIsAddingList: (adding: boolean) => void;
	newListTitle: string;
	setNewListTitle: (title: string) => void;
	handleAddList: (e: React.FormEvent) => void;
	openAddTask: (listId: number) => void;
	openEditTask: (task: Task) => void;
	taskUpdate: (taskId: number, updates: Partial<Task>) => Promise<void>;
	taskDelete: (taskId?: number) => Promise<void>;
	listUpdate: (id: number, updates: Partial<Lists>) => Promise<void>;
	listDelete: (id: number) => Promise<void>;
}

export const BoardContent = ({
	lists,
	tasks,
	isAddingList,
	setIsAddingList,
	newListTitle,
	setNewListTitle,
	handleAddList,
	openAddTask,
	openEditTask,
	taskUpdate,
	taskDelete,
	listUpdate,
	listDelete,
}: BoardContentProps) => {
	return (
		<main className='flex-1 overflow-y-auto sm:overflow-x-auto sm:overflow-y-hidden custom-scrollbar'>
			<div className='flex flex-col sm:flex-row h-full p-2 xs:p-4 sm:p-8 gap-4 sm:gap-6 items-start'>
				{lists.map(list => (
					<BoardColumn
						key={list.id}
						list={list}
						tasks={tasks.filter(t => t.list_id === list.id)}
						onAddTask={openAddTask}
						onEditTask={openEditTask}
						onUpdateTask={taskUpdate}
						onDeleteTask={taskDelete}
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
									<Lineicons icon={PlusStroke} className='rotate-45 size-4' />
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
	);
};
