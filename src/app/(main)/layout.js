

import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';

const ClientProtectedRoute = dynamic(() => import("@/lib/protectedRoute"), {
  ssr: false,
});
const mainLayout=({children})=>{
    return (
        <ClientProtectedRoute>{children}
              <Toaster richColors position="top-right" /></ClientProtectedRoute>
    )
}
export default mainLayout;