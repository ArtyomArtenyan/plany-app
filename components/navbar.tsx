'use client';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import plany_logo from '@/public/plany-logo.svg';
import { Button } from './ui/button';
import Link from 'next/link';
import { Lineicons } from '@lineiconshq/react-lineicons';
import { ArrowRightStroke } from '@lineiconshq/free-icons';
import { usePathname } from 'next/navigation';

const Navbar = () => {
	const { isSignedIn, user } = useUser();

	const pathName = usePathname();
	const isHomePage = pathName === '/';
	const isDashboardPage = pathName === '/dashboard';

	if (isHomePage) {
		return (
			<header className='border-b border-white/80 bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
				<div className='container mx-auto px-4 py-3 sm:py-4 h-16 flex items-center justify-between'>
					<div className='flex items-center space-x-2.5'>
						<Image src={plany_logo} alt='Plany logo' width={40} height={40} className="w-auto h-10" />
						<span className='text-xl sm:text-2xl font-bold tracking-tight text-gray-900'>
							Plany
						</span>
					</div>

					<div className='flex items-center space-x-2 sm:space-x-4'>
						{isSignedIn ? (
							<div className='flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4'>
								<span className='text-xs sm:text-sm text-gray-600 hidden sm:block'>
									Welcome,{' '}
									{user.firstName ?? user.emailAddresses[0].emailAddress}
								</span>
								<Link href='/dashboard'>
									<Button
										size='lg'
										variant='default'
										className='text-xs sm:text-sm  bg-gray-900'
									>
										Go to Dashboard <Lineicons icon={ArrowRightStroke} size={16} className="ml-2" />
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
					<div className='flex items-center space-x-2.5'>
						<Image src={plany_logo} alt='Plany logo' width={40} height={40} className="w-auto h-10" />
						<span className='text-xl sm:text-2xl font-bold tracking-tight text-gray-900'>
							Plany
						</span>
					</div>

					<div className='flex items-center space-x-2 sm:space-x-4'>
						<UserButton />
					</div>
				</div>
			</header>
		);
	}
};

export default Navbar;
