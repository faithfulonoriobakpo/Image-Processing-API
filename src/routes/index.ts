import express from "express";
import imageRoute from "./api/images";

const routes = express.Router();

routes.use('/api', imageRoute);

export default routes;