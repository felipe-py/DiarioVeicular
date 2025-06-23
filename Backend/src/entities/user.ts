export type UserProps = {
    id: string;
    email: string;
    password: string;
    name: string;
};

export class User {
    private constructor(readonly props: UserProps) {}

    public static create(email: string, password: string, name: string) {
        return new User({
            id: crypto.randomUUID().toString(),
            email,
            password, 
            name,
        });
    }

    public static with(
        id: string,
        email: string,
        password: string,
        name: string
    ) {
        return new User({
            id,
            email,
            password,
            name
        });
    }

    public get id() {
        return this.props.id;
    }

    public get email() {
        return this.props.email;
    }

    public get password() {
        return this.props.password;
    }

    public get name() {
        return this.props.name;
    }
}