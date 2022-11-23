export class User {
    #_id!: string;
    #name!: string;
    #username!: string;
    #password!: string;
    #confirmPassword!: string;

    get _id(): string {
        return this.#_id;
    }

    get username(): string {
        return this.#username;
    }

    set username(username: string) {
        this.#username = username;
    }

    get password(): string {
        return this.#password;
    }

    set password(password: string) {
        this.#password = password;
    }

    constructor(name: string, username: string, password: string, confirmPassword: string) {
        this.#name = name;
        this.#username = username;
        this.#password = password;
        this.#confirmPassword = confirmPassword;
    }

    ToJson() {
        return {
            name: this.#name,
            username: this.#username,
            password: this.#password
        }
    }

    reset(): void {
        this.username = "";
        this.password = "";
    }
}