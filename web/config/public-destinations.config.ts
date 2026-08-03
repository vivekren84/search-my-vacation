export type PublicDestinationCard = {
  destinationId: string;
  title: string;
  label: string;
  copy: string;
  imageKey: string;
};

export type PublicDestinationGroup = {
  id: "india" | "international" | "wildlife";
  eyebrow: string;
  title: string;
  copy: string;
  cards: PublicDestinationCard[];
};

export const publicDestinationGroups: PublicDestinationGroup[] = [
  {
    id: "india",
    eyebrow: "India",
    title: "A country of many different journeys.",
    copy: "From heritage and coast to hills, forests and island time—each place asks for a different kind of traveller story.",
    cards: [
      ["agra", "Agra", "India · Heritage", "For timeless architecture, quiet wonder and a journey with perspective.", "agra"],
      ["amritsar", "Amritsar", "India · Culture", "For generous hospitality, living history and meaningful local connection.", "amritsar"],
      ["andaman", "Andaman", "India · Islands", "For clear water, open skies and days that move at the pace of the sea.", "andaman"],
      ["assam", "Assam", "India · River & wildlife", "For tea country, river landscapes and a closer connection with nature.", "assam"],
      ["goa", "Goa", "India · Coast", "For sunlit pauses, culture and a relaxed rhythm by the shore.", "goa"],
      ["gujarat", "Gujarat", "India · Heritage & nature", "For craft, colour and landscapes that reward curiosity.", "gujarat"],
      ["himachal-pradesh", "Himachal Pradesh", "India · Mountains", "For fresh air, quieter mornings and room to reset.", "himachal-pradesh"],
      ["hyderabad", "Hyderabad", "India · Food & heritage", "For rich flavours, historic layers and vibrant city energy.", "hyderabad"],
      ["karnataka", "Karnataka", "India · Culture & nature", "For a journey that moves between heritage, coffee country and green space.", "karnataka"],
      ["kashmir", "Kashmir", "India · Mountains & valleys", "For wide landscapes and a complete change of pace.", "kashmir"],
      ["kerala", "Kerala", "India · Backwaters & hills", "For unhurried days shaped by water, green space and gentle comfort.", "kerala"],
      ["northeast", "Northeast", "India · Hills & culture", "For slower roads, layered local stories and nature-led discovery.", "northeast"],
      ["pondicherry", "Pondicherry", "India · Coast & culture", "For a small change of rhythm between cafés, coast and calm streets.", "pondicherry"],
      ["rajasthan", "Rajasthan", "India · Heritage", "For colour, history and stories that unfold at their own pace.", "rajasthan"],
      ["tamil-nadu", "Tamil Nadu", "India · Culture & coast", "For temple towns, local flavours and journeys with depth.", "tamil-nadu"],
      ["vizag", "Vizag", "India · Coast & hills", "For sea views, green hills and an easy coastal reset.", "vizag"],
    ].map(([destinationId, title, label, copy, imageKey]) => ({ destinationId, title, label, copy, imageKey })),
  },
  {
    id: "international",
    eyebrow: "International",
    title: "A world worth exploring thoughtfully.",
    copy: "These are Release 1 starting points for travellers ready to see somewhere new with confidence.",
    cards: [
      ["bali", "Bali", "Indonesia · Ritual & renewal", "For warm light, generous culture and moments of quiet discovery.", "bali"],
      ["dubai", "Dubai", "United Arab Emirates · City & desert", "For polished stays, striking contrasts and celebratory energy.", "dubai"],
      ["malaysia", "Malaysia", "Malaysia · Cities & coast", "For easy variety between food, culture, rainforest and shoreline.", "malaysia"],
      ["singapore", "Singapore", "Singapore · City & gardens", "For a smooth rhythm of design, food and green spaces.", "singapore"],
      ["sri-lanka", "Sri Lanka", "Sri Lanka · Coast & culture", "For tea country, coastline and stories that invite a slower look.", "sri-lanka"],
      ["thailand", "Thailand", "Thailand · Islands & culture", "For warm hospitality, vibrant food and time by the water.", "thailand"],
      ["vietnam", "Vietnam", "Vietnam · Culture & discovery", "For layered stories, vivid flavours and journeys full of perspective.", "vietnam"],
    ].map(([destinationId, title, label, copy, imageKey]) => ({ destinationId, title, label, copy, imageKey })),
  },
  {
    id: "wildlife",
    eyebrow: "Nature and wildlife",
    title: "For journeys led by the natural world.",
    copy: "The right wildlife journey values patience, respect for place and enough time to notice what is around you.",
    cards: [
      ["bandipur", "Bandipur", "India · Forest", "For thoughtful time in a landscape shaped by conservation and quiet.", "bandipur"],
      ["corbett", "Corbett", "India · Forest & river", "For open landscapes, river air and a slower pace close to nature.", "corbett"],
      ["kabini", "Kabini", "India · Forest", "For calm forest stays and the possibility of seeing life beyond the everyday.", "kabini"],
      ["masinagudi", "Masinagudi", "India · Nilgiris", "For a gentle nature escape at the meeting point of hills and forest.", "masinagudi"],
      ["wildlife", "Wildlife experiences", "India · Nature-led journeys", "For journeys that make space for the natural world and patient observation.", "wildlife"],
    ].map(([destinationId, title, label, copy, imageKey]) => ({ destinationId, title, label, copy, imageKey })),
  },
];
