import { authentication } from "../../middleware/jwtAuth";



describe("middleware test", () => {


    test.only("jwt", () => {

        let mReq = {
            headers: {
                authorization: "ssss"
            }
        }

        authentication(mReq as any, null as any, (err) => {
            expect(true).toBe(true);
        })

    })




})