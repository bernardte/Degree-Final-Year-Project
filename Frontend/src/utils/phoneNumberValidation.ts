export const phoneNumberValidation = (phone: string): boolean => {
  const regex = /^(?:\+60[1-9][0-9]{8})$|^(0[1-9][0-9]{8})$/;

  return regex.test(phone);
};
