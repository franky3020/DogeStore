

const ADMIN_ID = 1;

// 需搭配jwtAuth
export function isAdmin(user_id: number): boolean {

    if (user_id === ADMIN_ID) {
        return true;
    } else {
        return false;
    }
};

