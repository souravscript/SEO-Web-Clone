import Image from "next/image";
import sidebarIcon from "@/../public/sidebar-icon.png";
import bulbImg from "@/../public/bulb.png"

const SideProgress = () => {
  return (
    <div className="p-4 relative top-[2rem] h-max left-[48px] bg-white rounded-md shadow-md w-64">
      {/* Progress Section */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">Progress</span>
        <span className="text-sm font-semibold text-gray-800">45%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-300 rounded-full mb-4">
        <div
          className="h-2 bg-green-500 rounded-full"
          style={{ width: "45%" }}
        ></div>
      </div>

      {/* Sidebar Icon */}
      <div className="flex justify-center mb-6">
        <Image src={sidebarIcon} alt="Sidebar Icon" width={50} height={50} />
      </div>

      {/* Checklist */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          SEO Checklist
        </h1>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked
              readOnly
              className="mr-2 cursor-pointer"
            />
            <label className="text-sm font-medium text-gray-700">
              Core Settings
            </label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-2 cursor-pointer rounded-full border border-green-700" />
            <label className="text-sm font-medium text-gray-700">Details</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-2 cursor-pointer rounded-full border border-green-700" />
            <label className="text-sm font-medium text-gray-700">SEO</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-2 cursor-pointer rounded-full border border-green-700" />
            <label className="text-sm font-medium text-gray-700">Link</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-2 cursor-pointer rounded-full border border-green-700" />
            <label className="text-sm font-medium text-gray-700">Publish</label>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="mt-6">
        <p className="text-xs text-gray-500 mb-1 ">
           Settings like language and article size help make powerful SEO.
        </p>
        <p className="text-xs text-gray-500 ">
          A strong SEO makes your business visible.
        </p>
      </div>
    </div>
  );
};

export default SideProgress;
