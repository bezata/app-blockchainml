"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Award,
    BarChart,
    BookOpen,
    Calendar,
    Code,
    Edit2,
    FileText,
    Flame,
    GitFork,
    GitPullRequest,
    Globe,
    Mail,
    MapPin,
    MessageSquare,
    Settings,
    Share2,
    Star,
    Trophy,
    User,
    X,
  } from "lucide-react";
import { NavBar } from "@/components/component/nav-bar";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  location: string;
  website: string;
  joinDate: string;
  followers: number;
  following: number;
  contributions: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  icon: React.ElementType;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === "authenticated") {
        try {
          // Simulating API call
          const response = await new Promise<UserProfile>((resolve) =>
            setTimeout(
              () =>
                resolve({
                  id: "1",
                  name: "Alice Johnson",
                  email: "alice@example.com",
                  bio: "Passionate developer | Open source enthusiast | AI researcher",
                  avatar: "https://i.pravatar.cc/150?img=1",
                  location: "San Francisco, CA",
                  website: "https://alicejohnson.dev",
                  joinDate: "January 2020",
                  followers: 1234,
                  following: 567,
                  contributions: 789,
                  achievements: [
                    {
                      id: "1",
                      title: "Code Ninja",
                      description: "Completed 100 coding challenges",
                      icon: Code,
                    },
                    {
                      id: "2",
                      title: "Open Source Hero",
                      description: "Contributed to 50 open source projects",
                      icon: Globe,
                    },
                    {
                      id: "3",
                      title: "AI Innovator",
                      description: "Published 5 AI research papers",
                      icon: Flame,
                    },
                  ],
                }),
              1000
            )
          );
          setUser(response);

          // Simulating activities fetch
          const activitiesResponse = await new Promise<Activity[]>((resolve) =>
            setTimeout(
              () =>
                resolve([
                  {
                    id: "1",
                    type: "star",
                    title: "Starred repository",
                    description: "react-awesome-components",
                    date: "2 days ago",
                    icon: Star,
                  },
                  {
                    id: "2",
                    type: "commit",
                    title: "Committed to repository",
                    description: "Fix bug in login component",
                    date: "3 days ago",
                    icon: Code,
                  },
                  {
                    id: "3",
                    type: "fork",
                    title: "Forked repository",
                    description: "awesome-machine-learning",
                    date: "5 days ago",
                    icon: GitFork,
                  },
                ]),
              1000
            )
          );
          setActivities(activitiesResponse);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          console.log("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [status]);

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <NavBar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-green-500">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow space-y-4 text-center md:text-left">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.bio}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <span className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user.location}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    {user.website}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {user.joinDate}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <X className="w-4 h-4 mr-2" />
                    alicecoding
                  </span>
                </div>
                <div className="flex justify-center md:justify-start gap-4">
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="w-5 h-5 mr-2" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Followers
                    </span>
                    <span className="font-bold">{user.followers}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Following
                    </span>
                    <span className="font-bold">{user.following}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Code className="w-4 h-4 mr-2" />
                      Contributions
                    </span>
                    <span className="font-bold">{user.contributions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center space-x-3"
                    >
                      <div className="bg-green-100 rounded-full p-2">
                        {React.createElement(
                          achievement.icon as React.ElementType,
                          {
                            className: "w-4 h-4 text-green-600",
                          }
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-gray-500">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Activity
                  </CardTitle>
                  <TabsList>
                    <TabsTrigger
                      value="overview"
                      className={
                        activeTab === "overview"
                          ? "bg-green-500 text-white"
                          : ""
                      }
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="repositories"
                      className={
                        activeTab === "repositories"
                          ? "bg-green-500 text-white"
                          : ""
                      }
                    >
                      Repositories
                    </TabsTrigger>
                    <TabsTrigger
                      value="projects"
                      className={
                        activeTab === "projects"
                          ? "bg-green-500 text-white"
                          : ""
                      }
                    >
                      Projects
                    </TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="overview">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Recent Activity
                      </h3>
                      {activities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <BarChart className="w-5 h-5 mr-2" />
                        Contribution Graph
                      </h3>
                      <ContributionGraph contributions={user.contributions} />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="repositories">
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Code className="w-5 h-5 mr-2" />
                            awesome-project-{index + 1}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            A collection of awesome things.
                          </p>
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              JavaScript
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1" />
                              123
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Updated 3 days ago
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="projects">
                  <div className="space-y-4">
                    {[1, 2].map((_, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Flame className="w-5 h-5 mr-2" />
                            Project {index + 1}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            Ongoing development project.
                          </p>
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              In Progress
                            </span>
                            <span className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />5 open issues
                            </span>
                            <span className="flex items-center">
                              <GitPullRequest className="w-4 h-4 mr-1" />2 pull
                              requests
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-start space-x-4 mb-4 cursor-pointer  hover:bg-gray-50 p-2 rounded-lg  transition-colors">
          <div className="bg-green-100 rounded-full p-2">
            {React.createElement(activity.icon as React.ElementType, {
              className: "w-4 h-4 text-green-600",
            })}
          </div>
          <div>
            <p className="font-medium">{activity.title}</p>
            <p className="text-sm text-gray-500">{activity.date}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {React.createElement(activity.icon as React.ElementType, {
              className: "w-5 h-5 mr-2",
            })}
            {activity.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>{activity.description}</p>
          <p className="text-sm text-gray-500 mt-2">{activity.date}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ContributionGraph({ contributions }: { contributions: number }) {
  const weeks = 52;
  const daysPerWeek = 7;
  const today = new Date();
  const oneYearAgo = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  );

  const generateContributions = () => {
    const data = [];
    for (let i = 0; i < weeks * daysPerWeek; i++) {
      const date = new Date(oneYearAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const count = Math.floor(Math.random() * 10); // Random contribution count (0-9)
      data.push({ date, count });
    }
    return data;
  };

  const contributionData = generateContributions();

  const getContributionColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count < 3) return "bg-green-100";
    if (count < 6) return "bg-green-300";
    if (count < 9) return "bg-green-500";
    return "bg-green-700";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-grid grid-cols-[repeat(52,_1fr)] gap-1 p-2 bg-white rounded-lg shadow">
        {Array.from({ length: weeks }).map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {Array.from({ length: daysPerWeek }).map((_, dayIndex) => {
              const contribution =
                contributionData[weekIndex * daysPerWeek + dayIndex];
              return (
                <TooltipProvider key={dayIndex}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={`w-3 h-3 rounded-sm ${getContributionColor(
                          contribution.count
                        )}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {contribution.count} contributions on{" "}
                        {formatDate(contribution.date)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <NavBar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="flex-grow space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    {index < 2 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-48" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[1, 2].map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-6 w-32 mb-4" />
                    {[1, 2, 3].map((_, subIndex) => (
                      <div
                        key={subIndex}
                        className="flex items-start space-x-4 mb-4"
                      >
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
