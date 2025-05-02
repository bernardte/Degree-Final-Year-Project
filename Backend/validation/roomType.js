export const validateRoomType = (requestRoomType) => {
    const roomType = ["single", "double", "suite", "deluxe"];
    if (!roomType.includes(requestRoomType)) {
        return false; // Invalid room type
    }
    return true; // Valid room type
}