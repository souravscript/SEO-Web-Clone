import CoreSettingsSingle from "../ui/blog-post/core-settings-single"
import Details from "../ui/blog-post/details"
import SEO from "../ui/blog-post/seo"
import LinkComponent from "../ui/blog-post/link-component"
import Publish from "../ui/blog-post/publish"


 export const tabData=[
    {
        name:"core Settings",
        component : <CoreSettingsSingle/>,
        next:"Next",
    },
    {
        name:"details",
        component : <Details/>,
        next:"Next",
    },
    {
        name:"seo",
        component : <SEO/>,
        next:"Next",
    },
    {
        name:"link",
        component : <LinkComponent/>,
        next:"Generate",
    },
    {
        name:"publish",
        component : <Publish/>,
        next:"Publish",
    },
    
    
]
