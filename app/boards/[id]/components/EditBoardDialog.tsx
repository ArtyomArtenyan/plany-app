'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lineicons } from '@lineiconshq/react-lineicons';
import { Trash3Outlined } from '@lineiconshq/free-icons';

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

interface EditBoardDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (e: React.FormEvent) => void;
	onDelete: () => void;
	boardTitle: string;
	setBoardTitle: (title: string) => void;
	boardDescription: string;
	setBoardDescription: (desc: string) => void;
	boardColor: string;
	setBoardColor: (color: string) => void;
	isLoading: boolean;
}

export const EditBoardDialog = ({
	isOpen,
	onClose,
	onSubmit,
	onDelete,
	boardTitle,
	setBoardTitle,
	boardDescription,
	setBoardDescription,
	boardColor,
	setBoardColor,
	isLoading,
}: EditBoardDialogProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='w-[95vw]! max-w-140! mx-auto!'>
				<DialogHeader className='flex flex-row items-center justify-between space-y-0'>
					<DialogTitle>Edit Board</DialogTitle>
				</DialogHeader>
				<form onSubmit={onSubmit} className='space-y-4'>
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
							onClick={onDelete}
							className='mr-auto text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl'
						>
							<Lineicons icon={Trash3Outlined} className='mr-2 size-4' />
						</Button>
						<Button
							variant='ghost'
							type='button'
							onClick={onClose}
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
	);
};
