"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { confirmSignupAPI } from "@/services/user.api";
import { IF_ERROR_PERSISTS } from "@/utils/constants";

interface ConfirmFormData {
    code: string;
}

export default function ConfirmPage() {
    const [submitError, setSubmitError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ConfirmFormData>();

    const onSubmit = async (data: ConfirmFormData) => {
        setSubmitError("");

        if (!email) {
            setSubmitError("Email is missing from the URL");
            return;
        }

        try {
            const res = await confirmSignupAPI({ email, code: data.code });

            if (res.error) {
                setSubmitError(typeof res.error === 'string' ? res.error : res.error.message || 'An error occurred');
                return;
            }

            // Redirect to login page after successful confirmation
            router.push("/signin");
        } catch (error) {
            console.error("Error during confirmation:", error);
            setSubmitError(IF_ERROR_PERSISTS);
        }
    };

    return (
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
                            Confirm your email
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please enter the verification code sent to {email}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mt-10">
                            <div className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="code"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Verification Code
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            {...register("code", { required: true })}
                                            id="code"
                                            type="text"
                                            placeholder="Enter verification code"
                                            className="block w-full text-gray-800 rounded-md border-0 py-1.5 pl-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                                        />

                                        {errors.code && (
                                            <p className="text-red-500 mt-2 text-sm">
                                                Verification code is required.
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
                                            <p>Verifying...</p>
                                        ) : (
                                            <p>Verify Email</p>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="relative hidden w-0 flex-1 lg:block">
                <Image
                    layout="fill"
                    className="absolute inset-0 object-cover"
                    src="/Auth/bkg-img-waterIOT2.png"
                    alt=""
                />
            </div>
        </div>
    );
} 