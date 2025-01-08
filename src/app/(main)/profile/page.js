'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'johndoe@gmail.com',
    phone: ''
  })

  const handleSubmit = async () => {
    e.preventDefault()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account and all its data? This action cannot be undone."
    )
    if (confirmed) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 bg-gray-100">
          <AvatarFallback className="text-lg">JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">{formData.fullName}</h1>
          <p className="text-sm text-gray-500">{formData.email}</p>
        </div>
      </div>

      {/* Basic Details Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Select defaultValue="IN">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">IN</SelectItem>
                    <SelectItem value="US">US</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="CA">CA</SelectItem>
                    <SelectItem value="AU">AU</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="bg-primaryYellow hover:bg-yellow-600 text-white"
            >
              Update Data
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      {/* <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
           
              Want to permanently delete your account and all its data
            </p>
            <Button 
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}

