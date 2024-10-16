"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  User,
  Lock,
  Bell,
  Globe,
  RefreshCw,
  Github,
  Link,
  Plus,
  Trash2,
  DollarSign,
  Twitter,
  Settings,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NavBar } from "@/components/component/nav-bar";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface UserSettings {
  walletAddress: string;
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
  location: string;
  joinDate: string;
  githubProfile: string;
  twitterProfile: string;
  projects: Project[];
  repositories: Repository[];
  monetization: {
    paymentMethod: string;
    subscriptionTier: string;
    customDomain: boolean;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface Repository {
  id: string;
  name: string;
  link: string;
}

const mockUserData: UserSettings = {
  walletAddress: "0x1234...5678",
  name: "Alice Johnson",
  email: "alice@example.com",
  bio: "Blockchain enthusiast and full-stack developer",
  avatar: "https://i.pravatar.cc/150?img=1",
  language: "english",
  theme: "light",
  notifications: {
    email: true,
    push: false,
    sms: true,
  },
  privacy: {
    profileVisibility: "public",
    showEmail: false,
  },
  twoFactor: true,
  defaultPaymentAddress: "0xabcd...ef01",
  paymentAddress: "0x2345...6789",
  apiKey: "sk_test_abcdefghijklmnop",
  location: "San Francisco, CA",
  joinDate: "January 2022",
  githubProfile: "https://github.com/alicejohnson",
  twitterProfile: "https://twitter.com/alicejohnson",
  projects: [
    {
      id: "1",
      name: "Decentralized Exchange",
      description: "A cutting-edge DEX for seamless token swaps",
      link: "https://dex-project.com",
    },
    {
      id: "2",
      name: "NFT Marketplace",
      description: "Platform for creating and trading unique digital assets",
      link: "https://nft-marketplace.io",
    },
    {
      id: "3",
      name: "DeFi Lending Protocol",
      description: "Decentralized lending and borrowing platform",
      link: "https://defi-lending.org",
    },
  ],
  repositories: [
    {
      id: "repo1",
      name: "smart-contracts",
      link: "https://github.com/alicejohnson/smart-contracts",
    },
    {
      id: "repo2",
      name: "dapp-frontend",
      link: "https://github.com/alicejohnson/dapp-frontend",
    },
    {
      id: "repo3",
      name: "blockchain-explorer",
      link: "https://github.com/alicejohnson/blockchain-explorer",
    },
  ],
  monetization: {
    paymentMethod: "crypto",
    subscriptionTier: "pro",
    customDomain: true,
  },
};

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserSettings>(mockUserData);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    link: "",
  });
  const [newRepository, setNewRepository] = useState({ name: "", link: "" });

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

  const handleMonetizationChange = (name: string, value: string | boolean) => {
    setUser((prevUser) => ({
      ...prevUser,
      monetization: {
        ...prevUser.monetization,
        [name]: value,
      },
    }));
  };

  const handleSave = async () => {
    toast({
      title: "Success",
      description: "User settings updated successfully",
    });
  };

  const handleRenewApiKey = async () => {
    setUser((prevUser) => ({
      ...prevUser,
      apiKey: "sk_test_" + Math.random().toString(36).substr(2, 18),
    }));
    toast({
      title: "Success",
      description: "API key renewed successfully",
    });
  };

  const handleAddProject = () => {
    if (newProject.name && newProject.description && newProject.link) {
      setUser((prevUser) => ({
        ...prevUser,
        projects: [
          ...prevUser.projects,
          { ...newProject, id: Date.now().toString() },
        ],
      }));
      setNewProject({ name: "", description: "", link: "" });
    }
  };

  const handleRemoveProject = (id: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      projects: prevUser.projects.filter((project) => project.id !== id),
    }));
  };

  const handleAddRepository = () => {
    if (newRepository.name && newRepository.link) {
      setUser((prevUser) => ({
        ...prevUser,
        repositories: [
          ...prevUser.repositories,
          { ...newRepository, id: Date.now().toString() },
        ],
      }));
      setNewRepository({ name: "", link: "" });
    }
  };

  const handleRemoveRepository = (id: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      repositories: prevUser.repositories.filter((repo) => repo.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-white rounded-lg p-1 shadow-sm">
            {[
              "profile",
              "account",
              "notifications",
              "privacy",
              "projects",
              "monetization",
              "advanced",
            ].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                {tab === "profile" && <User className="w-4 h-4 mr-2" />}
                {tab === "account" && <Lock className="w-4 h-4 mr-2" />}
                {tab === "notifications" && <Bell className="w-4 h-4 mr-2" />}
                {tab === "privacy" && <Globe className="w-4 h-4 mr-2" />}
                {tab === "projects" && <Link className="w-4 h-4 mr-2" />}
                {tab === "monetization" && (
                  <DollarSign className="w-4 h-4 mr-2" />
                )}
                {tab === "advanced" && <Settings className="w-4 h-4 mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
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
                {[
                  "name",
                  "email",
                  "bio",
                  "language",
                  "githubProfile",
                  "twitterProfile",
                ].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="text-gray-700">
                      {field
                        .split(/(?=[A-Z])/)
                        .join(" ")
                        .charAt(0)
                        .toUpperCase() +
                        field
                          .split(/(?=[A-Z])/)
                          .join(" ")
                          .slice(1)}
                    </Label>
                    {field === "bio" ? (
                      <Textarea
                        id={field}
                        name={field}
                        value={user[field as keyof UserSettings] as string}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    ) : field === "language" ? (
                      <Select
                        value={user.language}
                        onValueChange={(value) =>
                          setUser((prevUser) => ({
                            ...prevUser,
                            language: value,
                          }))
                        }
                      >
                        <SelectTrigger
                          id={field}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        >
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {["english", "spanish", "french", "german"].map(
                            (lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field}
                        name={field}
                        value={user[field as keyof UserSettings] as string}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        type={field === "email" ? "email" : "text"}
                      />
                    )}
                  </div>
                ))}
                <div className="flex space-x-4">
                  <Button
                    className="bg-gray-800 hover:bg-gray-900 text-white"
                    onClick={() => window.open(user.githubProfile, "_blank")}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Profile
                  </Button>
                  <Button
                    className="bg-blue-400 hover:bg-blue-500 text-white"
                    onClick={() => window.open(user.twitterProfile, "_blank")}
                  >
                    <Twitter className="w-4 h-4 mr-2" />X Profile
                  </Button>
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
                {["defaultPaymentAddress", "paymentAddress", "apiKey"].map(
                  (field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="text-gray-700">
                        {field
                          .split(/(?=[A-Z])/)
                          .join(" ")
                          .charAt(0)
                          .toUpperCase() +
                          field
                            .split(/(?=[A-Z])/)
                            .join(" ")
                            .slice(1)}
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id={field}
                          name={field}
                          value={user[field as keyof UserSettings] as string}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500 flex-grow"
                          readOnly={field === "apiKey"}
                        />
                        {field === "apiKey" && (
                          <Button
                            onClick={handleRenewApiKey}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Renew
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                )}
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
                {Object.entries(user.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={`${key}-notifications`}
                      checked={value}
                      onCheckedChange={(checked) =>
                        handleSwitchChange(key, checked)
                      }
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Label
                      htmlFor={`${key}-notifications`}
                      className="text-gray-700"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                    </Label>
                  </div>
                ))}
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
                      {["public", "private", "friends"].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
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

          <TabsContent value="projects">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Projects & Repositories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Projects
                  </h3>
                  {user.projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between bg-yellow-50 p-3 rounded-md"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {project.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {project.description}
                        </p>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-600 text-sm"
                        >
                          View Project
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Input
                      placeholder="Project Name"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <Input
                      placeholder="Project Description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <Input
                      placeholder="Project Link"
                      value={newProject.link}
                      onChange={(e) =>
                        setNewProject({ ...newProject, link: e.target.value })
                      }
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <Button
                      onClick={handleAddProject}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Repositories
                  </h3>
                  {user.repositories.map((repo) => (
                    <div
                      key={repo.id}
                      className="flex items-center justify-between bg-yellow-50 p-3 rounded-md"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {repo.name}
                        </h4>
                        <a
                          href={repo.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-600 text-sm"
                        >
                          View Repository
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveRepository(repo.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Input
                      placeholder="Repository Name"
                      value={newRepository.name}
                      onChange={(e) =>
                        setNewRepository({
                          ...newRepository,
                          name: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <Input
                      placeholder="Repository Link"
                      value={newRepository.link}
                      onChange={(e) =>
                        setNewRepository({
                          ...newRepository,
                          link: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <Button
                      onClick={handleAddRepository}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Repository
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monetization">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Monetization Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-method" className="text-gray-700">
                    Payment Method
                  </Label>
                  <Select
                    value={user.monetization.paymentMethod}
                    onValueChange={(value) =>
                      handleMonetizationChange("paymentMethod", value)
                    }
                  >
                    <SelectTrigger
                      id="payment-method"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    >
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {["crypto", "paypal", "stripe"].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subscription-tier" className="text-gray-700">
                    Subscription Tier
                  </Label>
                  <Select
                    value={user.monetization.subscriptionTier}
                    onValueChange={(value) =>
                      handleMonetizationChange("subscriptionTier", value)
                    }
                  >
                    <SelectTrigger
                      id="subscription-tier"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    >
                      <SelectValue placeholder="Select subscription tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {["free", "basic", "pro", "enterprise"].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="custom-domain"
                    checked={user.monetization.customDomain}
                    onCheckedChange={(checked) =>
                      handleMonetizationChange("customDomain", checked)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="custom-domain" className="text-gray-700">
                    Enable Custom Domain
                  </Label>
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
                    placeholder="Enter your payment address"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div className="space-y-2">
                  <Label htmlFor="wallet-address" className="text-gray-700">
                    Wallet Address
                  </Label>
                  <Input
                    id="wallet-address"
                    name="walletAddress"
                    value={user.walletAddress}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="developer-mode"
                    checked={user.theme === "dark"}
                    onCheckedChange={(checked) =>
                      setUser((prevUser) => ({
                        ...prevUser,
                        theme: checked ? "dark" : "light",
                      }))
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="developer-mode" className="text-gray-700">
                    Enable Developer Mode
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
