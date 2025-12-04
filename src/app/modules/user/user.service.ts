import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { fileUploader } from "../../helpers/fileUpload";

const createTourist=async(payload:Partial<IUser>, file?: Express.Multer.File)=>{
    const {email,password, ...rest}=payload;

    const isUserExist=await User.findOne({email});
    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User already Exist")
    }

    let profilePicture: string | undefined;
    if (file) {
        const uploadResult = await fileUploader.uploadToCloudinary(file);
        profilePicture = uploadResult?.secure_url;
    }

    const hashedPassword=await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND))
    const user =await User.create({
        email,
        role: 'TOURIST',
        password:hashedPassword,
        picture: profilePicture,
        ...rest
    })
    return user;
}
const createadmin=async(payload:Partial<IUser>, file?: Express.Multer.File)=>{
    const {email,password, ...rest}=payload;

    const isUserExist=await User.findOne({email});
    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User already Exist")
    }

    let profilePicture: string | undefined;
    if (file) {
        const uploadResult = await fileUploader.uploadToCloudinary(file);
        profilePicture = uploadResult?.secure_url;
    }

    const hashedPassword=await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND))
    const user =await User.create({
        email,
        role: 'ADMIN',
        password:hashedPassword,
        picture: profilePicture,
        ...rest
    })
    return user;
}
const createguide=async(payload:Partial<IUser>, file?: Express.Multer.File)=>{
    const {email,password, ...rest}=payload;

    const isUserExist=await User.findOne({email});
    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User already Exist")
    }

    let profilePicture: string | undefined;
    if (file) {
        const uploadResult = await fileUploader.uploadToCloudinary(file);
        profilePicture = uploadResult?.secure_url;
    }

    const hashedPassword=await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND))
    const user =await User.create({
        email,
        role: 'GUIDE',
        password:hashedPassword,
        picture: profilePicture,
        ...rest
    })
    return user;
}


const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const updatedUserr = await User.findByIdAndUpdate(id, payload, { new: true });


  if (!updatedUserr) {
    throw new Error('User not found');
  }

return updatedUserr
};

export const UserServices={
     getAllUsers,
   
    createTourist,
    createadmin,
    createguide,
      updateUser 
}