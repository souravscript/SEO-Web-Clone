'use client';

import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from 'react'
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
import { ThreeCircles } from 'react-loader-spinner'
import { useGetUser } from "@/hooks/use-get-user";
import Cookies from 'js-cookie';

export default function ProfilePage() {

  const sessionData = Cookies.get('user');
  const parsedData = sessionData ? JSON.parse(sessionData) : {};
  const extractedEmail = parsedData?.email || "";
  const extractedPhoneNumber = parsedData?.phoneNumber || ""
  const extractedFullName = parsedData?.fullName || ""
  const { toast } = useToast();
  const user = useGetUser('/api/profile');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarName, setAvatarName] = useState("");
  const [formData, setFormData] = useState({
    fullName: extractedFullName || '',
    email: extractedEmail,
    phoneNumber: extractedPhoneNumber.slice(2) || '',
  });

  useEffect(() => {
    console.log("user", user);
    if (user?.fullName) {
      const fullName = user.fullName.split(" ");
      console.log("fullname ", fullName);
      
      // Improved avatar name generation
      let avatarInitials = fullName.length > 1 
        ? fullName[0].slice(0, 1) + fullName[1].slice(0, 1)
        : fullName[0].slice(0, 2);
      
      setAvatarName(avatarInitials.toUpperCase());
    } else if (formData.fullName) {
      // Fallback to form data if user data is not available
      const fullName = formData.fullName.split(" ");
      let avatarInitials = fullName.length > 1 
        ? fullName[0].slice(0, 1) + fullName[1].slice(0, 1)
        : fullName[0].slice(0, 2);
      
      setAvatarName(avatarInitials.toUpperCase());
    }
  }, [user, formData.fullName]);

  const [countryCode, setCountryCode] = useState("IN");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const { fullName, phoneNumber } = formData;
      console.log("formData", formData);
      
      // Validation
      if (!fullName || !phoneNumber) {
        throw new Error("Missing data fields");
      }
      
      // Improved full name validation
      if (!/^[a-zA-Z\s]{2,}$/.test(fullName)) {
        throw new Error("Full name must be at least 2 characters and contain only letters and spaces");
      }
      
      // Improved phone number validation
      const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters
      if (sanitizedPhoneNumber.length !== 10) {
        throw new Error("Phone number must be exactly 10 digits");
      }
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName,
          phoneNumber: `${countryCode} ${sanitizedPhoneNumber}`
        })
      });
      console.log("response", response);
      
      if (response.ok) {
        // Update the user cookie with new data
        const updatedUserData = {
          ...parsedData,
          fullName,
          phoneNumber: `${countryCode} ${sanitizedPhoneNumber}`
        };
        
        // Set the updated user data in cookies
        Cookies.set('user', JSON.stringify(updatedUserData), { 
          expires: 7, // 7 days expiry 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict' 
        });

        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Modify the phone number input to show the full phone number
  const displayPhoneNumber = formData.phoneNumber.length === 10 
    ? `${formData.phoneNumber.slice(0, 3)}-${formData.phoneNumber.slice(3, 6)}-${formData.phoneNumber.slice(6)}` 
    : formData.phoneNumber;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
          <ThreeCircles visible={true} height="100" width="100" color="#f6B647" ariaLabel="three-circles-loading" />
        </div>
      )}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 bg-gray-100">
          <AvatarFallback className="text-lg">
            {avatarName?avatarName:"JD"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">{user?.fullName?user.fullName:formData?.fullName}</h1>
          <p className="text-sm text-gray-500">{formData?.email}</p>
        </div>
      </div>
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
                disabled
                className="bg-gray-100 cursor-not-allowed"
                value={formData.email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Select defaultValue="IN" onValueChange={(value) => setCountryCode(value)}>
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
                  value={displayPhoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
            <Button type="submit" className="bg-primaryYellow hover:bg-yellow-600 text-white">
              Update Data
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
