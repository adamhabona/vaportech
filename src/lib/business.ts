export const BUSINESS = {
  name: "VaporTech USA",
  tagline: "Smoke & Vape Shop",
  url: "https://www.smokecoralsprings.com",
  streetAddress: "8005 W Sample Rd",
  city: "Coral Springs",
  region: "FL",
  postalCode: "33065",
  country: "US",
  telephone: "(754) 241-5367",
  telephoneIntl: "+1-754-241-5367",
  telephoneTel: "+17542415367",
  geo: { lat: 26.2725067, lng: -80.2324204 },
  hoursLong: [
    { days: "Monday to Saturday", hours: "10:00 AM to 10:00 PM" },
    { days: "Sunday", hours: "10:00 AM to 8:00 PM" },
  ],
  // Machine-readable hours, store local time (America/New_York). Index 0 = Sunday.
  timeZone: "America/New_York",
  hoursByDay: [
    { open: 10, close: 20 },
    { open: 10, close: 22 },
    { open: 10, close: 22 },
    { open: 10, close: 22 },
    { open: 10, close: 22 },
    { open: 10, close: 22 },
    { open: 10, close: 22 },
  ],
  googlePlaceId: "ChIJNwiBhCoF2YgR3YbMnrUq-60",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Vaportech+Smoke+%26+Vape+Shop+Coral+Springs&query_place_id=ChIJNwiBhCoF2YgR3YbMnrUq-60",
  googleReviewsUrl:
    "https://search.google.com/local/reviews?placeid=ChIJNwiBhCoF2YgR3YbMnrUq-60",
  googleWriteReviewUrl:
    "https://search.google.com/local/writereview?placeid=ChIJNwiBhCoF2YgR3YbMnrUq-60",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=8005+W+Sample+Rd%2C+Coral+Springs%2C+FL+33065",
  socialImagePath: "/opengraph-image",
  founded: 2014,
  sameAs: [
    "https://www.facebook.com/vaportechusa",
    "https://www.instagram.com/vaportechusa",
  ],
  areaServed: [
    "Coral Springs",
    "Parkland",
    "Deerfield Beach",
    "Coconut Creek",
    "Margate",
    "Tamarac",
    "Pompano Beach",
    "Boca Raton",
  ],
} as const;
