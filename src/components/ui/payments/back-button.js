import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function BackButton() {
  return (
    <Link href="/" className="inline-flex items-center text-white hover:text-backButton transition duration-300">
      <ChevronLeft className="w-5 h-5 mr-1" />
      Back
    </Link>
  )
}

