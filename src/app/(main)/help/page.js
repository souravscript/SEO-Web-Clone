'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "To reset your password, click on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to create a new password."
  },
  {
    question: "Can I change my username?",
    answer: "Yes, you can change your username in your account settings. Go to 'Profile' and look for the 'Edit Username' option."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our customer support team by emailing support@example.com or by using the 'Contact Us' form in the app."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Yes, we have mobile apps available for both iOS and Android. You can download them from the App Store or Google Play Store."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "To cancel your subscription, go to 'Account Settings' and select 'Subscription'. Click on 'Cancel Subscription' and follow the prompts."
  }
]

export default function HelpPageContent() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <Input
        type="search"
        placeholder="Search for help..."
        className="mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Accordion type="single" collapsible className="w-full">
        {filteredFaqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {filteredFaqs.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No results found. Please try a different search term.</p>
      )}
    </div>
  )
}

