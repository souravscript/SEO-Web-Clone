import { useGetUser } from "@/hooks/use-get-user";

export default function CurrentBalance() {
    const user=useGetUser('/api/profile');
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-2 text-black">Current Token Balance</h2>
        <p className="text-3xl font-bold text-black">{user?.token.toLocaleString()} Tokens</p>
      </div>
    )
  }
  
  