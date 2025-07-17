import { ApiExpress } from "./api/express/api.express";
import { CarController } from "./api/express/controllers/car.controller";
import { UserController } from "./api/express/controllers/user.controller";
import { authMiddleware } from "./middleware/user.authenticate.middleware";

function main () {
    const api = ApiExpress.build();

    const userController = UserController.build();
    const carController = CarController.build();

    api.addPostRoute("/users/register", userController.create);
    api.addPostRoute("/users/login", userController.login);
    api.addPostRoute("cars/register", authMiddleware, carController.create);

    api.start(8000);
}

main();