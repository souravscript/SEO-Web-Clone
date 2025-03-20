import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/authSlice';

export const useTokenRefresh = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const refreshTimerRef = useRef(null);

    const refreshToken = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/refresh-token', {
                method: 'POST',
                credentials: 'include', // Important for sending cookies
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            // Token refresh successful, cookies are automatically handled
            return true;
        } catch (error) {
            console.error('Token refresh error:', error);
            // Handle failed refresh by logging out user
            dispatch(logout());
            router.push('/auth');
            return false;
        }
    }, [dispatch, router]);

    // Setup proactive token refresh
    useEffect(() => {
        const startTokenRefresh = () => {
            // Refresh every 14 minutes (token expires in 15 minutes)
            refreshTimerRef.current = setInterval(refreshToken, 5 * 60 * 1000);
        };
        // Initial token refresh and timer setup
        refreshToken().then((success) => {
            if (success) {
                startTokenRefresh();
            }
        });

        // Cleanup timer on unmount
        return () => {
            if (refreshTimerRef.current) {
                clearInterval(refreshTimerRef.current);
            }
        };
    }, [refreshToken]);

    return { refreshToken };
};
