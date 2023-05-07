
import JWTService from "../../service/JWTService";
import User from "../../entity/User";

const jwtToken =  'jwt_token';

test("check jwt sign decoded ", async () => {


    let user = new User(1, "email@email", "nickname", "pw");

    
    let jwt = JWTService.signUserJWT(user, jwtToken);
    let user_id = await JWTService.decodedUserJWT2UserId(jwt, jwtToken);
    expect(user_id).toBe(user.id);
});

test("jwt decoded when fail", async () => {
    let user_id = await JWTService.decodedUserJWT2UserId("error jwt", jwtToken);
    expect(user_id).toBe(null);
});