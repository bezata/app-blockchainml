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
    // Here you would typically send the updated user data to your backend
    console.log("Saving user settings:", user);
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Settings</h1>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="account">
              <Lock className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Globe className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
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
                  <Button>Change Avatar</Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={user.bio}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={user.language}
                    onValueChange={(value) =>
                      setUser((prevUser) => ({ ...prevUser, language: value }))
                    }
                  >
                    <SelectTrigger id="language">
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
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
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
                  />
                  <Label htmlFor="two-factor">
                    Enable Two-Factor Authentication
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-notifications"
                    checked={user.notifications.email}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("email", checked)
                    }
                  />
                  <Label htmlFor="email-notifications">
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
                  />
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sms-notifications"
                    checked={user.notifications.sms}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("sms", checked)
                    }
                  />
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select
                    value={user.privacy.profileVisibility}
                    onValueChange={(value) =>
                      handlePrivacyChange("profileVisibility", value)
                    }
                  >
                    <SelectTrigger id="profile-visibility">
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
                  />
                  <Label htmlFor="show-email">
                    Show Email Address on Profile
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </>
  );
}
