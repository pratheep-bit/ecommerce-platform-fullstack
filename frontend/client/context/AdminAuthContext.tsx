import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { adminApiService } from '@/lib/api';

interface AdminAuthContextType {
    isAdminLoggedIn: boolean;
    adminLogin: (accessToken: string, refreshToken: string) => void;
    adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => !!localStorage.getItem('admin_access_token'));

    // Listen for storage changes from other tabs
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'admin_access_token') {
                setIsAdminLoggedIn(!!e.newValue);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const adminLogin = useCallback((accessToken: string, refreshToken: string) => {
        localStorage.setItem('admin_access_token', accessToken);
        localStorage.setItem('admin_refresh_token', refreshToken);
        setIsAdminLoggedIn(true);
    }, []);

    const adminLogout = useCallback(() => {
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
        setIsAdminLoggedIn(false);
    }, []);

    return (
        <AdminAuthContext.Provider value={{ isAdminLoggedIn, adminLogin, adminLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}
