'use client';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBoard } from '@/lib/hooks/useBoards';
import { useParams } from 'next/navigation';
import { useState } from 'react';

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
	const { board, list, loaded, error, boardUpdate } = useBoard(id);
	const [isEditBoard, setIsEditBoard] = useState(false);
	const [boardTitle, setBoardTitle] = useState('');
	const [boardColor, setBoardColor] = useState('');

	const handleUpdatedBoard = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!boardTitle.trim() || !board) return;
		try {
			await boardUpdate(id, {
				title: boardTitle.trim(),
				color: boardColor,
			});
		} catch {
		} finally {
			setIsEditBoard(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar
				boardTitle={board?.title}
				isEditBoard={() => {
					setIsEditBoard(true);
					setBoardTitle(board?.title ?? '');
					setBoardColor(board?.color ?? '');
				}}
			/>

			{error && (
				<div className='container mx-auto px-4 mt-4'>
					<div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl'>
						{error}
					</div>
				</div>
			)}

			{loaded && !board ? (
				<div className='flex items-center justify-center h-[calc(100vh-64px)]'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
				</div>
			) : (
				<div className='container mx-auto px-4 py-6'></div>
			)}

			<Dialog open={isEditBoard} onOpenChange={setIsEditBoard}>
				<DialogContent className='w-[95vw]! max-w-110! mx-auto!'>
					<DialogTitle className='my-2'>Edit Board</DialogTitle>
					<form onSubmit={handleUpdatedBoard} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='boardTitle'>Board Title</Label>
							<Input
								id='boardTitle'
								value={boardTitle}
								onChange={e => setBoardTitle(e.target.value)}
								required
								disabled={loaded}
							/>
						</div>

						<div className='grid grid-cols-4 sm:grid-cols-6 gap-2'>
							{colors.map(color => (
								<button
									key={color.id}
									type='button'
									disabled={loaded}
									onClick={() => setBoardColor(color.className)}
									className={`${color.className} size-9 rounded-full transition-transform active:scale-90 ${boardColor === color.className ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-105'}`}
								/>
							))}
						</div>
						<div className='flex justify-end items-center gap-2 '>
							<Button
								className='p-1 rounded-xl  py-4.5 px-4 my-2'
								variant='secondary'
								type='button'
								onClick={() => setIsEditBoard(false)}
								disabled={loaded}
							>
								Cancel
							</Button>
							<Button
								className=' p-1 rounded-xl  py-4.5 px-4 my-2'
								type='submit'
								disabled={loaded || !boardTitle.trim()}
							>
								{loaded ? 'Saving...' : 'Save Changes'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default BoardPage;
