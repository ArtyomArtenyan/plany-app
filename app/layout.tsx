import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';
import SupabaseProvider from '@/lib/superbase/SupabaseProvider';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Plany | Modern Project Management',
	description: 'Stay organized and focused with Plany - the ultimate task management tool for teams and individuals.',
	keywords: ['project management', 'task manager', 'productivity', 'kanban', 'trello alternative'],
	authors: [{ name: 'Plany Team' }],
	icons: {
		icon: '/plany-logo.svg',
		apple: '/plany-logo.svg',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html
				lang='en'
				className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			>
				<body className='min-h-full flex flex-col'>
					<SupabaseProvider>{children}</SupabaseProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
