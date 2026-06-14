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

interface AddTaskDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (e: React.FormEvent) => void;
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
}

export const AddTaskDialog = ({
	isOpen,
	onClose,
	onSubmit,
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
}: AddTaskDialogProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
			<DialogContent className='w-[95vw]! max-w-140! mx-auto!'>
				<DialogHeader>
					<DialogTitle>Add New Card</DialogTitle>
				</DialogHeader>
				<form onSubmit={onSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='taskTitle'>Title</Label>
						<Input
							id='taskTitle'
							value={taskTitle}
							onChange={e => setTaskTitle(e.target.value)}
							placeholder='Enter card title...'
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='taskDescription'>Description</Label>
						<textarea
							id='taskDescription'
							value={taskDescription || ''}
							onChange={e => setTaskDescription(e.target.value)}
							className='flex w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 resize-none min-h-25 max-h-60 overflow-y-auto'
						/>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='taskAssignee'>Assignee</Label>
							<Input
								id='taskAssignee'
								value={taskAssignee || ''}
								onChange={e => setTaskAssignee(e.target.value)}
								placeholder='Name or email...'
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='taskDueDate'>Due Date</Label>
							<Input
								id='taskDueDate'
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
							variant='secondary'
							type='button'
							onClick={onClose}
							className='rounded-xl px-6'
						>
							Cancel
						</Button>
						<Button type='submit' className='rounded-xl px-6'>
							Create Card
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
