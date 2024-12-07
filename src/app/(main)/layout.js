import ProtectedRoute from "@/lib/protectedRoute"

const mainLayout=({children})=>{
    return (
        <ProtectedRoute>{children}</ProtectedRoute>
    )
}
export default mainLayout;