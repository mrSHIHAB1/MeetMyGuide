import express, { NextFunction, Request, Response } from "express"
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createAdminZodSchema,createGuideZodSchema,createTouristZodSchema, updateZodSchema, userValidation} from "./user.validation";
import { fileUploader } from "../../helpers/fileUpload";

const router =express.Router();

router.post(
  "/register/tourist",
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {

    req.body = userValidation.createTouristZodSchema.parse(
      JSON.parse(req.body.data)
    );

    return UserControllers.createTourist(req, res, next);
  }
);

router.post("/register/admin", fileUploader.upload.single('file'), validateRequest(createAdminZodSchema), UserControllers.createAdmin)
router.post("/register/guide", fileUploader.upload.single('file'), validateRequest(createGuideZodSchema), UserControllers.createGuide)
router.get("/all-users",checkAuth(Role.ADMIN), UserControllers.getAllUsers)
router.patch("/updateUsers/:id",validateRequest(updateZodSchema),checkAuth(Role.ADMIN),UserControllers.Updatuser)
export const UserRoutes=router;