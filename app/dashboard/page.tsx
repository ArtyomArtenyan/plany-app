'use client';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useBoards } from '@/lib/hooks/useBoards';
import { useUser } from '@clerk/nextjs';
import { Lineicons } from '@lineiconshq/react-lineicons';
import {
	DashboardSquare1Outlined,
	Funnel1Outlined,
	Layout9Stroke,
	MenuCheesburgerOutlined,
	PlusStroke,
	RefreshCircle1ClockwiseStroke,
	Search1Outlined,
	Spinner3Outlined,
} from '@lineiconshq/free-icons';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const DashboardPage = () => {
	const { user } = useUser();
	const { createBoard, boards, isLoading, error } = useBoards();
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const hendleCreateBoard = async () => {
		try {
			await createBoard({
				title: 'New Board',
				description: 'My amazing planning board',
				color: 'bg-blue-500',
			});
		} catch (error) {
			console.error('Failed to create board:', error);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />

			{error && (
				<div className='container mx-auto px-4 mt-4'>
					<div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2'>
						{error}
					</div>
				</div>
			)}

			{isLoading ? (
				<div className='flex items-center justify-center min-h-screen'>
					<Lineicons
						className='animate-spin rounded-full h-12 w-12'
						icon={Spinner3Outlined}
					/>
					Loaded Boards
				</div>
			) : (
				<main className='mx-auto py-6 sm:py-8 px-4'>
					<div className='mb-6 sm:mb-8'>
						<h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
							Welcome, {user?.firstName ?? user?.emailAddresses[0].emailAddress}
						</h1>
						<p className='text-gray-600'>
							{"Here's what's happening with your boards today."}
						</p>
					</div>

					<div className='grid grid-cols-1 mb-6 sm:mb-8 sm:grid-cols-2 gap-4 sm:gap-6'>
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
											icon={DashboardSquare1Outlined}
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

					<div className='mb-6 sm:mb-8 flex gap-2 flex-col justify-between'>
						<div className='grid grid-cols-2 sm:grid-cols-[1fr_auto_auto_auto] items-center gap-2 w-full'>
							<div className='col-span-2 sm:col-span-1'>
								<h2 className='text-xl sm:text-2xl font-bold text-gray-900'>
									Your Boards
								</h2>
								<p className='text-gray-600'>Manage your projects and tasks</p>
							</div>
							<div className='flex items-center gap-2'>
								<div className='flex items-center space-x-1 bg-white w-fit border p-1 rounded-xl'>
									<Button
										variant={viewMode === 'grid' ? 'default' : 'ghost'}
										className='transition-all duration-300'
										onClick={() => setViewMode('grid')}
									>
										<Lineicons
											icon={MenuCheesburgerOutlined}
											className={`${viewMode === 'grid' ? 'text-white' : 'text-black'} font-bold  size-5.5`}
										/>
									</Button>
									<Button
										variant={viewMode === 'list' ? 'default' : 'ghost'}
										className='transition-all duration-300'
										onClick={() => setViewMode('list')}
									>
										<Lineicons
											icon={Layout9Stroke}
											className={`${viewMode === 'list' ? 'text-white' : 'text-black'} font-bold  size-5.5`}
										/>
									</Button>
								</div>
								<Button
									variant='ghost'
									className='bg-white w-fit border p-1 rounded-xl  py-5 px-4 border-border'
								>
									<Lineicons icon={Funnel1Outlined} className='size-5.5' />
									Filter
								</Button>
							</div>
							<Button
								onClick={hendleCreateBoard}
								className='
							col-span-2 sm:col-span-1 w-full sm:w-auto rounded-xl py-5 px-4'
							>
								<Lineicons icon={PlusStroke} className='mr-1 size-5.5' /> Create
								Dashboard
							</Button>
							<div className='relative col-span-2 sm:col-span-4'>
								<Lineicons
									className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4'
									icon={Search1Outlined}
								/>
								<Input
									className='w-full pl-10'
									placeholder='Search boards...'
								/>
							</div>
						</div>

						<div className=''>
							{boards.length === 0 ? (
								<div className='flex items-center justify-center my-10 '>
									<h2>No Boards Yet</h2>
								</div>
							) : viewMode === 'list' ? (
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
									{boards.map(board => (
										<Link href={`boards/${board.id}`} key={board.id}>
											<Card className='hover:shadow-lg transition-shadow duration-300 mt-3'>
												<CardHeader className='pb-3'>
													<div className='flex items-center justify-between'>
														<div className={`w-4 h-4 rounded ${board.color}`} />
														<Badge
															variant={'secondary'}
															className='text-xs rounded'
														>
															New
														</Badge>
													</div>
												</CardHeader>
												<CardContent className='p-4 sm:p-6'>
													<CardTitle className='text-base sm:text-lg mb-2'>
														{board.title}
													</CardTitle>
													<CardDescription className='mb-4 text-sm'>
														{board.description}
													</CardDescription>
													<div className='text-xs mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0'>
														<span>
															Created:{' '}
															{new Date(board.created_at).toLocaleDateString()}
														</span>
														<span>
															Updated:{' '}
															{new Date(board.updated_at).toLocaleDateString()}
														</span>
													</div>
												</CardContent>
											</Card>
										</Link>
									))}
								</div>
							) : (
								<div className='grid grid-cols-1 gap-3'>
									{boards.map(board => (
										<Link href={`boards/${board.id}`} key={board.id}>
											<Card className='group hover:shadow-lg transition-shadow duration-300 mt-3'>
												<CardHeader className='pb-3'>
													<div className='flex items-center justify-between'>
														<div
															className={`w-4 
														h-4 rounded ${board.color}`}
														/>
														<Badge
															variant={'secondary'}
															className='text-xs rounded'
														>
															New
														</Badge>
													</div>
												</CardHeader>
												<CardContent className='p-4 sm:p-6'>
													<CardTitle className='text-base sm:text-lg mb-2 group-hover:text-blue-500 transition-colors'>
														{board.title}
													</CardTitle>
													<CardDescription className='mb-4 text-sm'>
														{board.description}
													</CardDescription>
													<div className='text-xs mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0'>
														<span>
															Created:{' '}
															{new Date(board.created_at).toLocaleDateString()}
														</span>
														<span>
															Updated:{' '}
															{new Date(board.updated_at).toLocaleDateString()}
														</span>
													</div>
												</CardContent>
											</Card>
										</Link>
									))}
								</div>
							)}
						</div>
					</div>
				</main>
			)}
		</div>
	);
};

export default DashboardPage;
