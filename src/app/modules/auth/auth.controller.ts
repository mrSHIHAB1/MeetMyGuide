import passport from "passport"

import { catchAsync } from "../../utils/catchAsync"
import { NextFunction, Request, Response } from "express"
import AppError from "../../errorHelpers/AppError"
import { createUserTokens } from "../../utils/userTokens"
import { setAuthCookie } from "../../utils/setCookie"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service"


const credentialsLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", async (err:any, user:any, info:any) => {
    if (err) {
      return next(new AppError(401, err));
    }
    if (!user) {
      return next(new AppError(401, info?.message || "Unauthorized"));
    }

    try {
      const userTokens = await createUserTokens(user);

      const { password, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
const logout=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})
const getMe = catchAsync(async (req: Request, res: Response) => {
    const userSession = req.cookies;
    const result = await AuthServices.getMe(userSession);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User retrive successfully!",
        data: result,
    });
});
export const AuthControllers = {
    credentialsLogin,
   logout,
   getMe
}