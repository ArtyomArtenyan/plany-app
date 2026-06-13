import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Lineicons } from '@lineiconshq/react-lineicons';
import { Trash3Outlined } from '@lineiconshq/free-icons';
import { Badge } from '@/components/ui/badge';

interface EditTaskDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (e: React.FormEvent) => void;
	onDelete: () => void;
	taskTitle: string;
	setTaskTitle: (val: string) => void;
	taskDescription: string | null;
	setTaskDescription: (val: string | null) => void;
	taskAssignee: string | null;
	setTaskAssignee: (val: string | null) => void;
	taskDueDate: string | null;
	setTaskDueDate: (val: string | null) => void;
	taskPriority: 'low' | 'medium' | 'high';
	setTaskPriority: (val: 'low' | 'medium' | 'high') => void;
	isCompleted: boolean;
	setIsCompleted: (val: boolean) => void;
}

export const EditTaskDialog = ({
	isOpen,
	onClose,
	onSubmit,
	onDelete,
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
	isCompleted,
	setIsCompleted,
}: EditTaskDialogProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
			<DialogContent className='w-[95vw]! max-w-140! mx-auto!'>
				<DialogHeader className='flex flex-row items-center justify-between space-y-0'>
					<DialogTitle>Edit Task</DialogTitle>
				</DialogHeader>
				<Badge
					onClick={() => setIsCompleted(!isCompleted)}
					variant={`${isCompleted ? 'secondary' : 'ghost'}`}
				>
					<div
						className={`size-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gray-400'}`}
					/>
					{isCompleted ? 'Completed' : 'Mark as Done'}
				</Badge>
				<form onSubmit={onSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='editTaskTitle'>Title</Label>
						<Input
							id='editTaskTitle'
							value={taskTitle}
							onChange={e => setTaskTitle(e.target.value)}
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='editTaskDescription'>Description</Label>

						<textarea
							id='editTaskDescription'
							value={taskDescription || ''}
							onChange={e => setTaskDescription(e.target.value)}
							className='flex w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 resize-none min-h-25 max-h-60 overflow-y-auto'
						/>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='editTaskAssignee'>Assignee</Label>
							<Input
								id='editTaskAssignee'
								value={taskAssignee || ''}
								onChange={e => setTaskAssignee(e.target.value)}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='editTaskDueDate'>Due Date</Label>
							<Input
								id='editTaskDueDate'
								type='date'
								value={taskDueDate || ''}
								onChange={e => setTaskDueDate(e.target.value)}
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<Label>Priority</Label>
						<Select
							value={taskPriority}
							onValueChange={(val: 'low' | 'medium' | 'high') =>
								setTaskPriority(val)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select priority' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='low'>Low</SelectItem>
								<SelectItem value='medium'>Medium</SelectItem>
								<SelectItem value='high'>High</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='flex justify-end items-center gap-2 pt-2'>
						<Button
							variant='ghost'
							type='button'
							onClick={onDelete}
							className='mr-auto text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl'
						>
							<Lineicons icon={Trash3Outlined} className='mr-2 size-4' />
						</Button>
						<Button
							variant='secondary'
							type='button'
							onClick={onClose}
							className='rounded-xl px-6'
						>
							Cancel
						</Button>
						<Button type='submit' className='rounded-xl px-6'>
							Save Changes
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
