import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTokenSyncWithServer } from '@/redux/tokenSlice';

export const useCoinTokenSync = () => {
    const dispatch = useDispatch();
    const currentToken = useSelector((state) => state.token.token);

    useEffect(() => {
        const syncToken = async () => {
            try {
                const response = await fetch('/api/tokens');
                const data = await response.json();
                
                if (response.ok && data.token !== currentToken) {
                    dispatch(setTokenSyncWithServer(data.token));
                }
            } catch (error) {
                console.error('Error syncing token:', error);
            }
        };

        syncToken();
    }, [currentToken, dispatch]);
};
