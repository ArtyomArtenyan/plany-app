'use client';
import { useState, useEffect } from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import plany_logo from '@/public/plany-logo.svg';
import { Button } from './ui/button';
import Link from 'next/link';
import { Lineicons } from '@lineiconshq/react-lineicons';
import {
	ArrowLeftOutlined,
	ArrowRightStroke,
	Funnel1Outlined,
	MenuMeatballs1Outlined,
} from '@lineiconshq/free-icons';
import { usePathname } from 'next/navigation';

type BoardInfo = {
	boardTitle?: string;
	boardDescription?: string | null;
	isEditBoard?: () => void;
};
const Navbar = ({ boardTitle, boardDescription, isEditBoard }: BoardInfo) => {
	const { isSignedIn, user } = useUser();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const pathName = usePathname();
	const isHomePage = pathName === '/';
	const isDashboardPage = pathName === '/dashboard';
	const isBoardPage = pathName.startsWith('/boards');

	if (isHomePage) {
		return (
			<header className='border-b border-white/80 bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
				<div className='container mx-auto px-4 py-3 sm:py-4 h-16 flex items-center justify-between'>
					<Link
						href='/'
						className='flex items-center space-x-2.5 hover:opacity-80 transition-opacity'
					>
						<Image
							src={plany_logo}
							alt='Plany logo'
							width={40}
							height={40}
							className='w-auto h-10'
						/>
						<span className='text-xl sm:text-2xl font-bold tracking-tight text-gray-900'>
							Plany
						</span>
					</Link>

					<div className='flex items-center space-x-2 sm:space-x-4'>
						{!mounted ? (
							<div className='w-24 h-9 bg-gray-200 animate-pulse rounded-lg' />
						) : isSignedIn ? (
							<div className='flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4'>
								<span className='text-xs sm:text-sm text-gray-600 hidden sm:block'>
									Welcome,{' '}
									{user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress}
								</span>
								<Link href='/dashboard'>
									<Button
										size='lg'
										variant='default'
										className='text-xs sm:text-sm  bg-gray-900'
									>
										Go to Dashboard{' '}
										<Lineicons
											icon={ArrowRightStroke}
											size={16}
											className='ml-2'
										/>
									</Button>
								</Link>
							</div>
						) : (
							<div className='flex items-center gap-2'>
								<SignInButton>
									<Button
										size='sm'
										variant='ghost'
										className='text-xs sm:text-sm'
									>
										SignIn
									</Button>
								</SignInButton>
								<SignUpButton>
									<Button
										size='lg'
										className='text-xs sm:text-sm px-5 bg-gray-900'
									>
										SignUp
									</Button>
								</SignUpButton>
							</div>
						)}
					</div>
				</div>
			</header>
		);
	}
	if (isDashboardPage) {
		return (
			<header className='border-b border-white/80 bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
				<div className='container mx-auto px-4 py-3 sm:py-4 h-16 flex items-center justify-between'>
					<Link
						href='/'
						className='flex items-center space-x-2.5 hover:opacity-80 transition-opacity'
					>
						<Image
							src={plany_logo}
							alt='Plany logo'
							width={40}
							height={40}
							className='w-auto h-10'
						/>
						<span className='text-xl sm:text-2xl font-bold tracking-tight text-gray-900'>
							Plany
						</span>
					</Link>

					<div className='flex items-center space-x-2 sm:space-x-4'>
						{mounted ? (
							<UserButton />
						) : (
							<div className='w-8 h-8 rounded-full bg-gray-200 animate-pulse' />
						)}
					</div>
				</div>
			</header>
		);
	}
	if (isBoardPage) {
		return (
			<header className='border-b border-white/80 bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
				<div className='container mx-auto px-2 sm:px-4 py-3 sm:py-4 h-16 flex items-center justify-between gap-1 sm:gap-2'>
					<div className='group flex items-center space-x-1.5 sm:space-x-2.5'>
						<Link
							href={'/dashboard'}
							className='flex items-center gap-1.5 sm:gap-3'
						>
							<Lineicons
								className='text-gray-600 group-hover:text-gray-900 transition-colors size-4 sm:size-5'
								icon={ArrowLeftOutlined}
							/>
							<span className='hidden sm:inline text-gray-600 group-hover:text-gray-900 transition-colors'>
								Back to Dashboard
							</span>
							<span className='hidden xs:inline sm:hidden text-gray-600 group-hover:text-gray-900 transition-colors'>
								Back
							</span>
						</Link>
						<div className='w-px h-5 bg-gray-300 group-hover:bg-gray-900 hidden xs:block' />
						<Link
							href='/'
							className='shrink-0 hover:opacity-80 transition-opacity'
						>
							<Image
								src={plany_logo}
								alt='Plany logo'
								width={32}
								height={32}
								className='size-7 sm:size-10'
							/>
						</Link>
						<div className='flex flex-col min-w-0'>
							<span className='text-xs sm:text-lg font-bold text-gray-900 truncate max-w-20 xs:max-w-[120px] sm:max-w-none'>
								{boardTitle}
							</span>
							{boardDescription && (
								<span className='text-[10px] text-gray-500 truncate max-w-[100px] xs:max-w-[150px] sm:max-w-[300px] -mt-1'>
									{boardDescription}
								</span>
							)}
						</div>
						<Button
							variant={'ghost'}
							onClick={isEditBoard}
							className='size-8 p-0 shrink-0'
						>
							<Lineicons icon={MenuMeatballs1Outlined} className='size-4' />
						</Button>
					</div>
					<div className='flex items-center gap-1 sm:gap-8'>
						<Button
							variant='ghost'
							className='w-fit p-1 rounded-xl py-4 sm:py-5 px-2 sm:px-4'
						>
							<Lineicons
								icon={Funnel1Outlined}
								className='size-4.5 sm:size-5.5'
							/>
							<span className='hidden sm:inline'>Filter</span>
						</Button>
						<div className='flex items-center space-x-1 sm:space-x-4'>
							{mounted ? (
								<UserButton />
							) : (
								<div className='w-8 h-8 rounded-full bg-gray-200 animate-pulse' />
							)}
						</div>
					</div>
				</div>
			</header>
		);
	}
	return null;
};

export default Navbar;
