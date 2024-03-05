export const buildingTypes: {
  [key: string]: {
    type: string,
    subtypes: string[],
  }
} = {

  ["residential"]: {
    type: "Residential",
    subtypes: [
      "Single Family Home",
      "Multi Family Home",
      "Town House",
      "Apartment",
      "Condominuim",
      "Mobile Home",
      "Modular Home",
      "Student Housing",
      "Duplexe",
      "Mansion",
      "Other",
    ]
  },

  ["commercial"]: {
    type: "Commercial",
    subtypes: [
      "Office Building",
      "Convention Center",
      "Shopping Center/Mall",
      "Hotel",
      "Restaurant",
      "Bank",
      "Medical Facility",
      "Educational Building",
      "Retail Building",
      "Parking Structure",
      "Other",
    ]
  },

  ["entertainment"]: {
    type: "Entertainment",
    subtypes: [
      "Theater",
      "Museum/Art Gallery",
      "Sports Facility",
      "Amphitheater",
      "Cinema",
      "Night Club",
      "Casino",
      "Theme Park",
      "Concert Hall",
      "Library",
      "Other",
    ]
  },

  ["industrial"]: {
    type: "Industrial",
    subtypes: [
      "Factory",
      "Mills",
      "Processing Plant",
      "Cold Storage Facility",
      "Data Center",
      "Warehouse",
      "Other",
    ]
  },

} as const;