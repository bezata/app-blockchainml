"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  MapPin,
  Calendar,
  Award,
  BarChart2,
  Database,
  Star,
  MessageCircle,
  UserPlus,
  Share2,
} from "lucide-react";
import { NavBar } from "@/components/component/nav-bar";

export default function ViewUserProfilePageComponent() {
  const [activeTab, setActiveTab] = useState("overview");

  const user = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    location: "San Francisco, USA",
    joinDate: "March 2022",
    bio: "Machine learning researcher specializing in natural language processing and computer vision. Passionate about open-source AI development.",
    avatar: "https://i.pravatar.cc/300",
  };

  const achievements = [
    {
      icon: Database,
      title: "Data Guru",
      description: "Contributed 100+ high-quality datasets",
    },
    {
      icon: BarChart2,
      title: "Model Maestro",
      description: "Created 25+ popular AI models",
    },
    {
      icon: Star,
      title: "Community Star",
      description: "5000+ reputation points",
    },
  ];

  const activityData = [
    {
      type: "Dataset Upload",
      name: "Large Language Model Training Set",
      date: "2023-06-05",
    },
    {
      type: "Model Creation",
      name: "Advanced Image Recognition v3",
      date: "2023-05-30",
    },
    {
      type: "Forum Post",
      name: "Best Practices for Data Annotation",
      date: "2023-05-22",
    },
    {
      type: "Collaboration",
      name: "Joint NLP Research Project",
      date: "2023-05-15",
    },
  ];

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-8 p-6">
            <div className="text-center md:text-left">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
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
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {user.joinDate}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contribution Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Datasets Uploaded
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          90%
                        </span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Models Created
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          75%
                        </span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Community Engagement
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          95%
                        </span>
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
                <ul className="space-y-4">
                  {activityData.map((activity, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-gray-600">{activity.name}</p>
                      </div>
                      <Badge>{activity.date}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center p-6">
                    <achievement.icon className="w-12 h-12 text-green-500 mr-4" />
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
