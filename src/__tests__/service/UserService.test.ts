
import User from "../../entity/User";
import UserService from "../../service/UserService";

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

    const userService = new UserService(mockUserDAO as any);
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
    const userService = new UserService(mockUserDAO as any);

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
    const userService = new UserService(mockUserDAO as any);
    userService.bcryptComparePassword = jest.fn().mockReturnValue(false);

    let isUserPasswordRight = await userService.checkUserPassword(user_init_1.email, user_init_1.password);
    expect(isUserPasswordRight).toBe(false);
});



test("get user JWT", async () => {
   
    let mockUserDAO = {
        findByEmail: jest.fn()
    };

    mockUserDAO.findByEmail.mockReturnValue(
        new User(user_init_1.id, user_init_1.email, user_init_1.nickname, user_init_1.password)
    );

    let mockFunction = JWTService.signUserJWT as jest.Mock<any, any>;
    let mockJwtReturn = "token";
    mockFunction.mockReturnValue(mockJwtReturn);

    const userService = new UserService(mockUserDAO as any);
    userService.checkUserPassword = jest.fn().mockReturnValue(true);

    let jwt = await userService.getUserJWT(user_init_1.email, user_init_1.password);
    expect(jwt).toBe(mockJwtReturn);
});

test("Not get user JWT", async () => {
    const userService = new UserService(null as any);
    userService.checkUserPassword = jest.fn().mockReturnValue(false);

    let jwt = await userService.getUserJWT(user_init_1.email, user_init_1.password);
    expect(jwt).toBe(null);
});



test("Add new user when email is exist", async () => {

    const userService = new UserService(null as any);
    userService.checkUserEmailExist = jest.fn().mockReturnValue(false);
    await expect(userService.addNewUser(user_init_1.email,user_init_1.nickname, user_init_1.password)).rejects.toThrowError();
});


test("bcryptPassword", async () => {

    const userService = new UserService(null as any);

    let testPassword = "password";
    let hash = await userService.bcryptPassword(testPassword);
    let isPass = await userService.bcryptComparePassword(testPassword, hash);

    expect(isPass).toBe(true);
});

test("Check user email exist", async () => {

    let mockUserDAO = {
        findByEmail: jest.fn()
    };

    mockUserDAO.findByEmail.mockReturnValue(
        new User(user_init_1.id, user_init_1.email, user_init_1.nickname, user_init_1.password)
    )

    const userService = new UserService(mockUserDAO as any);

    let isUserExist = await userService.checkUserEmailExist(user_init_1.email);
    expect(isUserExist).toBe(true);

    mockUserDAO.findByEmail.mockReturnValue(
        null
    )

    isUserExist = await userService.checkUserEmailExist(user_init_1.email);
    expect(isUserExist).toBe(false);



});





