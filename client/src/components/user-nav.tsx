"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuthStore } from "@/store/useAuthStore";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import { useEffect } from "react";

export function UserNav() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const {
    patientProfile,
    doctorProfile,

    fetchPatientProfile,
    fetchDoctorProfile,
  } = useUserProfileStore();

  // Effect hook to fetch user profile data on component mount
  useEffect(() => {
    // Fetch user profile data if user is logged in
    if (user?.username) {
      // Determine account type and fetch corresponding profile data
      user.account_type === "doctor"
        ? fetchDoctorProfile(user?.username)
        : fetchPatientProfile(user?.username);
    }
  }, []);

  return (
    <DropdownMenu>
      {/* Dropdown menu trigger */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="dark:hover:bg-slate-700">
          {/* Avatar component with user image and fallback initials */}
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                (user?.account_type === "doctor"
                  ? doctorProfile?.profile_pic
                  : patientProfile?.profile_pic) || ""
              }
              alt={user?.username || "username"}
            />
            <AvatarFallback>
              {user?.first_name?.charAt(0) || "F"}
              {user?.last_name?.charAt(0) || "L"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      {/* Dropdown menu content */}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{user?.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Profile link */}
          <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
            Profile
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* Log out option */}
        <DropdownMenuItem
          onClick={() => {
            logout();
            router.push("/auth/login");
          }}
        >
          Log out
          {/* <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
