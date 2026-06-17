'use client';

export function TaskSkeleton() {
	return (
		<div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 animate-pulse'>
			<div className='flex justify-between items-start mb-2'>
				<div className='h-5 w-2/3 bg-gray-100 rounded' />
				<div className='h-4 w-4 bg-gray-100 rounded' />
			</div>
			<div className='h-3 w-full bg-gray-50 rounded mb-4' />
			<div className='flex justify-between items-center'>
				<div className='h-4 w-16 bg-gray-50 rounded' />
				<div className='h-4 w-20 bg-gray-50 rounded' />
			</div>
		</div>
	);
}

export function ListSkeleton() {
	return (
		<div className='w-full sm:w-87.5 shrink-0 bg-[#EBECF0]/50 rounded-2xl p-4 animate-pulse'>
			<div className='h-6 w-1/2 bg-gray-200 rounded mb-6' />
			<div className='space-y-3'>
				{[...Array(3)].map((_, i) => (
					<TaskSkeleton key={i} />
				))}
			</div>
			<div className='h-10 w-full bg-gray-200/50 rounded-xl mt-4' />
		</div>
	);
}

export function BoardPageSkeleton() {
	return (
		<div className='flex flex-col sm:flex-row h-full p-2 xs:p-4 sm:p-8 gap-4 sm:gap-6 items-start animate-pulse'>
			{[...Array(3)].map((_, i) => (
				<ListSkeleton key={i} />
			))}
		</div>
	);
}
