

import dynamic from 'next/dynamic';

const ClientProtectedRoute = dynamic(() => import("@/lib/protectedRoute"), {
  ssr: false,
});
const mainLayout=({children})=>{
    return (
        <ClientProtectedRoute>{children}</ClientProtectedRoute>
    )
}
export default mainLayout;