import { Router } from "express";
import {
  getWebsiteViews,
  incrementWebsiteViews,
} from "../controllers/view-controller";

const viewRouter = Router();

viewRouter.get("/", getWebsiteViews);
viewRouter.post("/", incrementWebsiteViews);

export default viewRouter;
