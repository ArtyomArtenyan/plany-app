'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function BoardSkeleton() {
	return (
		<Card className='animate-pulse mt-3 border-gray-200'>
			<CardHeader className='pb-3'>
				<div className='flex items-center justify-between'>
					<div className='w-4 h-4 rounded bg-gray-200' />
					<div className='w-12 h-5 rounded bg-gray-200' />
				</div>
			</CardHeader>
			<CardContent className='p-4 sm:p-6'>
				<div className='h-6 w-3/4 bg-gray-200 rounded mb-2' />
				<div className='h-4 w-full bg-gray-100 rounded mb-4' />
				<div className='h-3 w-1/2 bg-gray-100 rounded mt-2' />
			</CardContent>
		</Card>
	);
}

export function DashboardSkeleton() {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
			{[...Array(8)].map((_, i) => (
				<BoardSkeleton key={i} />
			))}
		</div>
	);
}
