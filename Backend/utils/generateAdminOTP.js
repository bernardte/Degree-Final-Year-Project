export const generateOTP = () => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let otp = "";
        const length = 6;

        for(let i = 0; i < length; i++){
            const randomIndex = Math.floor(Math.random() * characters.length);
            otp += characters[randomIndex]
        }

        return otp;
}