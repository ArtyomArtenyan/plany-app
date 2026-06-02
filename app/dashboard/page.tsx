'use client';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { createBoard } from '@/lib/services';
import { useUser } from '@clerk/nextjs';
import { Plus } from 'lucide-react';

const DashboardPage = () => {
	const { user } = useUser();

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
						size='lg'
						className='w-full sm:w-auto bg-gray-900 hover:bg-gray-800 py-5 px-4'
					>
						<Plus className='size-5 mr-1' /> Create Dashboard
					</Button>
				</div>
			</main>
		</div>
	);
};

export default DashboardPage;
