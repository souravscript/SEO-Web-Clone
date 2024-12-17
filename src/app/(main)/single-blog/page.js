import SideProgress from "@/components/ui/blog-post/side-progress"
import SingleBlogForm from "@/components/ui/blog-post/single-blog-form"
import SinglePageUI from "@/components/ui/blog-post/single-page-ui"

const SingleBlog=()=>{
    return (
        <div className="flex">
            <SideProgress/>
            <SinglePageUI/>
            
        </div>
    )
}
export default SingleBlog