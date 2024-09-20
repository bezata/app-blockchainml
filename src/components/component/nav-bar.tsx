"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import Image from "next/image";
import {
  Star,
  X,
  Menu,
  ChevronDown,
  User,
  Wallet,
  DollarSign,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/router";
import { SubscriptionPopupComponent } from "@/components/subscription-popup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NavLink from "./nav-link";
import {
  LayoutDashboardIcon,
  DatabaseIcon,
  ViewIcon,
  SaveIcon,
} from "./nav-link";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const [isClient, setIsClient] = useState(false);
  const { open } = useAppKit();
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const profileMenuItems = [
    { icon: LayoutDashboard, label: "My Dashboard" },
    { icon: Wallet, label: "Wallet", onClick: () => open() },
    { icon: DollarSign, label: "Monetization" },
    { icon: Settings, label: "Settings" },
    { icon: User, label: "Profile" },
    { icon: LogOut, label: "Logout", onClick: () => disconnect() },
  ];

  const ProfileMenu = ({ isMobile = false }) => (
    <div
      className={`${
        isMobile ? "w-full" : "w-56"
      } bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none`}
    >
      <div className="px-4 py-3 flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-gray-700">
          Connected to Base
        </span>
      </div>
      <div className="py-1">
        {profileMenuItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => {
              if (item.onClick) item.onClick();
              if (isMobile) setIsMobileProfileOpen(false);
              else setIsProfileMenuOpen(false);
            }}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative bg-white text-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <nav className="flex items-center space-x-8">
          <button onClick={() => router.push("/")}>
            <Image src="/angry.png" alt="Logo" width={48} height={48} />
          </button>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/" icon={<LayoutDashboardIcon />} text="Dashboard" />
            <NavLink href="/datasets" icon={<DatabaseIcon />} text="Dataset" />
            <NavLink href="/models" icon={<ViewIcon />} text="Models" />
            <NavLink
              href="/savedItems"
              icon={<SaveIcon />}
              text="Saved Items"
            />
            <NavLink href="/monetization" icon={<DollarSign />} text="Earn" />
          </div>
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="outline"
            className="bg-yellow-200 gap-1 text-yellow-700 hover:bg-yellow-100 border-yellow-400 rounded-full px-6 transition-all duration-300"
            onClick={() => setIsSubscriptionOpen(true)}
          >
            <Star />
            Premium
          </Button>
          <SubscriptionPopupComponent
            isOpen={isSubscriptionOpen}
            setIsOpen={setIsSubscriptionOpen}
            isYearly={isYearly}
            setIsYearly={setIsYearly}
          />
          {isClient ? (
            address ? (
              <div className="relative">
                <Button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-700">Profile</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 z-10"
                    >
                      <ProfileMenu />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 rounded-full px-6 transition-all duration-300"
                onClick={() => open()}
              >
                Sign In
              </Button>
            )
          ) : (
            <Button
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 rounded-full px-6 transition-all duration-300"
            >
              Loading...
            </Button>
          )}
        </div>
        <div className="md:hidden flex items-center space-x-2">
          {isClient && address && (
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setIsMobileProfileOpen(true)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md md:hidden z-50">
          <nav className="flex flex-col items-start p-4 space-y-4">
            <NavLink href="/" icon={<LayoutDashboardIcon />} text="Dashboard" />
            <NavLink href="/datasets" icon={<DatabaseIcon />} text="Dataset" />
            <NavLink href="/models" icon={<ViewIcon />} text="Models" />
            <NavLink
              href="/savedItems"
              icon={<SaveIcon />}
              text="Saved Items"
            />
            <NavLink href="/monetization" icon={<DollarSign />} text="Earn" />
            {isClient && !address && (
              <Button
                variant="outline"
                className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200 rounded-full px-6 transition-all duration-300"
                onClick={() => open()}
              >
                Sign In
              </Button>
            )}
            <Button
              variant="outline"
              className="bg-yellow-200 gap-1 w-full text-yellow-700 hover:bg-yellow-100 border-yellow-400 rounded-full px-6 transition-all duration-300"
              onClick={() => setIsSubscriptionOpen(true)}
            >
              <Star />
              Premium
            </Button>
          </nav>
        </div>
      )}

      <Dialog open={isMobileProfileOpen} onOpenChange={setIsMobileProfileOpen}>
        <DialogContent className="border-none sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <ProfileMenu isMobile={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}


