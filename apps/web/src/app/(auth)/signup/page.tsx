"use client";

import {
  CONTACT_US_AUTH,
  IF_ERROR_PERSISTS,
  LOCAL_STORAGE,
} from "@/utils/constants";
import { CreateUserPayload } from "@/types/types";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserAPI, getUserInfoAPI } from "@/services/user.api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserPayload>();

    const onSubmit = async (data: CreateUserPayload) => {
        setSubmitError("");
        console.log('Form submission data:', data);

        try {
            // Ensure all required fields are present
            if (!data.firstName || !data.lastName || !data.email || !data.password || !data.role) {
                setSubmitError('All fields are required');
                return;
            }

            const res = await createUserAPI(data);

            if (res.error) {
                setSubmitError(typeof res.error === 'string' ? res.error : res.error.message || 'An error occurred');
                return;
            }

            // Clear any existing tokens
            localStorage.removeItem(LOCAL_STORAGE.JWT_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE.USER_INFO);

            // Redirect to confirmation page with email parameter
            router.push(`/confirm?email=${encodeURIComponent(data.email)}`);
        } catch (error) {
            console.error("Error during account creation:", error);
            setSubmitError(IF_ERROR_PERSISTS);
        }
    };

    return (
        <>
            <div className="flex min-h-full h-screen flex-1">
                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <Image
                                priority
                                src={"/liquos-logo.png"}
                                alt="liquosLogo"
                                className="rounded-md shadow-2xl max-w-sm hover:cursor-pointer"
                                width={34}
                                height={34}
                                onClick={() => {
                                router.push("/");
                                }}
                            />
                            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Create your account
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mt-10">
                                <div className="space-y-6">
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            First Name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                {...register("firstName", { required: true })}
                                                id="firstName"
                                                type="text"
                                                placeholder="First Name"
                                                className="block w-full text-gray-800 rounded-md border-0 py-1.5 pl-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                                            />

                                            {errors.firstName && (
                                                <p className="text-red-500 mt-2 text-sm">
                                                First name is required.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="lastName"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Last Name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                {...register("lastName", { required: true })}
                                                id="lastName"
                                                type="text"
                                                placeholder="Last Name"
                                                className="block w-full text-gray-800 rounded-md border-0 py-1.5 pl-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                                            />

                                            {errors.lastName && (
                                                <p className="text-red-500 mt-2 text-sm">
                                                Last Name is required.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="role"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Role
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                {...register("role", { required: true })}
                                                id="role"
                                                className="block w-full text-gray-800 rounded-md border-0 py-1.5 pl-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                                            >
                                                <option value="">Select a role</option>
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>

                                            {errors.role && (
                                                <p className="text-red-500 mt-2 text-sm">
                                                    Role is required.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Email address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                {...register("email", { required: true })}
                                                id="email"
                                                type="email"
                                                placeholder="Email"
                                                className="block w-full text-gray-800 rounded-md border-0 py-1.5 pl-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                                            />

                                            {errors.email && (
                                                <p className="text-red-500 mt-2 text-sm">
                                                Email is required.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Password
                                            </label>
                                            <p
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="bg-neutral-100 bg-opacity-70 border-neutral-200 border-1 text-neutral-500 font-medium text-sm px-2 py-1 rounded-full"
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </p>
                                        </div>

                                        <div className="mt-2">
                                            <input
                                                {...register("password", { required: true })}
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                className="block w-full text-gray-800 rounded-md border-0 py-1.5 pl-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                                            />
                                            {errors.password && (
                                                <p className="text-red-500 mt-2 text-sm">
                                                Password is required
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        {submitError && (
                                            <p className="my-2 text-sm text-red-600">{submitError}</p>
                                        )}

                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                                        >
                                            {isSubmitting ? (
                                                <p>Creating Account...</p>
                                            ) : (
                                                <p>Create Account</p>
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <div className="text-sm leading-6">
                                        <Link
                                            href="/signin"
                                            className="font-semibold text-cyan-600 hover:text-cyan-500"
                                        >
                                            Log In
                                        </Link>
                                        </div>
                                        {/* separator */}
                                        <p className="px-3 text-cyan-600">|</p>

                                        <div className="text-sm leading-6">
                                        <a
                                            onClick={(e) => {
                                            e.preventDefault();
                                            alert(CONTACT_US_AUTH);
                                            }}
                                            className="font-semibold text-cyan-600 hover:text-cyan-500"
                                        >
                                            Forgot password?
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="relative hidden w-0 flex-1 lg:block">
                    <Image
                        layout="fill"
                        // width={1000}
                        // height={1000}
                        className="absolute inset-0 object-cover"
                        src="/Auth/bkg-img-waterIOT2.png"
                        alt=""
                    />
                </div>
            </div>
        </>
    );
}