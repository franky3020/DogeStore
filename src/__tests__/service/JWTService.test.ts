
import JWTService from "../../service/JWTService";
import User from "../../entity/User";

test("check jwt sign decoded ", async () => {

    let user = new User(1, "email@email", "nickname", "pw");
    let jwt = JWTService.signUserJWT(user);
    let user_id = await JWTService.decodedUserJWT2UserId(jwt);
    expect(user_id).toBe(user.id);
});

test("jwt decoded when fail", async () => {
    let user_id = await JWTService.decodedUserJWT2UserId("error jwt");
    expect(user_id).toBe(null);
});