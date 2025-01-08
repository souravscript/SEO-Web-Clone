
import Link from "next/link";
//style={{ objectFit: "cover" }}
// Correct import of images
import singleBlogPost from "@/../public/single-blog-post.png";
import bulkBlogPost from "@/../public/bulk-blog-post.png";
import productRoundup from "@/../public/product-roundup.png";
import productReviews from "@/../public/product-reviews.png";
import howToGuide from "@/../public/how-to-guide.png";

import BlogBox from "@/components/ui/home/blog-boxes";
import BottomGuide from "@/components/ui/home/bottom-guide";
import TopDashboard from "@/components/ui/home/TopDashboard";

const blogData = [
  {
    id: "single-blog",
    title: "Single Blog Post",
    description: "A brief description of the single blog.",
    icon: singleBlogPost, // Assign the imported image directly
    isComing: "false",
  },
  {
    id: "bulk-blog",
    title: "Bulk Blog Post",
    description: "A brief description of the bulk blog.",
    icon: bulkBlogPost, // Assign the imported image directly
    isComing: "false",
  },
  {
    id: "product-roundup",
    title: "Product Roundup",
    description: "A brief description of the product roundup.",
    icon: productRoundup, // Assign the imported image directly
    isComing: "true",
  },
  {
    id: "product-review",
    title: "Product Review",
    description: "A brief description of the product review.",
    icon: productReviews, // Assign the imported image directly
    isComing: "true",
  },
  {
    id: "how-to-guide",
    title: "How to Guide",
    description: "A brief description of the how-to review.",
    icon: howToGuide, // Assign the imported image directly
    isComing: "true",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen pt-20 pb-8 max-w-full flex flex-col justify-center items-center">
      <div className="w-[1180px] h-[738px] container mx-auto px-4">
        <TopDashboard/>
        <div className="flex flex-wrap gap-2 mt-4">
          {/* Iterate over blogData */}
          {blogData?.map((blog) => {
            return blog?.isComing === "true" ? (
              <div
                key={blog?.id}
                className="cursor-not-allowed opacity-50"
                title="Coming Soon"
              >
                <BlogBox
                  icon={blog?.icon}
                  title={blog?.title}
                  desc={blog?.description}
                  isComing={blog?.isComing}
                />
              </div>
            ) : (
              <Link href={`/${blog?.id}`} key={blog?.id}>
                <BlogBox
                  icon={blog?.icon}
                  title={blog?.title}
                  desc={blog?.description}
                  isComing={blog?.isComing}
                />
              </Link>
            );
          })}
        </div>
        <div>
          <BottomGuide/>
        </div>
      </div>
    </div>
  );
}
