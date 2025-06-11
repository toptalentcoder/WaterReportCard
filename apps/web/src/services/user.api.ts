import { CreateUserPayload } from "@/types/types";
import api from "./api";
import { IF_ERROR_PERSISTS } from "@/utils/constants";

export const createUserAPI = async (payload: CreateUserPayload) => {
    try {
        const response = await api.post("https://lc9ugvtk4k.execute-api.us-west-2.amazonaws.com/prod/auth/signup", payload);

        return {
            data: response.data,
        };
    } catch (error: any) {
        console.error('Signup API error:', error.response?.data || error);
        return {
            error: error.response?.data?.error || error.response?.data?.message || IF_ERROR_PERSISTS,
        };
    }
};

// use JWT in header Bearer token format for authentication. route is: GET /users
export const getUserInfoAPI = async () => {
    try {
        const response = await api.get("/users");

        return {
            data: response.data,
        };
    } catch (error: any) {
        return {
            error: error.response ? error.response.data : IF_ERROR_PERSISTS,
        };
    }
};

export const confirmSignupAPI = async ({ email, code }: { email: string; code: string }) => {
    try {
        const response = await api.post("https://lc9ugvtk4k.execute-api.us-west-2.amazonaws.com/prod/auth/confirm", {
            email,
            code
        });

        return {
            data: response.data,
        };
    } catch (error: any) {
        console.error('Confirm signup API error:', error.response?.data || error);
        return {
            error: error.response?.data?.error || error.response?.data?.message || IF_ERROR_PERSISTS,
        };
    }
};