import { Task } from '@/lib/superbase/types';
import { Lineicons } from '@lineiconshq/react-lineicons';
import {
	Trash3Outlined,
	CalendarDaysOutlined,
	RefreshUser1Stroke,
} from '@lineiconshq/free-icons';

interface TaskCardProps {
	task: Task;
	openEditDialog: (task: Task) => void;
}

const priorityConfig = {
	high: { dot: 'bg-rose-500', label: 'text-rose-500' },
	medium: { dot: 'bg-amber-400', label: 'text-amber-500' },
	low: { dot: 'bg-sky-400', label: 'text-sky-500' },
};

export const TaskCard = ({ task, openEditDialog }: TaskCardProps) => {
	const priority = priorityConfig[task.priority];

	return (
		<div
			className='group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg shadow-sm transition-all duration-200 cursor-pointer overflow-hidden active:scale-[0.98]'
			onClick={() => openEditDialog(task)}
		>
			<div
				className={`absolute top-0 left-0 w-full h-0.75 ${
					task.priority === 'high'
						? 'bg-rose-400'
						: task.priority === 'medium'
							? 'bg-amber-400'
							: 'bg-sky-400'
				} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
			/>

			<div className='p-4 flex flex-col gap-3'>
				{/* Top row */}
				<div className='flex items-start justify-between gap-2'>
					<div className='flex items-center gap-1 flex-1 min-w-0'>
						<p className='text-sm font-bold text-gray-800 leading-snug truncate group-hover:text-gray-900 transition-colors'>
							{task.title}
						</p>
					</div>

					<div className='flex items-center gap-1.5 shrink-0 bg-gray-50 px-2 py-0.5 rounded-md'>
						<div className={`size-1 rounded-full ${priority.dot}`} />
						<span
							className={`text-[9px] font-bold uppercase tracking-widest ${priority.label}`}
						>
							{task.priority}
						</span>
					</div>
				</div>

				{/* Description */}
				{task.description && (
					<p className='text-xs text-gray-400 leading-relaxed line-clamp-2 pl-7'>
						{task.description}
					</p>
				)}

				{/* Bottom row */}
				<div className='flex items-center justify-between pl-7'>
					{task.due_date ? (
						<div className='flex items-center gap-1 text-gray-400'>
							<Lineicons icon={CalendarDaysOutlined} className='size-3' />
							<span className='text-[10px] font-medium'>
								{new Date(task.due_date).toLocaleDateString(undefined, {
									month: 'short',
									day: 'numeric',
								})}
							</span>
						</div>
					) : (
						<span />
					)}

					{task.assignee ? (
						<div
							className='size-6 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm'
							title={task.assignee}
						>
							<span className='text-[10px] font-bold text-white uppercase'>
								{task.assignee.substring(0, 2)}
							</span>
						</div>
					) : (
						<div className='size-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300'>
							<Lineicons icon={RefreshUser1Stroke} className='size-3.5' />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
