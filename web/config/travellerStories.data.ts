/**
 * Release 1 — "Stories from Our Travellers"
 *
 * Canonical data for the Phase 3 TravellerStories implementation.
 * This file contains content and types only; it does not contain React or
 * rendering logic.
 *
 * Source: Client Testimonials.xlsx.
 * Google Reviews were used only for duplicate/reference checks; no Google
 * Review text is included here.
 *
 * Images are intentionally optional. No asset path should be added until the
 * corresponding file exists in the repository. The component must render a
 * complete, accessible card when `image` and `alt` are absent.
 */

export type ExperienceType =
  | "Family Holiday"
  | "Honeymoon"
  | "Solo"
  | "Weekend Getaway"
  | "Spiritual / Heritage"
  | "Heritage & Luxury"
  | "Adventure Vacation"
  | "Girls' Getaway";

export interface TravellerStory {
  /** Stable React key and future CMS slug. */
  id: string;
  /** Recommended homepage order, starting at 1. */
  displayOrder: number;
  name: string;
  destination: string;
  experience: ExperienceType;
  travelMonth: string;
  travelYear: number;
  quote: string;
  /** Optional detail for multi-stop journeys; not required on the card. */
  route?: readonly string[];
  /** Whether corresponding source assets are known to be available. */
  travellerPhotoAvailable: boolean;
  destinationPhotoAvailable: boolean;
  /** Repository-relative public asset path, added only when verified. */
  image?: string;
  /** Required whenever `image` is supplied. */
  alt?: string;
}

export const travellerStories: readonly TravellerStory[] = [
  {
    id: "family-munnar",
    displayOrder: 1,
    name: "Vinothkumar Vishwanathan",
    destination: "Munnar, Kerala",
    experience: "Family Holiday",
    travelMonth: "May",
    travelYear: 2024,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: false,
    quote:
      "Munnar had been our dream destination for years, and we finally made it there for a three-day trip in May. Our resort sat surrounded by lush greenery, with light rain and mist following us most days, giving the hills a calm, quiet feel. Our driver knew the area well and took us to Mattupetty Dam, the Kannan Devan Tea Museum, Eravikulam National Park, Kundala Dam, Echo Point, and the Rose Garden, staying patient and kind throughout. It was an unhurried trip — no rushing between stops, just time to take in the scenery. A memorable, well-planned family holiday, exactly as we'd imagined it.",
  },
  {
    id: "honeymoon-shimla-manali",
    displayOrder: 2,
    name: "Ramakrishnan Appadorai",
    destination: "Shimla–Manali, Himachal Pradesh",
    experience: "Honeymoon",
    travelMonth: "April",
    travelYear: 2024,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: false,
    quote:
      "Shimla-Manali was such a special trip for the two of us. Over seven days, we barely had to think about logistics — the stays, meals, restaurants, and car were all sorted, so we could just relax and enjoy each other's company. The camp stay in Kasol and the stay near the apple orchard stood out as the best of the trip, each with its own quiet charm. Our driver, Channi bhai, was patient and friendly, and made sure we saw everything we'd hoped to. It was a genuinely hassle-free honeymoon, and one we'll remember for a long time.",
  },
  {
    id: "solo-kodaikanal",
    displayOrder: 3,
    name: "Nathan",
    destination: "Kodaikanal, Tamil Nadu",
    experience: "Solo",
    travelMonth: "September",
    travelYear: 2023,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "I set off on a solo motorbike ride from Chennai to Kodaikanal, and it turned into one of the best trips of my life. The road wound through quiet villages and mist-covered hills, each turn opening onto a new view. The climb into Kodaikanal was tough but rewarding — valleys unfolding below, the air turning cool and green. I stayed in a small hotel overlooking the hills and spent my days exploring Kodaikanal Lake, walking Coaker's Walk, and wandering the local markets. It was equal parts adventure, rest, and discovery — a trip I'll keep returning to in my memory.",
  },
  {
    id: "weekend-kabini",
    displayOrder: 4,
    name: "Kannama Rubesh",
    destination: "Kabini, Karnataka",
    experience: "Weekend Getaway",
    travelMonth: "August",
    travelYear: 2023,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "Kabini had been on my list for a long time, but planning always felt daunting — safari details and accommodation options were hard to pin down on my own. A college friend's mention of Search My Vacation nudged me to reach out, even though I was unsure about costs, timings, and dates. They gave us a few stay options and talked us through each one patiently. We ended up close to the JLR Resorts, right by the river, which made the whole stay feel special despite the long-weekend crowds. It turned out to be a genuinely relaxing escape — simple, well-organized, and worth the trip.",
  },
  {
    id: "spiritual-guruvayur",
    displayOrder: 5,
    name: "Ahilandeshwari V",
    destination: "Guruvayur, Kerala",
    experience: "Spiritual / Heritage",
    travelMonth: "March",
    travelYear: 2024,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "Our trip to Guruvayur turned out to be a beautiful mix of spiritual reflection and cultural discovery. The highlight was the Guruvayur Temple itself — we were able to join the early morning rituals, and the whole experience felt deeply peaceful. Our stay was close to the temple, which made the days easy and unhurried, and we got to try authentic Kerala meals that added another layer to the trip. A visit to Punnathur Kotta, the elephant sanctuary, was unexpected and moving — seeing the elephants up close and learning about the conservation work there stayed with us. A quiet, meaningful journey.",
  },
  {
    id: "heritage-rajasthan",
    displayOrder: 6,
    name: "Karthik R",
    destination: "Rajasthan",
    experience: "Heritage & Luxury",
    travelMonth: "January",
    travelYear: 2024,
    route: ["Jaipur", "Udaipur", "Mount Abu", "Jaisalmer", "Jodhpur"],
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "We set out to see five of Rajasthan's most iconic cities — Jaipur, Udaipur, Mount Abu, Jaisalmer, and Jodhpur — and each one left its own impression. Jaipur's City Palace, Hawa Mahal, and Amber Fort were striking, and the bazaars were full of color and craft. Udaipur's boat ride on Lake Pichola, with the City Palace as a backdrop, was a quiet highlight. Mount Abu brought cooler air and the marble craftsmanship of the Dilwara Temples. In Jaisalmer, a camel safari and a night under the stars in the Thar Desert stood out, followed by the imposing Mehrangarh Fort in Jodhpur. A trip layered with history at every turn.",
  },
  {
    id: "family-adventure-amritsar-dalhousie-dharamshala",
    displayOrder: 7,
    name: "Hari Haran Ravichandran",
    destination: "Amritsar, Dalhousie & Dharamshala",
    experience: "Adventure Vacation",
    travelMonth: "June",
    travelYear: 2026,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "As someone who loves the mountains, this trip to Amritsar, Dalhousie, and Dharamshala was extra special for me—it was our very first solo vacation as a family with my wife and kid! It turned out to be our most memorable trip ever. Every single moment, from the breathtaking mountain views, treks, and waterfalls to the unexpected snowfall, is etched in our memories forever. My kid had an absolute blast!\n\nA huge thank you to the Search My Vacation team for planning such a seamless itinerary. The stays they arranged were top-notch, comfortable, and made us feel right at home. Transport was completely hassle-free.\n\nWhat impressed us most was their constant follow-up and support. Being in a new region with a language barrier could have been tricky, but their continuous check-ins and support made the entire trip smooth, stress-free, and deeply enjoyable.\n\nThank you, Search My Vacation team, for creating memories we will cherish for a lifetime. Highly recommended!",
  },
  {
    id: "family-holiday-manali-satvender",
    displayOrder: 8,
    name: "Satvender Sikarwar",
    destination: "Manali, Himachal Pradesh",
    experience: "Family Holiday",
    travelMonth: "December",
    travelYear: 2023,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "Manali is a place that captivates the senses and makes a lasting impression on the heart. I shall always cherish the memories we made in this Himalayan sanctuary's unspoiled splendour.\n\nI heartily urge anyone looking for the ideal fusion of adventure, culture, and tranquility in one of India's most alluring locations to visit Manali.\n\nDinesh from Search My Vacation organized my vacation to Manali this year, and everything went smoothly. I would suggest Search My Vacation to anyone planning a vacation to Manali because we are all pleased with the reservation, lodging, and food we received throughout our trip. We appreciate you providing us advice and pointers throughout the trip.",
  },
  {
    id: "karnataka-multigenerational-vignesh",
    displayOrder: 9,
    name: "Vignesh Vishwanathan",
    destination: "Karnataka",
    experience: "Family Holiday",
    travelMonth: "November",
    travelYear: 2023,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "Last week, we were organized for a Karnataka trip covering beautiful hill stations and temples through Searchmyvacation team. The trip was planned immaculately for us as I traveled with my aged parents and an infant of 1.5 years old along with my wife. Right from pickup to drop off at Railway station the trip was so pleasurable that everyone from my family enjoyed without any trouble. Trip was for 6 days and covered Chikamagalur, Coorg as hill stations and Hassan, Belur, Dharmasthala, Kukke temples. We were booked with best accommodation at Chikmagalur, Kukke and Coorg as per our requirement and economically worth stays.\n\nLast but not the least, is the transportation (Maruti Ertiga) arranged for us to have a trouble free one with the most supporting and caring driver Mr. Subramanian as he made our trip more easy with his best driving skills and nice knowledge about the local areas.\n\nI take this opportunity to heartily thank Mr. Anand and his team for organizing such a beautiful and memorable trip. It will be my pleasure to make another extraordinary trip with Searchmyvacation team next year.",
  },
  {
    id: "kullu-manali-sathish",
    displayOrder: 10,
    name: "Sathish",
    destination: "Kullu–Manali, Himachal Pradesh",
    experience: "Family Holiday",
    travelMonth: "September",
    travelYear: 2023,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "I cannot express how grateful I am to Search My Vacation for making our family trip to Kullu-Manali an unforgettable experience. From the moment we stumbled upon their website, we knew we were in good hands, and they exceeded our expectations at every turn.\n\nThe entire trip planning process was a breeze, thanks to their user-friendly interface and a wide range of options to choose from. My friend recommended Search My Vacation, and I'm so glad we took their advice. The website made it easy for us to customize our trip to suit our preferences and budget.\n\nBut what truly sets Search My Vacation apart is their attention to detail. Every aspect of our journey, from accommodation to transportation, was meticulously arranged, leaving us with nothing to worry about except soaking in the beauty of Kullu-Manali. The accommodations they suggested were fantastic, offering stunning views and comfortable stays that perfectly matched our family's needs.\n\nThe itinerary they provided was well thought out, allowing us to explore the best of the region without feeling rushed. We enjoyed thrilling adventures like paragliding and river rafting, and also had the opportunity to savor the local cuisine and culture.\n\nThroughout our trip, Search My Vacation's customer support team was just a phone call away, always ready to assist and answer our questions. Their professionalism and dedication to customer satisfaction were truly commendable.\n\nThanks to Search My Vacation, we created beautiful memories that will last a lifetime. I wholeheartedly recommend their services to anyone looking to plan a hassle-free and unforgettable vacation. Thank you, Search My Vacation, for making our family trip to Kullu-Manali a dream come true!",
  },
  {
    id: "gujarat-krishnan",
    displayOrder: 11,
    name: "Krishnan R V",
    destination: "Gujarat",
    experience: "Spiritual / Heritage",
    travelMonth: "March",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "In March of 2024, we had a marriage to attend in Gujarat. Since we were traveling to Gujarat for the first time, we approached SearchMyVacation team to help us plan the trip covering Ahmedabad and Dwaraka and we couldn't be more thrilled with the experience.\n\nFrom the moment we started planning, the team at SearchMyVacation displayed exceptional professionalism and attention to detail. They took the time to understand our preferences and crafted an itinerary that perfectly balanced sightseeing, cultural immersion, and relaxation.\n\nOur journey began in Ahmedabad, where we were warmly greeted by our knowledgeable guide. The city's vibrant history and culture came alive through our visits to the Sabarmati Ashram, the intricately carved Adalaj Stepwell, and the stunning architectural marvels of the old city. The local cuisine was a highlight, and we thoroughly enjoyed the guided food tour that introduced us to authentic Gujarati flavors.\n\nNext, we traveled to the sacred city of Dwaraka. The arrangements made for our stay were impeccable, offering us comfort and convenience. Visiting the Dwarkadhish Temple was a spiritual experience like no other, and the serene atmosphere of the Gomti Ghat provided a perfect backdrop for reflection and peace. The agency also organized a memorable excursion to Bet Dwarka and Nageshwar Jyotirlinga, adding to the richness of our journey.\n\nThroughout the trip, the seamless coordination by SearchMyVacation ensured that we could focus solely on enjoying our travels. Their choice of accommodations was excellent, and their local connections allowed us to experience the best each location had to offer without any hassle.\n\nI wholeheartedly recommend SearchMyVacation for anyone looking to explore the wonders of Ahmedabad and Dwaraka. Their dedication to providing a top-notch travel experience is evident in every aspect of their service. Thank you for making our trip truly unforgettable!",
  },
  {
    id: "shimla-manali-bharat",
    displayOrder: 12,
    name: "Bharat Varathan",
    destination: "Shimla–Manali, Himachal Pradesh",
    experience: "Family Holiday",
    travelMonth: "May",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "I took my family for a vacation to Shimla, Kulu and Manali during this summer. It was one of the most memorable vacation for us till date.\n\nIt all started on a conversation with my friend, who referred me to Mr. Dinesh (owner of SearchMyVacation). My requirement was to take my family to cool place for summer in the northern part of India. I had constraints of date and start of place (Delhi) as I already booked my tickets before reaching out to Dinesh. He was so kind and flexible to arrange my trip working around these constraints. He made sure the place of stay was more kids friendly in both locations - Shimla and Manali. He also ensured to make sure we have one cab throughout our trip - from & to Delhi Airport. Over and above - he worked along with our driver to make sure the adventure rides were planned in such a way that my son (6 yrs old) is included that too with much bargained rate. Overall we had one of the best days of our vacations, so far, at Shimla and Manali. Especially the way kids were taken care w.r.t food and activities were amazing.\n\nSpecial thanks for arranging most humble and cordial driver, who made us feel home throughout the trip.\n\nOverall our trip - planned and arranged by Mr. Dinesh was enjoyable and zero hiccups. Thanks to Dinesh and his SearchMyVacation team for arranging such a wonderful trip for us.\n\nDefinitely recommend SearchMyVacation if you are looking for a family trip to any parts of India. Guaranteed on neat & pleasant stay in addition to 5 star experience.",
  },
  {
    id: "sri-lanka-madhangi",
    displayOrder: 13,
    name: "Madhangi",
    destination: "Sri Lanka",
    experience: "Family Holiday",
    travelMonth: "December",
    travelYear: 2025,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "When I decided to take my parents abroad for the first time, I was honestly more nervous than excited. My parents are in their 70s, they are strictly pure vegetarian, and they had this whole list of temples they wanted to visit in Sri Lanka - Kelaniya, the Tooth Relic Temple, and a few more that were close to their heart. On top of that, my 13 year old daughter needed things to keep her busy too, because let's be real, a 13 year old can only see so many temples before she gets bored!\n\nI reached out to SearchMyVacation not knowing what to expect, and honestly, they made what felt like an impossible juggling act look effortless.\n\nFrom the first call itself, they asked the right questions - about my parents' food preferences, their walking capacity, what temples mattered most to them, and what would keep my daughter engaged. They didn't just nod and make a generic itinerary. They actually built the trip around us - our family, our quirks, our worries.\n\nThe hotels they picked were just beautiful. My parents kept talking about the view from their room the entire trip! And every single meal was properly vegetarian, no confusion, no awkward moments at restaurants trying to explain what we can and cannot eat. That alone took away so much stress for me.\n\nWhat really got me was how they stayed with us throughout. Before the trip, someone was always available to answer my hundred questions (and I mean a hundred, I was that nervous mother planning for her parents). And during the trip, they checked in regularly, just to make sure everything was going smoothly. It felt less like a service and more like having a friend who happened to know Sri Lanka really well.\n\nMy father, who doesn't express much, told me on the flight back that this was one of the best trips of his life. My mother has already shown the photos to everyone in our building. As their daughter, hearing that made everything worth it.\n\nThank you SearchMyVacation, for giving my parents their first international trip, and for making sure it was exactly the way they deserved it - comfortable, spiritual, and full of joy. We will definitely be coming back to you for our next trip!",
  },
  {
    id: "kl-langkawi-ishwarya",
    displayOrder: 14,
    name: "Ishwarya Raja",
    destination: "Kuala Lumpur & Langkawi, Malaysia",
    experience: "Girls' Getaway",
    travelMonth: "January",
    travelYear: 2026,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "My best friend and I had been talking about a girls-only trip for years, but somehow it kept getting postponed. We didn't even have a destination in mind honestly, we just knew we wanted to go somewhere international, just the two of us, without the whole family tagging along for once!\n\nWhen we reached out to SearchMyVacation, we were still exploring options, going back and forth between a few places. But once we spoke to them and shared what kind of trip we were looking for, they suggested Kuala Lumpur and Langkawi, and it just made sense. Good mix of city life and beach relaxation, easy to explore, and perfect for a girls trip. I'm so glad we trusted their suggestion because it turned out to be the ideal choice for both of us.\n\nOnce the destination was locked, they sent us the itinerary so quickly, I was honestly surprised. And when we wanted a few changes here and there to match what we actually wanted to do, they didn't make it complicated at all. They just adjusted things until we were both happy with the plan.\n\nSince it was just the two of us travelling, I made it very clear that safety was my top priority, and they took that seriously. We stayed in nice 4 star hotels, and had a dedicated vehicle with a driver for all our sightseeing, so we never had to worry about navigating unfamiliar roads or depending on random cabs in a new country.\n\nThey also took care of our flight bookings and even selected our seats for us. Honestly, things like web check-in are so easy to forget in the middle of packing and last minute errands, but their team handled that too. I didn't have to run around doing any of this myself, and there was no last minute chaos before we left, which usually happens with every trip I plan.\n\nThe one thing I will never forget - I fell sick during the trip in KL. I panicked a little because we were in a foreign country and didn't know who to turn to. But their team immediately coordinated with their people on ground there, and I got medical attention quickly. That moment really showed me the difference between a company that just books your trip and one that actually cares about you during it.\n\nThroughout the trip, they kept checking in with us, just to make sure everything was going fine. It gave me such a sense of comfort knowing that someone had our back the entire time.\n\nThis was my first ever girls trip abroad, to a destination I hadn't even considered until SearchMyVacation suggested it, and it turned out to be perfect. Because of them, I could just relax and enjoy every bit of it with my friend, without worrying about logistics, safety, or what if something goes wrong. It was stress-free from start to end, and that is a rare feeling when you're travelling in a new country.\n\nThank you SearchMyVacation, for helping us choose the right destination and for taking such good care of us throughout. Already planning our next girls trip with you, and this time, I'll happily let you pick the place again!",
  },
  {
    id: "andaman-sathya-karthik",
    displayOrder: 15,
    name: "Sathya Karthik",
    destination: "Andaman Islands",
    experience: "Family Holiday",
    travelMonth: "December",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "Honestly, this trip almost didn't happen. We decided on Andamans for end of December at the last minute, and I mean really last minute. My wife and I had been so caught up with work and the kids' school schedules that a proper vacation kept taking a backseat. When we finally said \"let's just go\", we reached out to SearchMyVacation not really knowing if they could pull it together on such short notice. They absolutely came to our rescue.\n\nEven the flights were a bit of a headache initially, prices were shooting up given how last minute we were, but their team worked out the best possible routes for us, not just looking at cost, but also keeping travel time and layovers in mind so that we weren't dragging two tired kids through long connections. That one thing alone saved us so much stress before the trip even began.\n\nOur stay was split across Port Blair, Havelock and Neil, and every single property was chosen keeping our family and our budget in mind. My teenage daughter loved the resort in Havelock, and my son, who is 10 and full of energy, had enough space and activities to keep him happy throughout. The locations they picked were genuinely fantastic, we didn't waste a single day.\n\nThe sightseeing itinerary was planned so meticulously, ferries between islands, local transport, everything just flowed smoothly without us having to think twice. And since we are a vegetarian family, food is usually where I worry the most while travelling, but they had that sorted too. We never struggled to find a good meal, not even once.\n\nWhat really stood out was having one single point of contact throughout the trip. She was always a step ahead, checking with the local team on ground and with us, making sure everything was moving as planned. It felt like someone was constantly looking out for us, so we didn't have to.\n\nBut honestly, the biggest win for me was just how it felt as a family. This was the first time in a long while that I actually switched off, sat by the beach, watched my kids play, and didn't worry about a single logistic. It felt like the vacation we had been needing for a long time, a proper, well deserved break, and SearchMyVacation made sure it stayed that way from start to end.\n\nWhat sets them apart is that they don't just hand you a package, they clearly do their homework and turn it into an experience you actually remember. The customization and the customer service, both are genuinely top notch.\n\nI have no hesitation recommending SearchMyVacation to anyone planning their next trip. We are already looking forward to creating more memories with you guys!",
  },
] as const;
