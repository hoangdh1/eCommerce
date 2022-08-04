import { Request, Response } from 'express';
import { ExceptionCode } from 'src/exceptions';
import { ICradle } from 'src/container';

interface IResponse {
    req?: Request;
    res: Response;
    data?: any;
    status_code?: number;
    message?: string;
    token?: string;
}

interface IResponseError {
    req?: Request;
    res: Response;
    status_code?: number;
    message?: string;
    exception_code: ExceptionCode;
}

export const successResponse = ({
    req,
    res,
    data,
    status_code,
    message,
    token,
}: IResponse) => {
    const statusCode = status_code || 204;

    return res.status(statusCode).send({
        signal: 1,
        message: message || 'SUCCESS',
        data,
        token,
    });
};

export const errorResponse = ({
    req,
    res,
    status_code,
    message,
    exception_code,
}: IResponseError) => {
    const statusCode = status_code || 500;

    return res.status(statusCode).send({
        signal: 0,
        message,
        exception_code,
    });
};

export const responseHelper = (iCradle: ICradle) => {
    return {
        successResponse,
        errorResponse,
    };
};
