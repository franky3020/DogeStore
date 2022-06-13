
import User from "../../entity/User";
import UserService from "../../service/UserService";
import UserDAO from "../../repositories/UserDAO";

import JWTService from "../../service/JWTService";
jest.mock("../../service/JWTService");

const user_init_1 = {
    id: 1,
    email: "email",
    nickname: "nickname",
    password: "pw"
}

test("check find user and pass", async () => {
   
    let mockUserDAO = {
        findByEmail: jest.fn()
    };
    mockUserDAO.findByEmail.mockReturnValue(
        new User(user_init_1.id, user_init_1.email, user_init_1.nickname, user_init_1.password)
    );

    const userService = new UserService(mockUserDAO as unknown as UserDAO);
    userService.bcryptComparePassword = jest.fn().mockReturnValue(true);

    let isUserPasswordRight = await userService.checkUserPassword(user_init_1.email, user_init_1.password);
    expect(isUserPasswordRight).toBe(true);

});


test("check not find user and fail", async () => {
   
    let mockUserDAO = {
        findByEmail: jest.fn()
    };
    mockUserDAO.findByEmail.mockReturnValue(
        null
    );
    const userService = new UserService(mockUserDAO as unknown as UserDAO);

    let isUserPasswordRight = await userService.checkUserPassword(user_init_1.email, user_init_1.password);
    expect(isUserPasswordRight).toBe(false);

});

test("check find user but password incorrect", async () => {
   
    let mockUserDAO = {
        findByEmail: jest.fn()
    };
    mockUserDAO.findByEmail.mockReturnValue(
        new User(user_init_1.id, user_init_1.email, user_init_1.nickname, user_init_1.password)
    );
    const userService = new UserService(mockUserDAO as unknown as UserDAO);
    userService.bcryptComparePassword = jest.fn().mockReturnValue(false);

    let isUserPasswordRight = await userService.checkUserPassword(user_init_1.email, user_init_1.password);
    expect(isUserPasswordRight).toBe(false);
});



test("getUserJWT", async () => {
   
    let mockUserDAO = {
        findByEmail: jest.fn()
    };

    mockUserDAO.findByEmail.mockReturnValue(
        new User(user_init_1.id, user_init_1.email, user_init_1.nickname, user_init_1.password)
    );

    let mockFunction = JWTService.signUserJWT as jest.Mock<any, any>;
    let mockJwtReturn = "token";
    mockFunction.mockReturnValue(mockJwtReturn);

    const userService = new UserService(mockUserDAO as unknown as UserDAO);
    userService.checkUserPassword = jest.fn().mockReturnValue(true);

    let jwt = await userService.getUserJWT(user_init_1.email, user_init_1.password);
    expect(jwt).toBe(mockJwtReturn);
});

test("Not getUserJWT", async () => {
    const userService = new UserService(null as unknown as UserDAO);
    userService.checkUserPassword = jest.fn().mockReturnValue(false);

    let jwt = await userService.getUserJWT(user_init_1.email, user_init_1.password);
    expect(jwt).toBe(null);
});



