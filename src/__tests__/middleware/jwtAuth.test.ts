import { authentication } from "../../middleware/jwtAuth";



test("jwt authorization headers is not in format", () => {

    let mReq = {
        headers: {
            authorization: "ssss"
        }
    }

    authentication(mReq as any, null as any, (err) => {
        expect(true).toBe(true);
    })

})

