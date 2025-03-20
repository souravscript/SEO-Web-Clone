import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { reset } from '@/redux/singleBlogFormProgressSlice';
import Cookies from 'js-cookie';

const useBeforeUnload = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Dispatch action to reset form state
            reset()
            Cookies.remove("progressState")
            // Custom message for confirmation (optional)
            const message = 'Are you sure you want to leave this page? Your changes might not be saved.';
            event.returnValue = message;  // Standard for most browsers
            return message;  // For some browsers like Chrome
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dispatch]);
};

export default useBeforeUnload;
