import express,  { Request, Response, Express, RequestHandler } from "express";
import { Api } from "../api";

interface RegisteredRoute {
    method: string;
    path: string;
}

export class ApiExpress implements Api {

    private registeredRoute: RegisteredRoute[] = [];
    private constructor(readonly app: Express) {}

    public static build() {
        const app = express();
        app.use(express.json());
        return new ApiExpress(app);
    }

    public addGetRoute(
        path: string,
        ...handlers: RequestHandler[]): void {
            this.app.get(path, ...handlers);
            this.registeredRoute.push({method: "GET", path});
        }

    public addPostRoute(
        path: string,
        ...handlers: RequestHandler[]) : void {
            this.app.post(path, ...handlers);
            this.registeredRoute.push({method: "POST", path});
        }
    
    public addDeleteRoute(
        path: string,
        ...handlers: RequestHandler[]) : void {
            this.app.delete(path, ...handlers);
            this.registeredRoute.push({method: "DELETE", path});
        }
    
    public addPatchRoute(
        path: string,
        ...handlers: RequestHandler[]) : void {
            this.app.patch(path, ...handlers);
            this.registeredRoute.push({method: "PATCH", path});
        }

    public start(port: number) {
        this.app.listen(port, () => {
            console.log("Server runing on port " + port);
            this.printRoutes();
        })
    }

    private printRoutes() {
        console.log(" === REGISTERED ROUTES ===\n");
        console.table(this.registeredRoute);
    }
}