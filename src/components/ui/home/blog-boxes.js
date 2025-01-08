import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";

const BlogBox = ({ icon, title, desc, isComing }) => {
  return (
    <Card className="w-[280px] h-[180px] hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="relative flex">
            <Image
              height={40}
              width={40}
              src={icon}
              alt={title}
            />
            {isComing === "true" && (
              <Badge
              className="absolute top-0 right-0 bg-primaryYellow text-white px-2 py-1 text-xs"
              variant="default" // or use other variants like 'secondary' if available
            >
              Coming Soon
            </Badge>
            )}
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