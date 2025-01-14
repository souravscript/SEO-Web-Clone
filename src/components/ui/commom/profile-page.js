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
import { useGetAccessToken } from '@/hooks/use-get-accessToken'
import { ThreeCircles } from 'react-loader-spinner'
import { useGetUser } from "@/hooks/use-get-user";
import { useSelector } from "react-redux";
import { useCookieValue } from "@/hooks/useCookie";

export default function ProfilePage() {
  //const access_token = useGetAccessToken();

  const {fullName, phoneNumber}=useSelector((state) => state.auth.user);
  const sessionData = localStorage.getItem("session");
  const parsedData = sessionData ? JSON.parse(sessionData) : {};
  const extractedEmail = parsedData?.user?.email || "";
  const access_token =useCookieValue('access_token')
  const { toast } = useToast();
  const user = useGetUser('/api/profile');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarName, setAvatarName] = useState("");
  const [formData, setFormData] = useState({
    fullName: fullName ||'',
    email: extractedEmail,
    phoneNumber: phoneNumber.slice(1) || '',
  });
  useEffect(()=>{
    console.log("user",user);
    const fullName=user?.fullName.split(" ");
    //const initials=fullName[0][0]+fullName[1][0];
    //setAvatarName(initials)
  },[user])
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
      if (!/^[a-zA-Z\s]+$/.test(fullName)) {
        throw new Error("Full name can only contain letters and spaces");
      }
      if (!/^\d{10}$/.test(phoneNumber)) {
        throw new Error("Phone number must be 10 digits");
      }
      // const session = localStorage.getItem("session");
      // if (!session) {
      //   throw new Error("Session data is not available in localStorage");
      // }

      // const { access_token } = JSON.parse(session);
      
      // if (!access_token) {
      //   throw new Error("Access token is missing in session data");
      // }
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        //credentials: 'include',
        body: JSON.stringify({
          fullName,
          phoneNumber: `${countryCode} ${phoneNumber}`
        })
      });
      console.log("response", response);
      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
        });
      } else {
        throw new Error("Failed to update profile");
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
                  value={formData.phoneNumber}
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
