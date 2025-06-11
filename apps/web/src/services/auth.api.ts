import { IF_ERROR_PERSISTS } from "@/utils/constants";
import api from "./api";
import { LoginPayload } from "@/types/types";

export const loginAPI = async ({ email, password }: LoginPayload) => {
    try {
        const response = await api.post("/auth/login", {
        email,
        password,
        });

        return {
        data: response.data,
        };
    } catch (error: any) {
        return {
        error: error.response ? error.response.data : IF_ERROR_PERSISTS,
        };
    }
};

export const logoutAPI = async () => {
    try {
        const response = await api.post("/auth/logout");

        return response;
    } catch (error: any) {
        return {
        error: error.response ? error.response.data.message : "An error occurred",
        };
    }
};