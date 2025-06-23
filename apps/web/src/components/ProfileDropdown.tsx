"use client";

import { useEffect, useState, Fragment } from "react";
import { LOCAL_STORAGE } from "@/utils/constants";
import { CheckIfAuthenticated } from "@/utils/CheckIfAuthenticated";
import { UserInfo } from "@/types/types";
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Link from "next/link";

interface Props {
  userNavigation: {
    name: string;
    href: string;
    // takes in an icon component, e.g.
    icon: any;
    onClick?: () => void;
  }[];
  darkBg?: boolean;
}

export default function ProfileDropdown({ userNavigation, darkBg }: Props) {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { firstName, lastName } = userInfo || {};

  useEffect(() => {
    const result = CheckIfAuthenticated();

    const userInfoString = localStorage.getItem(LOCAL_STORAGE.USER_INFO);
    if (userInfoString) {
      const userInfo: UserInfo = JSON.parse(userInfoString);
      setUserInfo(userInfo);
    } else {
      console.log("User info not found in localStorage");
    }
  }, [router]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const getInitials = () => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : "";
    const lastInitial = lastName ? lastName[0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div>
      <Menu as="div" className="relative">
        <Menu.Button className="-m-1.5 flex items-center justify-center p-1.5 hover:bg-slate-100 rounded-md">
          <span className="sr-only">Open user menu</span>
          <span className="flex items-center space-x-2">
            <div className="flex items-center justify-center font-semibold text-xs md:text-sm h-8 w-8 rounded-full bg-cyan-600 text-white">
              {getInitials()}
            </div>
            <p
              className="hidden sm:flex ml-4 text-sm font-semibold leading-6 text-gray-700"
              aria-hidden="true"
            >
              {/* <p aria-hidden="true" className=""> */}
              {firstName} {lastName}
              {/* </p> */}
            </p>
            <ChevronDownIcon
              className="ml-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={classNames(
              "absolute right-0 z-10 mt-2.5 px-4 origin-top-right rounded-md py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none bg-white"
            )}
          >
            {userNavigation.map((item) => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <Link
                    href={item.href}
                    className={classNames(
                      "w-[130px] flex flex-row text-sm font-medium text-gray-700 items-center hover:bg-gray-100 rounded-md px-3 py-2 mt-1",
                      active ? "bg-gray-100 text-gray-900" : ""
                    )}
                    onClick={item.onClick}
                  >
                    <item.icon
                      className={classNames(
                        "h-5 w-5 mr-2 group-hover:text-cyan-600",
                        active ? "bg-gray-100 text-cyan-700" : ""
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}