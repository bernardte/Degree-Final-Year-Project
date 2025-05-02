export const validateRoomAmenities = (amenities) => {
  const validAmenities = [
    "wifi",
    "tv",
    "ac",
    "fridge",
    "balcony",
    "bathtub",
    "pool",
    "gym",
    "parking",
    "breakfast",
  ];

  return amenities.some((amenity) => validAmenities.includes(amenity));
};
