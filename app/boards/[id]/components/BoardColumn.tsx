import { Button } from '@/components/ui/button';
import { Lists, Task } from '@/lib/superbase/types';
import { Lineicons } from '@lineiconshq/react-lineicons';
import { MenuMeatballs1Outlined, PlusStroke } from '@lineiconshq/free-icons';
import { TaskCard } from './TaskCard';

interface BoardColumnProps {
	list: Lists;
	tasks: Task[];
	onAddTask: (listId: number) => void;
	onEditTask: (task: Task) => void;
}

export const BoardColumn = ({
	list,
	tasks,
	onAddTask,
	onEditTask,
}: BoardColumnProps) => {
	return (
		<section className='w-full sm:w-87.5 shrink-0 bg-white/80 backdrop-blur-sm rounded-[28px] flex flex-col sm:max-h-full border border-white shadow-xl shadow-gray-200/40 transition-all'>
			<div className='p-5 flex items-center justify-between'>
				<div className='flex items-center gap-2.5'>
					<h3 className='font-bold text-gray-800 tracking-wide px-1 text-sm sm:text-base uppercase'>
						{list.title}
					</h3>
					<span className='bg-gray-100 text-gray-400 px-2 py-0.5 rounded-lg text-[10px] font-bold'>
						{tasks.length}
					</span>
				</div>
				<Button
					variant='ghost'
					size='sm'
					className='size-8 p-0 rounded-lg hover:bg-gray-300/50 text-gray-500'
				>
					<Lineicons icon={MenuMeatballs1Outlined} className='size-4' />
				</Button>
			</div>

			<div className='flex-1 sm:overflow-y-auto px-3 pb-2 custom-scrollbar min-h-12.5'>
				{tasks.length === 0 ? (
					<div className='flex flex-col items-center justify-center text-gray-400 gap-2 mb-2'>
						<p className='text-[10px] font-medium uppercase tracking-widest'>
							Empty
						</p>
					</div>
				) : (
					<div className='grid grid-cols-1 gap-3 mb-2'>
						{tasks.map(task => (
							<TaskCard
								key={task.id}
								task={task}
								openEditDialog={onEditTask}
							/>
						))}
					</div>
				)}
			</div>

			<div className='p-2'>
				<Button
					variant='ghost'
					onClick={() => onAddTask(list.id)}
					className='w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-300/50 rounded-xl py-4 transition-colors group h-10'
				>
					<Lineicons
						icon={PlusStroke}
						className='mr-2 size-4 group-hover:text-blue-600'
					/>
					<span className='text-xs sm:text-sm font-bold uppercase tracking-wide'>
						Add a card
					</span>
				</Button>
			</div>
		</section>
	);
};
