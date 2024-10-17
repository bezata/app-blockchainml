import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export const BlockedUsersModal = ({
  isOpen,
  onClose,
  blockedUsers,
  onUnblock,
}: {
  isOpen: boolean;
  onClose: () => void;
  blockedUsers: BlockedUser[];
  onUnblock: (id: string) => void;
}) => {
  const mockBlockedUsers: BlockedUser[] = [
    {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "2",
      name: "Jane Smith",
      username: "janesmith",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "3",
      name: "Bob Johnson",
      username: "bobjohnson",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  // Use mockBlockedUsers if blockedUsers is empty
  const displayedUsers =
    blockedUsers.length > 0 ? blockedUsers : mockBlockedUsers;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4">
            Blocked Users
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          {blockedUsers.length === 0 ? (
            <p className="text-center text-gray-500">No blocked users</p>
          ) : (
            blockedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUnblock(user.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Unblock
                </Button>
              </div>
            ))
          )}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
