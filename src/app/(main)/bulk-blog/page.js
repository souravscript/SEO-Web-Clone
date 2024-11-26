import BulkBlogForm from "@/components/ui/blog-post/bulk-blog-form"
import BulkPageUI from "@/components/ui/blog-post/bulk-page-UI"
import SideProgress from "@/components/ui/blog-post/side-progress"

const BulkBlog=()=>{
    return (
        <div className="flex">
            <SideProgress/>
            <div className="relative top-[10px] left-[10rem]">
                <BulkBlogForm/>
                <BulkPageUI/>
            </div>
            
        </div>
    )
}
export default BulkBlog