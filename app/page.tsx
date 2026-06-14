'use client';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Lineicons } from '@lineiconshq/react-lineicons';
import {
	ArrowRightStroke,
	Layout9Stroke,
	PlusStroke,
} from '@lineiconshq/free-icons';
import Link from 'next/link';
import Image from 'next/image';
import plany_logo from '@/public/plany-logo.svg';

export default function Home() {
	const { isSignedIn } = useUser();

	return (
		<div className='min-h-screen bg-white'>
			<Navbar />

			<main>
				{/* Hero Section */}
				<section className='relative pt-20 pb-32 overflow-hidden'>
					<div className='container mx-auto px-4 relative z-10'>
						<div className='max-w-4xl mx-auto text-center'>
							<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8 border border-blue-100'>
								<span className='relative flex h-2 w-2'>
									<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
									<span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500'></span>
								</span>
								Manage your tasks better
							</div>

							<h1 className='text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 mb-8'>
								Organize your work with{' '}
								<span className='text-blue-600'>Plany</span>
							</h1>

							<p className='text-xl text-gray-600 mb-10 max-w-2xl mx-auto'>
								A simple, beautiful, and responsive Kanban board to keep your
								projects on track. Manage lists, tasks, and teams all in one
								place.
							</p>

							<div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
								{isSignedIn ? (
									<Link href='/dashboard'>
										<Button
											size='lg'
											className='h-14 px-8 text-lg bg-gray-900 rounded-2xl'
										>
											Go to Dashboard
											<Lineicons
												icon={ArrowRightStroke}
												className='ml-2 size-5'
											/>
										</Button>
									</Link>
								) : (
									<>
										<SignInButton mode='redirect' forceRedirectUrl='/dashboard'>
											<Button
												size='lg'
												className='h-14 px-8 text-lg bg-gray-900 rounded-2xl w-full sm:w-auto'
											>
												Get Started for Free
											</Button>
										</SignInButton>
										<Button
											variant='outline'
											size='lg'
											className='h-14 px-8 text-lg rounded-2xl w-full sm:w-auto'
										>
											View Demo
										</Button>
									</>
								)}
							</div>
						</div>
					</div>

					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none'>
						<div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl' />
						<div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-3xl' />
					</div>
				</section>

				<section className='py-20 bg-gray-50 border-y border-gray-200'>
					<div className='container mx-auto px-4'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
							<div className='bg-white p-8 rounded-3xl border border-gray-200 shadow-sm'>
								<div className='w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6'>
									<Lineicons
										icon={Layout9Stroke}
										className='text-blue-600 size-6'
									/>
								</div>
								<h3 className='text-xl font-bold mb-3'>Intuitive Kanban</h3>
								<p className='text-gray-600'>
									Drag and drop tasks across customizable lists. Visualize your
									workflow at a glance.
								</p>
							</div>

							<div className='bg-white p-8 rounded-3xl border border-gray-200 shadow-sm'>
								<div className='w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6'>
									<Lineicons
										icon={PlusStroke}
										className='text-purple-600 size-6'
									/>
								</div>
								<h3 className='text-xl font-bold mb-3'>Quick Creation</h3>
								<p className='text-gray-600'>
									Add lists and cards with a single click. No complex menus or
									hidden features.
								</p>
							</div>

							<div className='bg-white p-8 rounded-3xl border border-gray-200 shadow-sm'>
								<div className='w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6'>
									<Lineicons
										icon={Layout9Stroke}
										className='text-emerald-600 size-6'
									/>
								</div>
								<h3 className='text-xl font-bold mb-3'>Fully Responsive</h3>
								<p className='text-gray-600'>
									Access your boards from any device. Mobile-first design
									ensures a great experience everywhere.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className='py-20'>
					<div className='container mx-auto px-4'>
						<div className='max-w-5xl mx-auto bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden'>
							<div className='aspect-video bg-gray-800 rounded-3xl flex items-center justify-center overflow-hidden border border-white/10'>
								<div className='flex items-center gap-3'>
									<Image
										src={plany_logo}
										alt='Plany logo'
										width={60}
										height={60}
									/>
									<span className='text-white text-4xl font-bold tracking-tight'>
										Plany
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className='py-12 border-t border-gray-100'>
				<div className='container mx-auto px-4 text-center text-gray-500 text-sm'>
					© {new Date().getFullYear()} Plany. All rights reserved.
				</div>
			</footer>
		</div>
	);
}
