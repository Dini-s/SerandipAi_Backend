import UserActivityLog from "../models/UserActivityLog";

export const logactivity = async (userId, action, metadata = {}) => {
    try {
        await UserActivityLog.create({
            user: userId,
            action,
            metadata,
        });
    } catch (error) {
        consolr.log("Activity log error:" + error.message);
    }
}