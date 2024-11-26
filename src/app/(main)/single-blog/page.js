import SideProgress from "@/components/ui/blog-post/side-progress"
import SingleBlogForm from "@/components/ui/blog-post/single-blog-form"
import SinglePageUI from "@/components/ui/blog-post/single-page-UI"

const SingleBlog=()=>{
    return (
        <div className="flex">
            <SideProgress/>
            <div className="relative top-[1rem] left-[10rem]">
                <SingleBlogForm/>
                <SinglePageUI/>
            </div>
            
        </div>
    )
}
export default SingleBlog