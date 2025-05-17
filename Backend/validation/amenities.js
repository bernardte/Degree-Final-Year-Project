export const validateRoomAmenities = (amenitiesArray) => {
  console.log(amenitiesArray);
  const validAmenities = [
    "wifi",
    "tv",
    "air conditioning",
    "mini fridge",
    "private bathroom",
    "room service",
    "in room safe",
    "sofa",
    "desk lamp",
  ];

  return amenitiesArray.some((amenity) => validAmenities.includes(amenity));
};
