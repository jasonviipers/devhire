"use client";

import { UserType } from "@prisma/client";
import { BrandLogo } from "./brand-logo";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { useMemo } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { AuthModal } from "../auth/auth-modal";
import { UserDropdown } from "./user-dropdown";

interface NavigationItem {
  name: string;
  href: string;
  roles?: UserType[];
}

interface User {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  userType?: UserType | null;
}

interface NavigationProps {
  navigation: NavigationItem[];
  user?: User | null;
}

const APP_NAME = {
  FIRST_PART: 'Dev',
  HIGHLIGHTED_PART: 'Hire'
} as const;

const APP_DESCRIPTION = 'Find your dream job today';

const getFilteredNavigation = (navigation: NavigationItem[], userType: UserType | null): NavigationItem[] => {
  return navigation.filter(item => {
    if (!item.roles) return true;
    return userType && item.roles.includes(userType);
  });
};

const LoginButton = () => {
  const { openAuthModal } = useAuthStore();

  return (
    <Button
      variant="outline"
      size="default"
      className="px-4"
      onClick={openAuthModal}
    >
      Login
    </Button>
  );
};

const NavigationLink = ({ item, className }: { item: NavigationItem; className?: string }) => (
  <Link href={item.href}
    className={buttonVariants({
      variant: "default",
      className: className || "px-4"
    })}
  >
    {item.name}
  </Link>
);

const DesktopNavigation = ({ navigation, user }: NavigationProps) => {
  const filteredNav = useMemo(() =>
    getFilteredNavigation(navigation, user?.userType || null),
    [navigation, user?.userType]
  );

  return (
    <div className="hidden md:flex items-center gap-4">
      <ThemeToggle />
      {filteredNav.map((item) => (
        <NavigationLink key={item.name} item={item} />
      ))}
      {user ? (
        <UserDropdown
          email={user.email ?? ''}
          name={user.name ?? 'Anonymous'}
          image={user.image ?? ''}
          userType={user.userType}
        />
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

const MobileNavigation = ({ navigation, user }: NavigationProps) => {
  const filteredNav = useMemo(() =>
    getFilteredNavigation(navigation, user?.userType || null),
    [navigation, user?.userType]
  );

  return (
    <div className="md:hidden flex items-center gap-3">
      <ThemeToggle />
      {user ? (
        <UserDropdown
          email={user.email ?? ''}
          name={user.name ?? 'Anonymous'}
          image={user.image ?? ''}
          userType={user.userType}
        />

      ) : (
        <LoginButton />
      )}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open navigation menu">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="text-left">
            <SheetTitle>
              {APP_NAME.FIRST_PART}
              <span className="text-primary">{APP_NAME.HIGHLIGHTED_PART}</span>
            </SheetTitle>
            <SheetDescription>
              {APP_DESCRIPTION}
            </SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-6">
            {filteredNav.map((item) => (
              <NavigationLink
                key={item.name}
                item={item}
                className="w-full justify-start text-base"
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export function Header({ user }: { user: User | null }) {
  const { isAuthModalOpen, closeAuthModal, } = useAuthStore();
  const navItems: NavigationItem[] = [
    {
      name: "Find Jobs",
      href: "/jobs",
      roles: ["JOB_SEEKER"]
    },
    {
      name: "Create Job",
      href: "/company/jobs/create",
      roles: ["COMPANY"]
    },
    {
      name: "My Jobs",
      href: "/company/jobs",
      roles: ["COMPANY"]
    },
  ];


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/30">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <BrandLogo />
          <DesktopNavigation navigation={navItems} user={user} />
          <MobileNavigation navigation={navItems} user={user} />
        </div>
      </header>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </>
  );
}