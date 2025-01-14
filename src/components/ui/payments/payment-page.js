"use client";
import TokenPlan from '@/components/ui/payments/token-plan'
import BackButton from '@/components/ui/payments/back-button'
import CurrentBalance from '@/components/ui/payments/current-balance'

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className=" p-4">
        <div className="container mx-auto flex justify-between items-center">
          <BackButton />
          <h1 className="text-2xl font-bold text-center">Token Recharge</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <CurrentBalance />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <TokenPlan tokens={50} price={500} />
          <TokenPlan tokens={100} price={1000} />
          <TokenPlan tokens={200} price={2000} />
        </div>
      </main>

  
    </div>
  )
}

