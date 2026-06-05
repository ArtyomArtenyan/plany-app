'use client';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useBoards } from '@/lib/hooks/useBoards';
import { useUser } from '@clerk/nextjs';
import { Lineicons } from '@lineiconshq/react-lineicons';
import {
	Layout9Stroke,
	PlusStroke,
	RefreshCircle1ClockwiseStroke,
	Spinner3Outlined,
} from '@lineiconshq/free-icons';
import { Card, CardContent } from '@/components/ui/card';

const DashboardPage = () => {
	const { user } = useUser();
	const { createBoard, boards, loaded, error } = useBoards();
	const hendleCreateBoard = async () => {
		try {
			await createBoard({
				title: 'New Board',
				description: 'My amazing planning board',
				color: '#2563EB',
			});
		} catch (error) {
			console.error('Failed to create board:', error);
		}
	};
	console.log(boards);

	if (loaded) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<Lineicons
					className='animate-spin rounded-full h-12 w-12'
					icon={Spinner3Outlined}
				/>
				Loaded Board
			</div>
		);
	}
	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<h2>Error loading boards</h2>
			</div>
		);
	}
	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />
			<main className='mx-auto py-6 sm:py-8 px-4'>
				<div className='mb-6 sm:mb-8'>
					<h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
						Welcome, {user?.firstName ?? user?.emailAddresses[0].emailAddress}
					</h1>
					<p className='text-gray-600'>
						Here's what's happening with your boards today.
					</p>
					<Button
						onClick={hendleCreateBoard}
						size='lg'
						className='w-full sm:w-auto bg-gray-900 hover:bg-gray-800 py-5 px-4'
					>
						<Lineicons icon={PlusStroke} className='mr-1 size-6' /> Create
						Dashboard
					</Button>
				</div>

				<div className='grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6'>
					<Card>
						<CardContent className='p-4 sm:p-6'>
							<div className='flex items-center justify-between'>
								<div className=''>
									<p className='text-xs sm:text-sm '>Total Boards</p>
									<p className='text-xl sm:text-2xl font-bold text-gray-900'>
										{boards.length}
									</p>
								</div>
								<div className='p-2 bg-blue-200 rounded-lg'>
									<Lineicons
										icon={Layout9Stroke}
										size={24}
										className='text-gray-600'
									/>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-4 sm:p-6'>
							<div className='flex items-center justify-between'>
								<div className=''>
									<p className='text-xs sm:text-sm '>Recent Activity</p>
									<p className='text-xl sm:text-2xl font-bold text-gray-900'>
										{
											boards.filter(board => {
												const sevenDaysAgo = new Date();
												sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
												const boardUpdatedAt = new Date(board.created_at);
												return boardUpdatedAt > sevenDaysAgo;
											}).length
										}
									</p>
								</div>
								<div className='p-2 bg-purple-200 rounded-lg'>
									<Lineicons
										icon={RefreshCircle1ClockwiseStroke}
										size={24}
										className='text-gray-600'
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
};

export default DashboardPage;
