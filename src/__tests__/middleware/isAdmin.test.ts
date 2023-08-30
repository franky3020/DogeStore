import isAdminMiddleware from "../../middleware/isAdmin";
import { ADMIN_ID } from "../../config/config";

test("test admin middleware", () => {
  let mReq = {
    authUserID: ADMIN_ID,
  };

  isAdminMiddleware(mReq as any, null as any, (err) => {
    expect(true).toBe(true);
  });

  mReq = {
    authUserID: ADMIN_ID + 2, // Not Admin
  };

  isAdminMiddleware(mReq as any, null as any, (err) => {
    expect(err).toBeInstanceOf(Error);
  });
});
