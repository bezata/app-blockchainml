"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Bell,
  Globe,
  Lock,
  Mail,
  Smartphone,
  User,
} from "lucide-react";
import { NavBar } from "@/components/component/nav-bar";

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "AI enthusiast and data scientist",
    avatar: "https://github.com/shadcn.png",
    language: "english",
    theme: "light",
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
    },
    twoFactor: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setUser((prevUser) => ({
      ...prevUser,
      notifications: {
        ...prevUser.notifications,
        [name]: checked,
      },
    }));
  };

  const handlePrivacyChange = (name: string, value: string | boolean) => {
    setUser((prevUser) => ({
      ...prevUser,
      privacy: {
        ...prevUser.privacy,
        [name]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving user settings:", user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">User Settings</h1>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-white rounded-lg p-1 shadow-sm">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Change Avatar
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-700">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={user.bio}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-gray-700">
                    Language
                  </Label>
                  <Select
                    value={user.language}
                    onValueChange={(value) =>
                      setUser((prevUser) => ({ ...prevUser, language: value }))
                    }
                  >
                    <SelectTrigger
                      id="language"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    >
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-gray-700">
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-gray-700">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-700">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="two-factor"
                    checked={user.twoFactor}
                    onCheckedChange={(checked) =>
                      setUser((prevUser) => ({
                        ...prevUser,
                        twoFactor: checked,
                      }))
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="two-factor" className="text-gray-700">
                    Enable Two-Factor Authentication
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-notifications"
                    checked={user.notifications.email}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("email", checked)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label
                    htmlFor="email-notifications"
                    className="text-gray-700"
                  >
                    Email Notifications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="push-notifications"
                    checked={user.notifications.push}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("push", checked)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="push-notifications" className="text-gray-700">
                    Push Notifications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sms-notifications"
                    checked={user.notifications.sms}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("sms", checked)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="sms-notifications" className="text-gray-700">
                    SMS Notifications
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility" className="text-gray-700">
                    Profile Visibility
                  </Label>
                  <Select
                    value={user.privacy.profileVisibility}
                    onValueChange={(value) =>
                      handlePrivacyChange("profileVisibility", value)
                    }
                  >
                    <SelectTrigger
                      id="profile-visibility"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    >
                      <SelectValue placeholder="Select profile visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-email"
                    checked={user.privacy.showEmail}
                    onCheckedChange={(checked) =>
                      handlePrivacyChange("showEmail", checked)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="show-email" className="text-gray-700">
                    Show Email Address on Profile
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end space-x-4">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
