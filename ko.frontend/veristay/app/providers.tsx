'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { store, persistor } from './store/store';
import { UserProvider } from '@/hooks/use-user';
import { ToastContainer } from 'react-toastify';

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Provider store={store}>
            <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
            <PersistGate persistor={persistor}>
                <HeroUIProvider>
                    <NextThemesProvider attribute="class" defaultTheme="dark">
                        <UserProvider>{children}</UserProvider>
                    </NextThemesProvider>
                </HeroUIProvider>
            </PersistGate>
        </Provider>
    );
}
