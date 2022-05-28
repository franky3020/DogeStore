export default class User {

    id: number|null;
    email: string;
    nickname: string;
    password: string;

    constructor(id: number|null, email: string, nickname: string, password: string) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.password = password;
    }

}