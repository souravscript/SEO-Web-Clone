// components/ui/blog-boxes.jsx
import Image from 'next/image';

const BlogBox = ({ icon, title, desc }) => {
  return (
    <div className="bg-white w-[280px] h-[160px] p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Image
            height="40px"
            width="40px"
            src={icon}
            alt={title}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-600 text-sm">{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogBox;