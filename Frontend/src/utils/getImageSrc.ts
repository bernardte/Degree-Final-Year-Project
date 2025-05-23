const getImageSrc = (img: string | File | (string | File)[]) => {
  if (Array.isArray(img)) {
    const first = img[0];
    return first instanceof File ? URL.createObjectURL(first) : first;
  }
  if (img instanceof File) {
    return URL.createObjectURL(img);
  }
  if (typeof img === "string") {
    return img;
  }
  return undefined;
};

export default getImageSrc;