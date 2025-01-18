"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";


export default function PaymentPage() {
  
  return (
    <div className="min-h-screen relative left-[8rem]  p-8 max-w-[1180px]">
      
      {/* Header */}
      <div className="max-w-5xl mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple pricing based on your needs</h1>
        <p className="text-gray-600">Discover a variety of our advanced features. Unlimited and free for individuals.</p>
      </div>

      {/* Pricing Cards Container */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Individual Plan */}
        <Card className="relative bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Individuals</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Starts at</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$0</span>
                <span className="ml-2 text-gray-600">per month/user</span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">Good for individuals who are just starting out and simply want the essentials.</p>
            <button className="w-full py-2 px-4 rounded-lg border border-[#C8C9B5] text-gray-800 hover:bg-gray-50 mb-8">
              Get started
            </button>
            <div className="space-y-4">
              <p className="font-medium">Free, forever</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  1 user
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Unlimited calendars
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Unlimited event types
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Workflows
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Integrate with your favorite apps
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Accept payments via Stripe
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Teams Plan */}
        <Card className="relative bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <div className="absolute -top-4 right-4">
            <span className="bg-[#1d1d1d] text-white px-4 py-1 rounded-full text-sm">
              30 days free trial
            </span>
          </div>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Teams</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Starts at</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$12</span>
                <span className="ml-2 text-gray-600">per month/user</span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">Highly recommended for small teams who seek to upgrade their time & perform.</p>
            <button className="w-full py-2 px-4 rounded-lg bg-[#f6B647] text-white hover:bg-[#e5a536] mb-8">
              Get started
            </button>
            <div className="space-y-4">
              <p className="font-medium">Free plan features, plus:</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  1 team
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Schedule meetings as a team
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Round-Robin, Fixed Round-Robin
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Collective Events
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Advanced Routing Forms
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Team Workflows
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card className="relative bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Enterprise</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Starts at</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$15k</span>
                <span className="ml-2 text-gray-600">per year</span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">Robust scheduling for larger teams looking to have more control, privacy & security.</p>
            <button className="w-full py-2 px-4 rounded-lg border border-[#C8C9B5] text-gray-800 hover:bg-gray-50 mb-8">
              Contact us
            </button>
            <div className="space-y-4">
              <p className="font-medium">Organization plan features, plus:</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  1 parent team and unlimited sub-teams
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Organization workflows
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Insights - analyze your booking data
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Active directory sync
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  24/7 Email, Chat and Phone support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#FCA21C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Sync your HRIS tools
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

