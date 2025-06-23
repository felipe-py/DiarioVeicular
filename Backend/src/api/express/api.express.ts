import express,  { Request, Response, Express } from "express";
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
        handler: (req: Request, res: Response) => void ) : void {
            this.app.get(path, handler);
            this.registeredRoute.push({method: "GET", path});
        }

    public addPostRoute(
        path: string,
        handler: (req: Request, res: Response) => void ) : void {
            this.app.post(path, handler);
            this.registeredRoute.push({method: "POST", path});
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