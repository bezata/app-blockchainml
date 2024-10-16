"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Mail,
  MapPin,
  Calendar,
  Edit,
  Settings,
  User,
  BarChart2,
  Award,
  Copy,
} from "lucide-react";
import { NavBar } from "@/components/component/nav-bar";
import { useSession } from "next-auth/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

interface UserProfile {
  walletAddress: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  avatar: string | null;
  chainId: string;
  language: string | null;
  theme: string | null;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showEmail: boolean;
    showLocation: boolean;
  };
  twoFactor: boolean;
  defaultPaymentAddress: string | null;
  paymentAddress: string | null;
  location?: string;
  joinDate?: string;
  useWalletAsName?: boolean;
  city?: string;
  country?: string;
}

const defaultUserProfile: UserProfile = {
  walletAddress: "",
  name: null,
  email: null,
  bio: null,
  avatar: null,
  chainId: "",
  language: null,
  theme: null,
  notifications: {
    email: true,
    push: false,
    sms: false,
  },
  privacy: {
    showEmail: true,
    showLocation: true,
  },
  twoFactor: false,
  defaultPaymentAddress: null,
  paymentAddress: null,
  location: "",
  joinDate: "",
  useWalletAsName: false,
};

interface Achievement {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Activity {
  type: string;
  name: string;
  date: string;
}

export default function UserProfilePage() {
  const { status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activityData, setActivityData] = useState<Activity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserProfile() {
      if (status === "authenticated") {
        try {
          setLoading(true);
          const response = await fetch("/api/user/profile", {
            method: "GET",
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch user profile",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserProfile();
  }, [status]);

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update user profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSave = async () => {
    const updatedFields: Partial<UserProfile> = {};

    if (user.name !== defaultUserProfile.name) updatedFields.name = user.name;
    if (user.email !== defaultUserProfile.email) updatedFields.email = user.email;
    if (user.bio !== defaultUserProfile.bio) updatedFields.bio = user.bio;
    if (user.avatar !== defaultUserProfile.avatar) updatedFields.avatar = user.avatar;
    if (user.language !== defaultUserProfile.language) updatedFields.language = user.language;
    if (user.theme !== defaultUserProfile.theme) updatedFields.theme = user.theme;
    if (user.defaultPaymentAddress !== defaultUserProfile.defaultPaymentAddress)
      updatedFields.defaultPaymentAddress = user.defaultPaymentAddress;
    if (user.paymentAddress !== defaultUserProfile.paymentAddress)
      updatedFields.paymentAddress = user.paymentAddress;
    if (user.location !== defaultUserProfile.location) updatedFields.location = user.location;
    if (user.city !== defaultUserProfile.city) updatedFields.city = user.city;
    if (user.country !== defaultUserProfile.country) updatedFields.country = user.country;
    if (user.useWalletAsName !== defaultUserProfile.useWalletAsName)
      updatedFields.useWalletAsName = user.useWalletAsName;

    if (Object.keys(updatedFields).length > 0) {
      await updateProfile(updatedFields);
    } else {
      console.log("No changes to save");
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/user/userAvatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUser((prevUser) => ({ ...prevUser, avatar: data.avatarUrl }));
        toast({
          title: "Success",
          description: "Avatar uploaded successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while uploading avatar",
        variant: "destructive",
      });
    }
  };

  const toggleNameWallet = () => {
    setUser((prevUser) => ({
      ...prevUser,
      useWalletAsName: !prevUser.useWalletAsName,
    }));
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(user.walletAddress);
    toast({
      title: "Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] text-gray-800 font-sans">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-white shadow-sm rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start">
                <Avatar className="w-32 h-32 mb-4 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar || undefined} alt={user.name || ""} />
                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-300 text-sm py-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-300 text-sm py-1"
                    onClick={() => router.push("/settings")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
              <div className="w-full lg:w-2/3 space-y-4">
                <h1 className="text-3xl font-light text-gray-800 text-center lg:text-left">
                  {user.useWalletAsName ? user.walletAddress : user.name || "Name not settled"}
                </h1>
                <p className="text-gray-600 text-center lg:text-left">
                  {user.bio || "No bio provided"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <span className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email || "Email not provided"}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user.city && user.country
                      ? `${user.city}, ${user.country}`
                      : "Location not provided"}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {user.joinDate || new Date().toLocaleDateString()}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Wallet:</span>
                    <span className="text-sm font-mono bg-gray-100 p-1 rounded">
                      {`${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyWalletAddress}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:ml-[33.33%] mb-8"
            >
              <Card className="bg-white shadow-sm rounded-lg overflow-hidden">
                <CardHeader className="border-b bg-green-500 border-gray-200">
                  <CardTitle className="text-2xl font-bold text-white">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={user.name || ""}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          className="border-gray-300 focus:border-green-300 focus:ring-green-200 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={user.email || ""}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="border-gray-300 focus:border-green-300 focus:ring-green-200 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                
                        value={user.bio || ""}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                        rows={3}
                        className="border-gray-300 focus:border-green-300 focus:ring-green-200 transition-all duration-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                          Country
                        </Label>
                        <Select
                          value={user.country || ""}
                          onValueChange={(value) =>
                            setUser((prevUser) => ({
                              ...prevUser,
                              country: value,
                            }))
                          }
                        >
                          <SelectTrigger
                            id="country"
                            className="border-gray-300 focus:border-green-300 focus:ring-green-200 transition-all duration-300"
                          >
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            {/* Add more countries as needed */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={user.city || ""}
                          onChange={handleInputChange}
                          placeholder="Enter your city"
                          className="border-gray-300 focus:border-green-300 focus:ring-green-200 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                        Language
                      </Label>
                      <Select
                        value={user.language || ""}
                        onValueChange={(value) =>
                          setUser((prevUser) => ({
                            ...prevUser,
                            language: value,
                          }))
                        }
                      >
                        <SelectTrigger
                          id="language"
                          className="border-gray-300 focus:border-green-300 focus:ring-green-200 transition-all duration-300"
                        >
                          <SelectValue placeholder="Select your language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          {/* Add more languages as needed */}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use-wallet-name"
                        checked={user.useWalletAsName}
                        onCheckedChange={toggleNameWallet}
                      />
                      <Label htmlFor="use-wallet-name">Use wallet address as name</Label>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white rounded-lg shadow-sm flex flex-wrap justify-center p-1">
            <TabsTrigger
              value="overview"
              className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md py-2 px-4 transition-all duration-200"
            >
              <User className="w-5 h-5 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md py-2 px-4 transition-all duration-200"
            >
              <BarChart2 className="w-5 h-5 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md py-2 px-4 transition-all duration-200"
            >
              <Award className="w-5 h-5 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contribution Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Datasets Uploaded</span>
                        <span className="text-sm font-medium text-gray-700">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Models Created</span>
                        <span className="text-sm font-medium text-gray-700">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Community Engagement</span>
                        <span className="text-sm font-medium text-gray-700">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Contribution History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end justify-between">
                    {[60, 80, 70, 90, 85, 95].map((height, index) => (
                      <motion.div
                        key={index}
                        className="bg-green-500 w-8 rounded-t-md"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activityData.length > 0 ? (
                  <ul className="space-y-4">
                    {activityData.map((activity, index) => (
                      <li key={index} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{activity.type}</p>
                          <p className="text-sm text-gray-600">{activity.name}</p>
                        </div>
                        <Badge>{activity.date}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No recent activity</p>
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      Start Contributing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.length > 0 ? (
                achievements.map((achievement, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center p-6">
                      <achievement.icon className="w-12 h-12 text-green-500 mr-4" />
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      No achievements yet. Keep contributing to earn badges!
                    </p>
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      Explore Opportunities
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}