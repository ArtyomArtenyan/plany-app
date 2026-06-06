'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';

type SupabaseContext = {
	supabase: SupabaseClient | null;
	isLoaded: boolean;
};
const Context = createContext<SupabaseContext>({
	supabase: null,
	isLoaded: false,
});
type Props = {
	children: React.ReactNode;
};
const SupabaseProvider = ({ children }: Props) => {
	const { session } = useSession();
	const [supabase, setSuperbase] = useState<SupabaseClient | null>(null);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	useEffect(() => {
		if (!session) return;
		const client = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				accessToken: () => session?.getToken(),
			},
		);
		setSuperbase(client);
		setIsLoaded(true);
	}, [session]);
	return (
		<Context.Provider value={{ supabase, isLoaded }}>
			{children}
		</Context.Provider>
	);
};

export default SupabaseProvider;

export const useSuperbase = () => {
	const contex = useContext(Context);
	if (contex === undefined) {
		throw new Error('Sxal');
	}
	return contex;
};
