import Image from "next/image"

import guideToDashBoard from "@/../public/guide-to-dashboard.png"
import seeYourCreation from "@/../public/see-your-creation.png"


const BottomGuide=()=>{
    return (
        <div className="flex gap-4 mt-4">
          <div className="flex h-[208px] w-[630px] rounded-lg border border-gray-200">
              <div className="bg-white p-6">
                <h3 className="text-lg font-semibold mb-2">Guide to dashboard 📚</h3>
                <p className="text-gray-600 mb-4">Use this guide to learn how to write your first article using the AI writing tool.</p>
                <button className="bg-primaryYellow text-white px-4 py-2 rounded-md hover:bg-paleYellow hover:text-primaryYellow hover:border hover:border-primaryYellow">
                  Learn how
                </button>
              </div>
              
                  <Image
                    height="208px"
                    width="180px"
                    src={guideToDashBoard}
                    alt="Alt"
                  />
              
          </div>
          <div className="flex h-[208px] w-[630px] rounded-lg border border-gray-200">
            <div className="bg-white p-6 ">
              <h3 className="text-lg font-semibold mb-2">Continue where you left 🚀</h3>
              <p className="text-gray-600 mb-4">Use this guide to learn how to write your first article using the AI writing tool.</p>
              <button className="bg-paleYellow text-primaryYellow border border-primaryYellow px-4 py-2 rounded-md hover:bg-primaryYellow hover:text-white ">
                Learn how
              </button>
            </div>
                <Image
                  height="208px"
                  width="180px"
                  src={seeYourCreation}
                  alt="Alt"
                />
            
        </div>
        </div>
    )
}
export default BottomGuide;