import express, { Request, Response } from 'express'
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVars } from './app/config/env';
import router from './app/routes';
import passport from 'passport';
import "./app/config/passport";
import expressSession from "express-session";
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { PaymentController } from './app/modules/payment/payment.controller';
const app=express();

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:['http://localhost:3000', 'https://meet-my-guide-frontend.vercel.app'],
    credentials:true,
}))
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  PaymentController.handleWebhook
);

app.use("/api/v1",router)
app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({
        message:"GUIDE"
    })
})

app.use(globalErrorHandler)

app.use(notFound)
export default app;