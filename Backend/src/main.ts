import { ApiExpress } from "./api/express/api.express";
import { CarController } from "./api/express/controllers/car.controller";
import { UserController } from "./api/express/controllers/user.controller";
import { authMiddleware } from "./middleware/user.authenticate.middleware";
import cors from "cors";

const api = ApiExpress.build();
const userController = UserController.build();
const carController = CarController.build();

export const app = api.expressApp;

api.expressApp.use(cors());

api.addPostRoute("/users/register", userController.create);
api.addPostRoute("/users/login", userController.login);

api.addPostRoute("/cars/register", authMiddleware, carController.create);
api.addPatchRoute(
  "/cars/update/:car_license",
  authMiddleware,
  carController.update
);
api.addGetRoute("/cars/findCar", authMiddleware, carController.find);
api.addGetRoute("/dashboard", authMiddleware, carController.findByOwner);
api.addDeleteRoute("/cars/delete", authMiddleware, carController.delete);

function startServer() {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
  api.start(port);
}

if (require.main === module) {
  startServer();
}
