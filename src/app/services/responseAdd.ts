import { ErrorResponseAdd } from './errorResponseAdd';

export interface ResponseAdd{
    idToken:string,
    email:string,
    refreshToken:string,
    expiresIn:string,
    localId:string,
    error:ErrorResponseAdd
}