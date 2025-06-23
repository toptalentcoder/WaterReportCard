"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { CgMenuLeft, CgClose, CgAbstract } from "react-icons/cg";
import { HiOutlineNewspaper, HiOutlineShoppingCart } from "react-icons/hi";
import {
  PiGlobeHemisphereEastDuotone,
  PiSignOutDuotone,
  PiUserCircleDuotone,
} from "react-icons/pi";
import { RiDashboard2Line } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";
import { LOCAL_STORAGE, PROJECT_NAME } from "@/utils/constants";
import { CheckIfAuthenticated } from "@/utils/CheckIfAuthenticated";

import { classNames } from "@/utils/helpers";
import ProfileDropdown from "./ProfileDropdown";


const FloatingHeader = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const result = CheckIfAuthenticated();
    setIsAuthenticated(result);
    setLoadingAuth(false);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem(LOCAL_STORAGE.JWT_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.USER_INFO);

    // setIsAuthenticated(false);
    router.push("/");
  };

  const userNavigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: RiDashboard2Line,
    },
    {
      name: "Your profile",
      href: "/dashboard/profile",
      icon: PiUserCircleDuotone,
    },
    {
      name: "Sign out",
      href: "/",
      icon: PiSignOutDuotone,
      onClick: handleSignOut,
    },
  ];

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const callsToAction = [
  //   { name: "Privacy Policy", href: "#", icon: CgAbstract }, //TODO
  //   { name: "Contact sales", href: "#", icon: FiPhoneCall }, //TODO
  // ];

  let navItems = [
    {
      name: "Water Map",
      description: "View water quality data on a map",
      href: "/waterMap",
      icon: PiGlobeHemisphereEastDuotone,
    },
    {
      name: "Buy Liquos Labs",
      description: "Buy Liquos Labs Sensor",
      href: "/buy",
      icon: HiOutlineShoppingCart,
    },
    {
      name: "Blog",
      description: "Read our blog",
      href: "/blog",
      icon: HiOutlineNewspaper,
    },
  ];

  if (isAuthenticated) {
    navItems = [
      ...navItems,
      {
        name: "Dashboard",
        description: "View your smart Liquos Labs device data",
        href: "/dashboard",
        icon: RiDashboard2Line,
      },
    ];
  }

  const renderAuthLinks = () => {
    /* Auth links */

    return (
      <div className="flex flex-row space-x-6 items-center">
        <Link
          href="/signin"
          className="text-gray-700 hover:text-cyan-600 font-medium text-base"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="text-cyan-700 border-2 border-cyan-600 hover:border-cyan-500 hover:text-cyan-600 active:border-cyan-700 active:text-cyan-700 font-medium text-base py-1.5 px-3.5 rounded-full"
        >
          Sign Up
        </Link>
      </div>
    );
  };

  return (
    <>
      <header
        className="fixed top-4 left-1/2 transform -translate-x-1/2 rounded-full shadow-md z-50 
    h-14 flex items-center container mx-auto justify-between p-4 px-8 backdrop-blur-md bg-opacity-80"
      >
        <Link
          href=""
          className="flex flex-row "
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Image
            src="/liquos-logo.png"
            width={25}
            height={25}
            alt="Liquos Logo"
          />
          {mobileMenuOpen ? (
            <CgClose className="text-gray-600 hover:text-gray-900 h-6 w-6 ml-2 flex lg:hidden" />
          ) : (
            <CgMenuLeft className="text-gray-600 hover:text-gray-900 h-6 w-6 ml-2 flex lg:hidden" />
          )}
        </Link>

        {/* Navigation links */}
        <nav className="space-x-4 hidden lg:flex items-center ">
          {navItems.map((item) =>
            item.href === "/buy" ? (
              <button
                key={item.name}
                className={`font-medium text-base py-2 px-4 backdrop-blur-md bg-opacity-40 hover:text-gray-900 hover:bg-slate-100 rounded-md ${
                  isModalOpen
                    ? "bg-slate-50 text-gray-700 border"
                    : "text-gray-600"
                }`}
                onClick={() => {
                  if (pathname === item.href) return;
                  setIsModalOpen(!isModalOpen);
                }}
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium text-base py-2 px-4 backdrop-blur-md bg-opacity-40 hover:text-gray-900 hover:bg-slate-100 rounded-md ${
                  pathname === item.href && !isModalOpen
                    ? "bg-slate-50 text-gray-700 border"
                    : "text-gray-600"
                }`}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>
        {loadingAuth ? (
          <p className="text-slate-600 text-base font-medium">Loading...</p>
        ) : isAuthenticated ? (
          <ProfileDropdown
            userNavigation={userNavigation}
            darkBg={!mobileMenuOpen && pathname === "/"}
          />
        ) : (
          renderAuthLinks()
        )}
      </header>

      {/* Modal */}
      <div
        className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-500 ${
          isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div
              className="absolute inset-0 bg-slate-500 opacity-75"
              onClick={closeModal}
            ></div>
          </div>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-xl sm:w-full py-2">
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex">
              <div className="w-1/3">
                <Image
                  src="/liquos-bot-image.png"
                  width={250}
                  height={250}
                  alt="Liquos Labs Sensor"
                />
              </div>

              <div className="w-2/3 pl-4">
                <h2 className="text-2xl mb-2 font-semibold text-gray-800">
                  Liquos Labs Sensor
                </h2>
                <div className="mb-4 text-gray-700">
                  <span className="font-medium text-xl">$99.99</span>
                </div>
                <p className="mb-6 text-gray-600 leading-relaxed">
                  Stay informed about your water safety with the Liquos Labs Sensor.
                  This smart IoT water filter will provide precise measurements
                  of water quality and accurately detect when it&apos;s time to
                  replace your existing system&apos;s filter. Know that your
                  water is safe.
                </p>

                <Link
                  // href="https://buy.stripe.com/test_bIYcPu2MKgDe0q4144" //dev test link
                  href="/buy"
                  // className="text-gray-700 hover:text-cyan-600 font-medium text-base"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-full self-end"
                >
                  View more details
                </Link>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dialog Popover Menu */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 flex w-full flex-col justify-between overflow-y-auto bg-white  sm:ring-1 sm:ring-gray-900/10">
          <div className="p-6">
            <div className="flex items-center justify-between">
              {/* <Link href="/" className="-m-1.5 p-1.5"> */}
              <span className="sr-only">{PROJECT_NAME}</span>
              {/* <Image
                  className="h-8 w-auto"
                  src="/liquos-logo.png"
                  alt="liquos logo"
                  width={25}
                  height={25}
                /> */}
              {/* </a> */}
              {/* <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <CgClose className="h-6 w-6" aria-hidden="true" />
              </button> */}
            </div>
            <div className="mt-14 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navItems.map((item: any) => (
                    <Link
                      key={item.name}
                      onClick={() => setMobileMenuOpen(false)}
                      href={item.href}
                      className={classNames(
                        "group -mx-3 flex items-center gap-x-6 rounded-lg p-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                        pathname === item.href ? "bg-gray-100" : ""
                      )}
                    >
                      <div
                        className={classNames(
                          "flex h-11 w-11 flex-none items-center justify-center rounded-lg group-hover:bg-white",
                          pathname === item.href ? "bg-white" : "bg-gray-50"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            "h-6 w-6  group-hover:text-cyan-600",
                            pathname === item.href
                              ? "text-cyan-600"
                              : "text-gray-600"
                          )}
                          aria-hidden="true"
                        />
                      </div>
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* <div className="py-6">{renderAuthLinks()}</div> */}
              </div>
            </div>
          </div>
          {/* <div className="sticky bottom-0 grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 text-center">
            {callsToAction.map((item: any) => (
              <Link
                key={item.name}
                href={item.href}
                className="p-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-100"
              >
                {item.name}
              </Link>
            ))}
          </div> */}
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default FloatingHeader;