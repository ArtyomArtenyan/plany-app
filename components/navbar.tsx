'use client';
import Image from 'next/image';
import plany_logo from '@/public/plany-logo.svg';

const Navbar = () => {
	return (
		<header className='border-b border-white/80 bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
			<div className='container mx-auto px-4 py-3 sm:py-4 h-16 flex items-center justify-between'>
				<div className='flex items-center space-x-2'>
					<Image
						src={plany_logo}
						alt='Plany logo'
						width={40}
						height={40}
						className='w-8 h-8 sm:w-10 sm:h-10 '
					/>
					<span className='text-xl sm:text-2xl font-bold text-gray-900'>
						Plany
					</span>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
