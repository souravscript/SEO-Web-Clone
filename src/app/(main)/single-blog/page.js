import SideProgress from "@/components/ui/blog-post/side-progress"
import SingleBlogForm from "@/components/ui/blog-post/single-blog-form"
import SingleBlogPage from "@/components/ui/blog-post/single-blog-page"
import SinglePageUI from "@/components/ui/blog-post/single-page-UI"

const SingleBlog=()=>{
    return (
    <div className='flex'>
        <SideProgress/>
        <SinglePageUI/>
    </div>
    )
}
export default SingleBlog