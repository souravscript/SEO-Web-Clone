import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';

const BlogBox = ({ icon, title, desc }) => {
  return (
    <Card className="w-[280px] h-[180px] hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Image
              height={40}
              width={40}
              src={icon}
              alt={title}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogBox;