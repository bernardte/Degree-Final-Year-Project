export const emailValidation = (email: string): boolean => {
    const regex = /^\S+@\S+\.\S+$/;

    return !regex.test(email);
}