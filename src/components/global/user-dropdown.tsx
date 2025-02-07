
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/server/auth/auth-client";
import { UserType } from "@prisma/client";
import { LogOut, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";

interface UserDropdownProps {
    email: string;
    name: string;
    image: string;
    userType?: UserType | null;
}

interface NavigationItem {
    href: string;
    label: string;
    icon: LucideIcon;
    allowedUserTypes?: UserType[];
}

const NAVIGATION_ITEMS: NavigationItem[] = [];

export function UserDropdown({ email, name, image, userType }: UserDropdownProps) {
    // Memoize initials calculation
    const initials = useMemo(() => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    }, [name]);

    // Filter navigation items based on userType
    const filteredNavigationItems = useMemo(() => {
        return NAVIGATION_ITEMS.filter((item) => {
            if (!item.allowedUserTypes) return true;
            return userType && item.allowedUserTypes.includes(userType as UserType);
        });
    }, [userType]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-auto p-0 hover:bg-transparent focus-visible:ring-2"
                    aria-label={`Open menu for ${name}`}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={image}
                            alt={`${name}'s profile picture`}
                            className="object-cover"
                        />
                        <AvatarFallback aria-label={`${initials} (profile picture fallback)`}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56"
                align="end"
                sideOffset={8}
            >
                <DropdownMenuLabel className="flex min-w-0 flex-col space-y-1">
                    <span className="truncate text-sm font-medium">
                        {name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                        {email}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {filteredNavigationItems.map(({ href, label, icon: Icon }) => (
                        <DropdownMenuItem asChild key={href}>
                            <Link href={href} className="flex w-full items-center gap-2"
                                aria-label={`Navigate to ${label}`}>
                                <Icon
                                    size={16}
                                    strokeWidth={2}
                                    className="opacity-60"
                                    aria-hidden="true"
                                />
                                <span>{label}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <form
                        action={async () => {
                            await signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        toast.success("Logged out successfully");
                                    }
                                }
                            });
                        }}
                    >
                        <button type="submit" className="w-full flex items-center gap-2">
                            <LogOut
                                size={16}
                                strokeWidth={2}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Logout</span>
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}