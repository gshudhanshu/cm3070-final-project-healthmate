// Import necessary components from Shadcn and Heroicons
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PhoneIcon,
  PhoneXMarkIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const IncomingCallDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Incoming Call</Button>
      </DrawerTrigger>
      <DrawerOverlay />
      <DrawerContent className="bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <DrawerHeader className="flex items-center justify-between">
          <div>
            <Avatar>
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}` ?? ""}
              />
              <AvatarFallback>
                {/* {message.sender.first_name[0] + message.sender.last_name[0]} */}
              </AvatarFallback>
            </Avatar>
            <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Incoming Call
            </DrawerTitle>
            <DrawerDescription className="text-sm text-gray-500 dark:text-gray-400">
              John Doe is calling...
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <DrawerFooter className="flex justify-center gap-4">
          <Button className="flex items-center gap-2">
            <PhoneIcon className="w-5 h-5" />
            Accept
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <PhoneXMarkIcon className="w-5 h-5" />
            Decline
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default IncomingCallDrawer;
