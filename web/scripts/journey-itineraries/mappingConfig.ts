export type ItineraryMappingConfig = {
  id: string;
  parentDestination: string;
  aliases?: string[];
  journeyDirectorCandidateIds?: string[];
  journeyDirectorRegionIds?: string[];
  parentDefault?: boolean;
};

export const ITINERARY_MAPPING_BY_CODE: Readonly<Record<string, ItineraryMappingConfig>> = {
  "KL-MUN": { id: "kerala-munnar", parentDestination: "Kerala", aliases: ["Munnar hill retreat"], journeyDirectorCandidateIds: ["kerala"], journeyDirectorRegionIds: ["india-kerala-munnar"] },
  "KL-MAC": { id: "kerala-munnar-alleppey-kochi", parentDestination: "Kerala", aliases: ["Alappuzha", "Alleppey", "Kochi", "Cochin", "Kerala circuit", "Kerala backwaters"], journeyDirectorCandidateIds: ["kerala"], journeyDirectorRegionIds: ["india-kerala-kochi"], parentDefault: true },
  "UP-AGR": { id: "uttar-pradesh-agra", parentDestination: "Uttar Pradesh", journeyDirectorCandidateIds: ["agra"], journeyDirectorRegionIds: ["india-agra-agra"], parentDefault: true },
  "PB-AMR": { id: "punjab-amritsar", parentDestination: "Punjab", aliases: ["Golden Temple"], parentDefault: true },
  "AN-AND": { id: "andaman-islands", parentDestination: "Andaman Islands", aliases: ["Andaman", "Swaraj Dweep", "Shaheed Dweep"], journeyDirectorCandidateIds: ["andaman"], journeyDirectorRegionIds: ["india-andaman-port-blair", "india-andaman-havelock", "india-andaman-neil-island"], parentDefault: true },
  "GA-GOA": { id: "goa", parentDestination: "Goa", journeyDirectorCandidateIds: ["goa"], journeyDirectorRegionIds: ["india-goa-north-goa", "india-goa-south-goa", "india-goa-baga", "india-goa-calangute", "india-goa-anjuna"], parentDefault: true },
  "GJ-GIR": { id: "gujarat-gir-forest", parentDestination: "Gujarat", aliases: ["Gir", "Sasan Gir", "Gir National Park"], journeyDirectorCandidateIds: ["gujarat", "wildlife"], journeyDirectorRegionIds: ["india-gujarat-gir-national-park", "india-wildlife-tours-gir-national-park"] },
  "GJ-DWK": { id: "gujarat-panch-dwarka", parentDestination: "Gujarat", aliases: ["Dwarka", "Bet Dwarka", "Panch Dwarka"], journeyDirectorCandidateIds: ["gujarat"], journeyDirectorRegionIds: ["india-gujarat-porbandar"] },
  "HP-SHM": { id: "himachal-pradesh-shimla-manali", parentDestination: "Himachal Pradesh", journeyDirectorCandidateIds: ["himachal-pradesh"], journeyDirectorRegionIds: ["india-himachal-pradesh-shimla", "india-himachal-pradesh-manali"], parentDefault: true },
  "HP-DHD": { id: "himachal-pradesh-dharamshala-dalhousie", parentDestination: "Himachal Pradesh", aliases: ["McLeod Ganj", "Dalhousie"], journeyDirectorCandidateIds: ["himachal-pradesh"], journeyDirectorRegionIds: ["india-himachal-pradesh-dharamshala", "india-himachal-pradesh-dalhousie"] },
  "AS-WLD": { id: "assam-wildlife-tour", parentDestination: "Assam", aliases: ["Kaziranga", "Kaziranga National Park"], journeyDirectorCandidateIds: ["wildlife"] },
  "AS-HER": { id: "assam-heritage-city-tour", parentDestination: "Assam", aliases: ["Guwahati", "Sivasagar", "Majuli"], parentDefault: true },
  "GJ-RAK": { id: "gujarat-rann-of-kutch", parentDestination: "Gujarat", aliases: ["Rann", "Kutch", "White Desert"], journeyDirectorCandidateIds: ["gujarat"], journeyDirectorRegionIds: ["india-gujarat-rann-of-kutch"], parentDefault: true },
  "TG-HYD": { id: "telangana-hyderabad", parentDestination: "Telangana", aliases: ["Hyderabad"], journeyDirectorCandidateIds: ["hyderabad"], journeyDirectorRegionIds: ["india-telangana-hyderabad"], parentDefault: true },
  "KA-HMP": { id: "karnataka-hampi", parentDestination: "Karnataka", journeyDirectorCandidateIds: ["karnataka"], journeyDirectorRegionIds: ["india-karnataka-hampi"] },
  "KA-COR": { id: "karnataka-coorg", parentDestination: "Karnataka", aliases: ["Kodagu"], journeyDirectorCandidateIds: ["karnataka"], journeyDirectorRegionIds: ["india-karnataka-coorg"], parentDefault: true },
  "KA-BLR": { id: "karnataka-bengaluru", parentDestination: "Karnataka", aliases: ["Bangalore", "Bengaluru"], journeyDirectorCandidateIds: ["karnataka"], journeyDirectorRegionIds: ["india-karnataka-bangalore"] },
  "KA-KBN": { id: "karnataka-kabini", parentDestination: "Karnataka", journeyDirectorCandidateIds: ["karnataka", "wildlife"], journeyDirectorRegionIds: ["india-karnataka-kabini", "india-wildlife-tours-kabini"] },
  "KA-BND": { id: "karnataka-bandipur", parentDestination: "Karnataka", journeyDirectorCandidateIds: ["karnataka", "wildlife"], journeyDirectorRegionIds: ["india-karnataka-bandipur", "india-wildlife-tours-bandipur"] },
  "JK-KMR": { id: "jammu-kashmir-srinagar-gulmarg-pahalgam", parentDestination: "Jammu & Kashmir", aliases: ["Kashmir"], journeyDirectorCandidateIds: ["kashmir"], journeyDirectorRegionIds: ["india-kashmir-srinagar", "india-kashmir-gulmarg", "india-kashmir-pahalgam"], parentDefault: true },
  "KL-WAY": { id: "kerala-wayanad", parentDestination: "Kerala", journeyDirectorCandidateIds: ["kerala"], journeyDirectorRegionIds: ["india-kerala-wayanad"] },
  "ML-SHL": { id: "northeast-meghalaya", parentDestination: "Northeast India", aliases: ["Meghalaya", "Shillong", "Cherrapunji", "Sohra", "Dawki", "Mawlynnong"], journeyDirectorCandidateIds: ["northeast"], journeyDirectorRegionIds: ["india-northeast-meghalaya"], parentDefault: true },
  "SK-GTK": { id: "northeast-sikkim", parentDestination: "Northeast India", aliases: ["Sikkim", "Gangtok", "Lachen", "Lachung", "Pelling"], journeyDirectorCandidateIds: ["northeast"], journeyDirectorRegionIds: ["india-northeast-sikkim"] },
  "PY-PON": { id: "pondicherry", parentDestination: "Puducherry", aliases: ["Puducherry"], journeyDirectorCandidateIds: ["pondicherry"], journeyDirectorRegionIds: ["india-pondicherry-pondicherry"], parentDefault: true },
  "RJ-JJU": { id: "rajasthan-jaipur-jodhpur-udaipur", parentDestination: "Rajasthan", aliases: ["Jaipur Jodhpur Udaipur", "JJU"], journeyDirectorCandidateIds: ["rajasthan"], journeyDirectorRegionIds: ["india-rajasthan-jaipur", "india-rajasthan-jodhpur", "india-rajasthan-udaipur"], parentDefault: true },
  "RJ-UKM": { id: "rajasthan-udaipur-kumbhalgarh-mount-abu", parentDestination: "Rajasthan", aliases: ["Udaipur Kumbhalgarh Mount Abu", "UKM"], journeyDirectorCandidateIds: ["rajasthan"], journeyDirectorRegionIds: ["india-rajasthan-udaipur", "india-rajasthan-mount-abu"] },
  "RJ-JJJ": { id: "rajasthan-jaipur-jodhpur-jaisalmer", parentDestination: "Rajasthan", aliases: ["Jaipur Jodhpur Jaisalmer", "JJJ"], journeyDirectorCandidateIds: ["rajasthan"], journeyDirectorRegionIds: ["india-rajasthan-jaipur", "india-rajasthan-jodhpur", "india-rajasthan-jaisalmer"] },
  "TN-TMP": { id: "tamil-nadu-temple-tour", parentDestination: "Tamil Nadu", aliases: ["Tamil Nadu temples", "Rameswaram", "Madurai", "Thanjavur", "Chidambaram", "Kumbakonam"], journeyDirectorCandidateIds: ["tamil-nadu"], journeyDirectorRegionIds: ["india-tamilnadu-chidambaram", "india-tamilnadu-madurai", "india-tamilnadu-trichy"], parentDefault: true },
  "TN-CHE": { id: "tamil-nadu-chennai", parentDestination: "Tamil Nadu", aliases: ["Chennai", "Madras"], journeyDirectorCandidateIds: ["tamil-nadu"] },
  "TN-KTG": { id: "tamil-nadu-kotagiri", parentDestination: "Tamil Nadu", journeyDirectorCandidateIds: ["tamil-nadu"], journeyDirectorRegionIds: ["india-tamilnadu-kotagiri"] },
  "TN-KDK": { id: "tamil-nadu-kodaikanal", parentDestination: "Tamil Nadu", journeyDirectorCandidateIds: ["tamil-nadu"], journeyDirectorRegionIds: ["india-tamilnadu-kodaikanal"] },
  "TN-OOT": { id: "tamil-nadu-ooty", parentDestination: "Tamil Nadu", aliases: ["Udhagamandalam"], journeyDirectorCandidateIds: ["tamil-nadu"], journeyDirectorRegionIds: ["india-tamilnadu-ooty"] },
  "TN-MSN": { id: "tamil-nadu-masinagudi", parentDestination: "Tamil Nadu", journeyDirectorCandidateIds: ["tamil-nadu", "wildlife"], journeyDirectorRegionIds: ["india-tamilnadu-masinagudi", "india-wildlife-tours-masinagudi"] },
  "AP-VIZ": { id: "andhra-pradesh-visakhapatnam-araku", parentDestination: "Andhra Pradesh", aliases: ["Vizag", "Visakhapatnam", "Araku"], journeyDirectorCandidateIds: ["vizag"], journeyDirectorRegionIds: ["india-andhra-pradesh-vizag"], parentDefault: true },
  "UK-CBT": { id: "uttarakhand-corbett-national-park", parentDestination: "Uttarakhand", aliases: ["Corbett", "Jim Corbett", "Jim Corbett National Park", "Ramnagar"], journeyDirectorCandidateIds: ["wildlife"], parentDefault: true },
  "ID-BAL": { id: "bali", parentDestination: "Bali", aliases: ["Ubud", "Seminyak", "Kuta", "Uluwatu", "Nusa Dua"], journeyDirectorCandidateIds: ["bali"], journeyDirectorRegionIds: ["indonesia-bali-ubud", "indonesia-bali-seminyak", "indonesia-bali-uluwatu", "indonesia-bali-nusa-dua"], parentDefault: true },
  "AE-DXB": { id: "dubai", parentDestination: "United Arab Emirates", aliases: ["Dubai", "UAE"], journeyDirectorCandidateIds: ["dubai"], journeyDirectorRegionIds: ["united-arab-emirates-dubai"], parentDefault: true },
  "MY-KUL": { id: "malaysia-kuala-lumpur", parentDestination: "Malaysia", aliases: ["Kuala Lumpur", "KL", "city break"], journeyDirectorCandidateIds: ["malaysia"], journeyDirectorRegionIds: ["malaysia-kuala-lumpur"], parentDefault: true },
  "MY-KLL": { id: "malaysia-kuala-lumpur-langkawi", parentDestination: "Malaysia", aliases: ["Langkawi", "KL and Langkawi", "Kuala Lumpur and Langkawi"], journeyDirectorCandidateIds: ["malaysia"], journeyDirectorRegionIds: ["malaysia-kuala-lumpur", "malaysia-langkawi"] },
  "SG-SIN": { id: "singapore", parentDestination: "Singapore", journeyDirectorCandidateIds: ["singapore"], journeyDirectorRegionIds: ["singapore-singapore"], parentDefault: true },
  "LK-RAM": { id: "sri-lanka-ramayana-trail", parentDestination: "Sri Lanka", aliases: ["Ramayana Trail", "Chilaw", "Ella"], journeyDirectorCandidateIds: ["sri-lanka"], journeyDirectorRegionIds: ["sri-lanka-kandy", "sri-lanka-colombo"] },
  "LK-KNB": { id: "sri-lanka-southern-circuit", parentDestination: "Sri Lanka", aliases: ["Sri Lanka south", "Bentota", "Galle", "Southern Circuit"], journeyDirectorCandidateIds: ["sri-lanka"], journeyDirectorRegionIds: ["sri-lanka-kandy", "sri-lanka-bentota", "sri-lanka-galle", "sri-lanka-colombo"], parentDefault: true },
  "LK-SJT": { id: "sri-lanka-north-east-circuit", parentDestination: "Sri Lanka", aliases: ["Sri Lanka north east", "Trincomalee", "Jaffna", "Sigiriya"], journeyDirectorCandidateIds: ["sri-lanka"], journeyDirectorRegionIds: ["sri-lanka-sigiriya", "sri-lanka-jaffna"] },
  "TH-BKP": { id: "thailand-bangkok-pattaya", parentDestination: "Thailand", aliases: ["Bangkok", "Pattaya", "Bangkok and Pattaya"], journeyDirectorCandidateIds: ["thailand"], journeyDirectorRegionIds: ["thailand-bangkok", "thailand-pattaya"], parentDefault: true },
  "TH-PHK": { id: "thailand-phuket-krabi", parentDestination: "Thailand", aliases: ["Phuket", "Krabi", "Phuket and Krabi"], journeyDirectorCandidateIds: ["thailand"], journeyDirectorRegionIds: ["thailand-phuket", "thailand-krabi"] },
  "VN-HAN": { id: "vietnam-hanoi", parentDestination: "Vietnam", aliases: ["Hanoi", "Halong Bay", "Ha Long Bay"], journeyDirectorCandidateIds: ["vietnam"], journeyDirectorRegionIds: ["vietnam-hanoi"], parentDefault: true },
  "VN-PQC": { id: "vietnam-phu-quoc", parentDestination: "Vietnam", aliases: ["Phu Quoc", "Phu Quoc Island"], journeyDirectorCandidateIds: ["vietnam"], journeyDirectorRegionIds: ["vietnam-phu-quoc"] },
  "VN-DAD": { id: "vietnam-da-nang", parentDestination: "Vietnam", aliases: ["Da Nang", "Danang", "Hoi An"], journeyDirectorCandidateIds: ["vietnam"], journeyDirectorRegionIds: ["vietnam-da-nang"] },
  "VN-SGN": { id: "vietnam-ho-chi-minh-city", parentDestination: "Vietnam", aliases: ["Ho Chi Minh City", "Saigon", "Mekong Delta"], journeyDirectorCandidateIds: ["vietnam"], journeyDirectorRegionIds: ["vietnam-ho-chi-minh-city"] },
};

export const KNOWN_JOURNEY_DIRECTOR_CANDIDATE_IDS = [
  "agra", "andaman", "vizag", "goa", "gujarat", "himachal-pradesh",
  "karnataka", "kashmir", "kerala", "northeast", "pondicherry", "rajasthan",
  "tamil-nadu", "hyderabad", "wildlife", "bali", "malaysia", "singapore",
  "sri-lanka", "thailand", "dubai", "vietnam",
] as const;
