import { ADMIN_ID } from "../config/config";

export function isAdmin(user_id: number): boolean {

    if (user_id === ADMIN_ID) {
        return true;
    } else {
        return false;
    }
};
