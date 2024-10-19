"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import {
  UserSettings,
  Project,
  Repository,
  NotificationPreferences,
  PrivacySettings,
  MonetizationSettings,
} from "@/types/user";

export default function UserSettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserSettings | null>(null);
  const [changes, setChanges] = useState<Partial<UserSettings>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Omit<Project, "id" | "userId">>({
    name: "",
    description: "",
    link: "",
  });
  const [newRepository, setNewRepository] = useState<
    Omit<Repository, "id" | "userId">
  >({
    name: "",
    link: "",
  });

  const fetchUserSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/settings");
      if (!response.ok) throw new Error("Failed to fetch user settings");
      const data: UserSettings = await response.json();
      setUser(data);
      setChanges({});
      setError(null);
    } catch (err) {
      setError("Error fetching user settings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (status === "authenticated") {
      fetchUserSettings();
    }
  }, [status, fetchUserSettings]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setChanges((prevChanges) => ({ ...prevChanges, [name]: value }));
  };

  const handleNotificationChange = (checked: boolean) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      notificationPreferences: {
        ...(prevChanges.notificationPreferences ?? {}),
        emailNotifications: checked,
      } as NotificationPreferences,
    }));
  };

  const handlePrivacyChange = (
    name: keyof PrivacySettings,
    value: string | boolean
  ) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      privacySettings: {
        ...prevChanges.privacySettings,
        [name]: value,
      } as PrivacySettings,
    }));
  };

  const handleMonetizationChange = (
    name: keyof MonetizationSettings,
    value: string | null
  ) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      monetizationSettings: {
        ...(prevChanges.monetizationSettings ?? {}),
        [name]: value,
      } as MonetizationSettings,
    }));
  };

  const handleAddProject = () => {
    if (!user || !newProject.name) return;

    const updatedProjects: Project[] = [
      ...(user.projects || []),
      { ...newProject, id: Date.now().toString(), userId: user.id },
    ];
    setChanges((prevChanges) => ({
      ...prevChanges,
      projects: updatedProjects,
    }));
    setNewProject({ name: "", description: "", link: "" });
  };

  const handleAddRepository = () => {
    if (!user || !newRepository.name || !newRepository.link) return;

    const updatedRepositories: Repository[] = [
      ...(user.repositories || []),
      { ...newRepository, id: Date.now().toString(), userId: user.id },
    ];
    setChanges((prevChanges) => ({
      ...prevChanges,
      repositories: updatedRepositories,
    }));
    setNewRepository({ name: "", link: "" });
  };
  console.log(session);
  const handleSave = useCallback(async () => {
    if (!user) {
      console.error("No user data available");
      return;
    }
    try {
      setLoading(true);
      console.log("Sending update request with changes:", changes);
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server responded with an error:", errorData);
        throw new Error(errorData.error || "Failed to update user settings");
      }

      const updatedUser: UserSettings = await response.json();
      console.log("Received updated user data:", updatedUser);
      setUser(updatedUser);
      setChanges({});
      setError(null);
      console.log("User settings updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Error updating user settings: ${errorMessage}`);
      console.error("Error in handleSave:", err);
    } finally {
      setLoading(false);
    }
  }, [user, changes]);
  const handleRenewApiKey = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/renew-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "renew-api-key" }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Key renewal error:", errorData);
        throw new Error(
          `Failed to renew API key: ${errorData.error || response.statusText}`
        );
      }

      const { apiKey } = await response.json();
      setUser((prevUser) => (prevUser ? { ...prevUser, apiKey } : null));
      setError(null);
      console.log("API key renewed successfully");
    } catch (err) {
      setError(
        `Error renewing API key: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveProject = (id: string) => {
    if (!user) return;

    const updatedProjects = user.projects.filter(
      (project) => project.id !== id
    );
    setChanges((prevChanges) => ({
      ...prevChanges,
      projects: updatedProjects,
    }));
  };

  const handleRemoveRepository = (id: string) => {
    if (!user) return;

    const updatedRepositories = user.repositories.filter(
      (repo) => repo.id !== id
    );
    setChanges((prevChanges) => ({
      ...prevChanges,
      repositories: updatedRepositories,
    }));
  };

  const mergedUser = { ...user, ...changes };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
      <NavBar />
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-white rounded-lg p-1 shadow-sm flex flex-wrap justify-center sm:justify-start">
            {[
              { value: "profile", icon: User },
              { value: "account", icon: Lock },
              { value: "notifications", icon: Bell },
              { value: "privacy", icon: Globe },
              { value: "projects", icon: Link },
              { value: "monetization", icon: DollarSign },
              { value: "advanced", icon: Settings },
            ].map(({ value, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white flex-1 sm:flex-none"
              >
                <Icon className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
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
                    <AvatarImage
                      src={user?.avatar || undefined}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || ""}
                    </AvatarFallback>
                  </Avatar>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Change Avatar
                  </Button>
                </div>
                {[
                  "username",
                  "email",
                  "bio",
                  "language",
                  "githubProfileLink",
                  "xProfileLink",
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
                        value={
                          (mergedUser[field as keyof UserSettings] as string) ||
                          ""
                        }
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    ) : field === "language" ? (
                      <Select
                        value={mergedUser.language || ""}
                        onValueChange={(value) =>
                          setChanges((prevChanges) => ({
                            ...prevChanges,
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
                        value={
                          (mergedUser[field as keyof UserSettings] as string) ||
                          ""
                        }
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
                    onClick={() =>
                      window.open(mergedUser.githubProfileLink || "", "_blank")
                    }
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Profile
                  </Button>
                  <Button
                    className="bg-blue-400 hover:bg-blue-500 text-white"
                    onClick={() =>
                      window.open(mergedUser.xProfileLink || "", "_blank")
                    }
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
                {[
                  "defaultPaymentAddress",
                  "selectedPaymentAddress",
                  "apiKey",
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
                    <div className="flex space-x-2">
                      <Input
                        id={field}
                        name={field}
                        value={
                          (mergedUser[field as keyof UserSettings] as string) ||
                          ""
                        }
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
                ))}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="two-factor"
                    checked={mergedUser.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setChanges((prevChanges) => ({
                        ...prevChanges,
                        twoFactorEnabled: checked,
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
                    checked={
                      mergedUser.notificationPreferences?.emailNotifications ??
                      false
                    }
                    onCheckedChange={handleNotificationChange}
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label
                    htmlFor="email-notifications"
                    className="text-gray-700"
                  >
                    Email Notifications
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
                    value={mergedUser.privacySettings?.profileVisibility || ""}
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
                    checked={mergedUser.privacySettings?.showEmail ?? false}
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
                  {mergedUser?.projects?.map((project) => (
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
                          href={project.link || "#"}
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
                      value={newProject.description || ""}
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
                      value={newProject.link || ""}
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
                  {mergedUser?.repositories?.map((repo) => (
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
                    value={mergedUser.monetizationSettings?.paymentMethod || ""}
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
                    value={
                      mergedUser.monetizationSettings?.subscriptionTier || ""
                    }
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
                      value={mergedUser.apiKey}
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
                    value={mergedUser.walletAddress}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="developer-mode"
                    checked={mergedUser.theme === "dark"}
                    onCheckedChange={(checked) =>
                      setChanges((prevChanges) => ({
                        ...prevChanges,
                        theme: checked ? "dark" : "light",
                      }))
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="developer-mode" className="text-gray-700">
                    Dark Mode
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-center sm:justify-end space-x-4">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => setChanges({})}
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