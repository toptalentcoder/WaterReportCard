export type LoginPayload = {
    email: string;
    password: string;
};
  
export interface CreateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string; // You can make this more specific with union types if you know all the possible roles, e.g., role: "admin" | "user" | "guest";
}
  
export interface UserInfo {
    email: string;
    firstName: string;
    lastName: string;
    _id: string;
}
  
export interface IResponse {
    statusCode: StatusCode;
    data?: ResponseData;
    message?: string;
    error?: string;
}
  
type ResponseData = Record<string, any> | null;
  
export enum StatusCode {
    SUCCESS = 200, // Successful HTTP request. Default status code for successful GET or HEAD requests.
    CREATED = 201, // The request has been fulfilled and a new resource was created as a result.
    UPDATED = 202, // The request was accepted for processing, but not completed (not a guarantee that the operation will be completed successfully).
    DELETED = 204, // The request has been fulfilled and the resource was deleted, but the server doesn't need to return an entity-body with the response.
    BAD_REQUEST = 400, // The server could not understand the request due to invalid syntax.
    UNAUTHORIZED = 401, // The client must authenticate itself to get the requested response. This status is sent with a WWW-Authenticate header that contains information on how to authorize correctly.
    FORBIDDEN = 403, // The client does not have access rights to the content, i.e., they are unauthorized, so server is rejecting to give proper response.
    NOT_FOUND = 404, // The server can not find the requested resource. This can also mean that the endpoint is valid but the specific resource itself does not exist.
    INTERNAL_ERROR = 500, // The server encountered an unexpected condition which prevented it from fulfilling the request.
}