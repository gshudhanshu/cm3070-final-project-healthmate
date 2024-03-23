import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

export function UserNav() {
  const { user, logout } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="dark:hover:bg-slate-700">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src="/avatars/01.png"
              alt={user?.username || "username"}
            />
            <AvatarFallback>
              {/* first character of first name and first character of last name */}
              {user?.first_name?.charAt(0) || "F"}
              {user?.last_name?.charAt(0) || "L"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
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
          <DropdownMenuItem>
            Profile
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          Log out
          {/* <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
