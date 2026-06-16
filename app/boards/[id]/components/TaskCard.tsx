'use client';
import { Task } from '@/lib/superbase/types';
import { Lineicons } from '@lineiconshq/react-lineicons';
import {
	CalendarDaysOutlined,
	RefreshUser1Stroke,
	Trash3Outlined,
} from '@lineiconshq/free-icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
	task: Task;
	openEditDialog: (task: Task) => void;
	onUpdate: (taskId: number, updates: Partial<Task>) => Promise<void>;
	onDelete: (taskId: number) => Promise<void>;
}

const priorityConfig = {
	high: { dot: 'bg-rose-500', label: 'text-rose-500' },
	medium: { dot: 'bg-amber-400', label: 'text-amber-500' },
	low: { dot: 'bg-sky-400', label: 'text-sky-500' },
};

export const TaskCard = ({
	task,
	openEditDialog,
	onUpdate,
	onDelete,
}: TaskCardProps) => {
	const priority = priorityConfig[task.priority];

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: 'Task',
			task,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className='bg-gray-100/50 border border-dashed border-gray-300 rounded-2xl h-25 w-full opacity-50'
			/>
		);
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={`group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing overflow-hidden ${task.is_completed ? 'opacity-60' : ''}`}
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
				<div className='flex items-start justify-between gap-2'>
					<div className='flex items-center gap-2 flex-1 min-w-0'>
						<button
							onClick={e => {
								e.stopPropagation();
								onUpdate(task.id, { is_completed: !task.is_completed });
							}}
							className={`shrink-0 size-5 rounded-full border-2 transition-all flex items-center justify-center ${task.is_completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 text-transparent'}`}
						>
							<div
								className={`size-1.5 rounded-full bg-current ${task.is_completed ? 'scale-125' : ''}`}
							/>
						</button>
						<p
							className={`text-sm font-bold text-gray-800 leading-snug truncate group-hover:text-gray-900 transition-colors ${task.is_completed ? 'line-through text-gray-400' : ''}`}
						>
							{task.title}
						</p>
					</div>

					<div className='flex items-center gap-1.5 shrink-0'>
						<button
							onClick={e => {
								e.stopPropagation();
								onDelete(task.id);
							}}
							className={`${task.is_completed ? 'opacity-100' : 'opacity-0'} opacity-0  p-1.5 bg-red-50 text-red-500 group-hover:bg-red-200  group-hover:text-red-700 rounded-lg transition-all`}
						>
							<Lineicons icon={Trash3Outlined} className='size-3.5' />
						</button>
						<div className='bg-gray-50 px-2 py-0.5 rounded-md flex items-center gap-1.5'>
							<div className={`size-1 rounded-full ${priority.dot}`} />
							<span
								className={`text-[9px] font-bold uppercase tracking-widest ${priority.label}`}
							>
								{task.priority}
							</span>
						</div>
					</div>
				</div>

				{task.description && (
					<p className='text-xs text-gray-400 leading-relaxed line-clamp-2 pl-7'>
						{task.description}
					</p>
				)}

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
