import { ApiExpress } from "./api/express/api.express";
import { UserController } from "./api/express/controllers/user.controller";

function main () {
    const api = ApiExpress.build();

    const controller = UserController.build();

    api.addPostRoute("/users/register", controller.create);

    api.start(8000);
}

main();