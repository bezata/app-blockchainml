"use client";
import React, { useState, useEffect } from "react";
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
import { Bell, Globe, Lock, User, RefreshCw } from "lucide-react";
import { NavBar } from "@/components/component/nav-bar";
import { useSession } from "next-auth/react";
interface UserSettings {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  language: string;
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: string;
    showEmail: boolean;
  };
  twoFactor: boolean;
  defaultPaymentAddress: string;
  paymentAddress: string;
  apiKey: string;
}

// Initialize with default values
const defaultUserSettings: UserSettings = {
  name: "",
  email: "",
  bio: "",
  avatar: "",
  language: "english",
  theme: "light",
  notifications: {
    email: false,
    push: false,
    sms: false,
  },
  privacy: {
    profileVisibility: "public",
    showEmail: false,
  },
  twoFactor: false,
  defaultPaymentAddress: "",
  paymentAddress: "",
  apiKey: "",
};

export default function UserSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserSettings>(defaultUserSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch("/api/user-settings");
      if (!response.ok) {
        throw new Error("Failed to fetch user settings");
      }
      const data = await response.json();
      setUser({ ...defaultUserSettings, ...data });
    } catch (error) {
      setError("An error occurred while fetching user settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
  const handleSave = async () => {
    try {
      // Only send mutable fields
      const mutableFields = {
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        language: user.language,
        theme: user.theme,
        notifications: user.notifications,
        privacy: user.privacy,
        twoFactor: user.twoFactor,
        defaultPaymentAddress: user.defaultPaymentAddress,
        paymentAddress: user.paymentAddress,
      };

      const response = await fetch("/api/user-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mutableFields),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user settings: ${errorText}`);
      }

      const updatedUser = await response.json();
      setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
      console.log("User settings updated successfully");
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  const handleRenewApiKey = async () => {
    if (!session || !session.user?.id) {
      console.error("User session not available");
      setError("You must be logged in to renew your API key");
      return;
    }
  
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const apiUrl = `${backendUrl}/api/v1/user-settings/renew-api-key`;
  
    console.log(`Attempting to renew API key at: ${apiUrl}`);
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({}), // Send an empty object
      });
  
      const responseText = await response.text();
      console.log("Raw response:", responseText);
  
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }
  
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse successful response:", e);
        throw new Error("Invalid response from server");
      }
  
      if (!data.apiKey) {
        throw new Error("API key not found in response");
      }
  
      setUser((prevUser) => ({ ...prevUser, apiKey: data.apiKey }));
      console.log("API key renewed successfully");
      // Show a success message to the user
    } catch (error) {
      console.error("Error renewing API key:", error);
      setError(`Failed to renew API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
                  <Label
                    htmlFor="default-payment-address"
                    className="text-gray-700"
                  >
                    Default Payment Address
                  </Label>
                  <Input
                    id="default-payment-address"
                    name="defaultPaymentAddress"
                    value={user.defaultPaymentAddress}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-address" className="text-gray-700">
                    Payment Address
                  </Label>
                  <Input
                    id="payment-address"
                    name="paymentAddress"
                    value={user.paymentAddress}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-gray-700">
                    API Key
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="api-key"
                      name="apiKey"
                      value={user.apiKey}
                      readOnly
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500 flex-grow"
                    />
                    <Button
                      onClick={handleRenewApiKey}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Renew
                    </Button>
                  </div>
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