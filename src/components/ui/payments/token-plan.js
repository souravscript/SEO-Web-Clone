import { Button } from "@/components/ui/button"

export default function TokenPlan({ tokens, price }) {
  return (
    <div className="rounded-lg shadow-md p-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-black">{tokens.toLocaleString()} Tokens</h2>
      <p className="text-3xl font-bold mb-6 text-black">${price}</p>
      <Button 
        className="bg-tab hover:bg-white hover:text-tab text-black font-sans font-bold py-2 px-4 rounded transition duration-300"
      >
        Select Plan
      </Button>
    </div>
  )
}

