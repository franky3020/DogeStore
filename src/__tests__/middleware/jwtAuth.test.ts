import { authentication } from "../../middleware/jwtAuth";
import JWTService from "../../service/JWTService";


test("jwt authorization headers is not in format", () => {

    let mReq = {
        headers: {
            authorization: "ssss"
        }
    }

    authentication(mReq as any, null as any, (err) => {
        expect(err).toBeInstanceOf(Error);
    })

    let undefine_auth_mReq = {
        headers: {
        }
    };

    authentication(undefine_auth_mReq as any, null as any, (err) => {
        expect(err).toBeInstanceOf(Error);
    })

})




jest.mock('../../service/JWTService', ()=>{
    return {
        decodedUserJWT2UserId: jest.fn().mockReturnValueOnce(null).mockReturnValueOnce(2)// return user id =2
    }
});

test("jwt authorization headers is good", async () => {

    let mReq = {
        headers: {
            authorization: "ssss s"
        },
        authUserID: null
    }

    let mockRes = {  // for => res.status(401).json({ message: 'Unauthorized!' });
        status: jest.fn(()=>{
            return {
                json: jest.fn()
            }
        })
    };

    await authentication(mReq as any, mockRes as any, null as any);
    expect(mockRes.status).toHaveBeenCalledTimes(1);


    await authentication(mReq as any, mockRes as any, ()=>{});
    expect(mReq.authUserID).toBe(2);
})




