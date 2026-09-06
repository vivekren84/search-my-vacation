/**
 * Release 1 — "Stories from Our Travellers"
 *
 * Canonical data for the Phase 3 TravellerStories implementation.
 * This file contains content and types only; it does not contain React or
 * rendering logic.
 *
 * Source: the first 15 entries (displayOrder 1-15) were sourced from the
 * legacy "Client Testimonials.xlsx". All entries added from displayOrder 16
 * onward were migrated verbatim from the frozen, Product-approved
 * `docs/06-Product-Reviews/PRW-R1.3-001-Traveller-Stories.xlsx`
 * (Traveller Testimonial Migration, R1.3-WS2-IMP-03) — see
 * `getTestimonial.ts` for the full migration note and verification record.
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
  /**
   * Optional as of the Traveller Testimonial Migration (R1.3-WS2-IMP-03):
   * entries migrated from the frozen Product Review Workbook whose raw
   * `metadata.json` experience label had no confident, Architecture-approved
   * fit in this union (per EBC-R1.3-WS2-06) are omitted rather than forced
   * into a guessed category. Absent means "no category", not "unset".
   */
  experience?: ExperienceType;
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
    id: "andaman-sathya-krithivasan",
    displayOrder: 15,
    name: "Sathya Krithivasan",
    destination: "Andaman Islands",
    experience: "Family Holiday",
    travelMonth: "December",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "Honestly, this trip almost didn't happen. We decided on Andamans for end of December at the last minute, and I mean really last minute. My wife and I had been so caught up with work and the kids' school schedules that a proper vacation kept taking a backseat. When we finally said \"let's just go\", we reached out to SearchMyVacation not really knowing if they could pull it together on such short notice. They absolutely came to our rescue.\n\nEven the flights were a bit of a headache initially, prices were shooting up given how last minute we were, but their team worked out the best possible routes for us, not just looking at cost, but also keeping travel time and layovers in mind so that we weren't dragging two tired kids through long connections. That one thing alone saved us so much stress before the trip even began.\n\nOur stay was split across Port Blair, Havelock and Neil, and every single property was chosen keeping our family and our budget in mind. My teenage daughter loved the resort in Havelock, and my son, who is 10 and full of energy, had enough space and activities to keep him happy throughout. The locations they picked were genuinely fantastic, we didn't waste a single day.\n\nThe sightseeing itinerary was planned so meticulously, ferries between islands, local transport, everything just flowed smoothly without us having to think twice. And since we are a vegetarian family, food is usually where I worry the most while travelling, but they had that sorted too. We never struggled to find a good meal, not even once.\n\nWhat really stood out was having one single point of contact throughout the trip. She was always a step ahead, checking with the local team on ground and with us, making sure everything was moving as planned. It felt like someone was constantly looking out for us, so we didn't have to.\n\nBut honestly, the biggest win for me was just how it felt as a family. This was the first time in a long while that I actually switched off, sat by the beach, watched my kids play, and didn't worry about a single logistic. It felt like the vacation we had been needing for a long time, a proper, well deserved break, and SearchMyVacation made sure it stayed that way from start to end.\n\nWhat sets them apart is that they don't just hand you a package, they clearly do their homework and turn it into an experience you actually remember. The customization and the customer service, both are genuinely top notch.\n\nI have no hesitation recommending SearchMyVacation to anyone planning their next trip. We are already looking forward to creating more memories with you guys!",
  },
  {
    id: "cb-siva",
    displayOrder: 16,
    name: "CB Siva",
    destination: "Kodaikanal, Poombarai & Palani, Tamil Nadu",
    experience: "Family Holiday",
    travelMonth: "April",
    travelYear: 2026,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "“A beautifully planned trip from start to finish!”\n\nOur family trip to Kodaikanal, Poombarai and Palani was an absolutely wonderful experience with Search My Vacation. What stood out most was how thoughtfully the entire journey was planned — from the selection of places and experiences to the clear communication about every inclusion and the smooth payment process.\n\nThe itinerary felt well-curated rather than rushed, allowing us to genuinely enjoy the sights, sounds and charm of each destination. The driver was punctual, professional and, importantly, followed the planned schedule perfectly while still being friendly and accommodating throughout the journey.\n\nWhat really made the experience special was the seamless coordination and transparency at every stage. There were no surprises, no confusion and no last-minute hassles — just a well-organised holiday that our family could simply enjoy.\n\nA truly 5-star experience and one we would happily recommend to anyone looking for a personalised, dependable and hassle-free holiday. We are already looking forward to planning our next trip with Search My Vacation!\n\n— Happy Family of 3 | Kodaikanal • Poombarai • Palani",
  },
  {
    id: "karthik-ramanathan",
    displayOrder: 17,
    name: "Karthik Ramanathan",
    destination: "Sri Lanka",
    experience: "Family Holiday",
    travelMonth: "December",
    travelYear: 2025,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: false,
    quote:
      "“Our second trip with Search My Vacation — and they delivered once again!”\n\nAfter having travelled with Search My Vacation before, we were happy to trust them again with our family holiday to Sri Lanka. This time, they planned an extensive 8-night/9-day journey across the central, eastern and southern parts of the country, and the experience was every bit as enjoyable as we had hoped.\n\nFrom the moment we arrived in Colombo until our departure, everything was thoughtfully coordinated. Having a dedicated driver-cum-guide throughout the trip made travelling with our family and children incredibly comfortable. He was professional, knowledgeable, friendly and, most importantly, very accommodating to our family's needs.\n\nThe accommodations were excellent, and the sightseeing was planned at a pace that allowed us to genuinely experience each destination rather than simply rushing from one attraction to another. Every detail seemed to have been considered in advance, which gave us the freedom to simply enjoy our holiday together.\n\nWhat makes us recommend Search My Vacation even more strongly is the trust we've built with them over multiple trips. When you find a travel partner who understands your preferences and takes care of the details, you don't have to think twice about planning the next holiday.\n\nAnother beautifully organised family vacation, another set of wonderful memories — and we're already looking forward to seeing where Search My Vacation takes us next!",
  },
  {
    id: "balaji-hariharan",
    displayOrder: 18,
    name: "Balaji Hariharan",
    destination: "Andaman Islands",
    experience: "Solo",
    travelMonth: "December",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "“The kind of travel partner you can count on, even when plans change!”\n\nI chose Search My Vacation for my first solo trip to Andaman, and what I remember most is how easy they made the entire journey feel.\n\nRight from the beginning, they were approachable and incredibly supportive. Even the small details were taken care of — my two-wheeler was arranged and delivered directly at the airport, exactly as I had requested.\n\nBut what really impressed me was how they handled an unexpected change in my plans. Just two days before my trip, I decided to extend my holiday from 4 days/3 nights to 5 days/4 nights. Instead of making it complicated, the team immediately worked on the changes, including rescheduling my flight and adding another place to the itinerary, so that everything was ready for me to enjoy the extended trip.\n\nThroughout the journey, I always felt that someone was just a phone call away. Whenever I had a request, they either found a way to make it happen or honestly explained why something wasn't possible and still tried their best to help.\n\nFor a solo traveller, that kind of support makes a huge difference. I didn't just feel like I had booked a holiday — I felt like I had a travel partner looking out for me.\n\nI’m already looking forward to my next trip with Search My Vacation. In fact, I think they may just become my “family travel partner” — much like having a family doctor you can always count on! 😄",
  },
  {
    id: "palwinder-singh",
    displayOrder: 19,
    name: "Palwinder Singh",
    destination: "Goa",
    experience: "Honeymoon",
    travelMonth: "November",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Goa honeymoon trip with Search My Vacation was an absolutely wonderful experience. From the moment the trip was planned, everything was handled so well and the overall management was truly excellent.\n\nWe especially loved the special honeymoon arrangements made for us. Those little touches made the trip feel more personal and memorable, and it was clear that the team had put thought into making our honeymoon special.\n\nWe also had an unexpected issue with our flight due to operational reasons, but what really impressed us was how quickly and calmly the Search My Vacation team stepped in and helped us manage the situation. We never felt like we were left to figure things out on our own.\n\nThe entire trip was comfortable, well organised and hassle-free. Good experience, great management — honestly, 100/100! We couldn't have asked for a better travel partner for our honeymoon.\n\nA big thank you to the entire Search My Vacation team for making our first trip as a married couple so memorable. ❤️",
  },
  {
    id: "padma-priya-govindaraju",
    displayOrder: 20,
    name: "Padma Priya Govindaraju",
    destination: "Andaman Islands",
    experience: "Family Holiday",
    travelMonth: "August",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "I booked an Andaman trip for my parents, who are around 70 years old, with Search My Vacation, and the experience was truly reassuring from beginning to end.\n\nRight from our first conversation, the team was professional, thorough and attentive to the specific needs of senior travellers. The entire 4-day itinerary was meticulously planned, with comfortable arrangements and thoughtful coordination at every stage. My parents felt safe and well looked after throughout the trip, and the drivers and guides assigned to them were dependable and courteous.\n\nWhat meant the most to me was the peace of mind I had even while being thousands of miles away. The Search My Vacation team was always approachable and readily available whenever my parents needed assistance. They stayed connected, tracked their journey and made sure my parents reached home safely.\n\nThe hotel staff were also courteous, and the overall arrangements made the trip comfortable and stress-free for my parents.\n\nFor anyone planning a trip for their parents or senior family members, I would 100% recommend Search My Vacation. Their attention to detail, accessibility and genuine care made me feel that my parents were not simply travelling with a tour operator — they were travelling with someone looking out for them.\n\nThank you to the entire Search My Vacation team for taking such good care of my parents and giving our family complete peace of mind. ❤️",
  },
  {
    id: "aru-k",
    displayOrder: 21,
    name: "Aru K",
    destination: "Andaman Islands",
    experience: "Adventure Vacation",
    travelMonth: "June",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Andaman trip with Search My Vacation was such a wonderful experience. From the very beginning, the team took the time to understand what we wanted to do and planned everything really thoughtfully.\n\nThe scuba diving and sightseeing were both arranged beautifully, and there was a great balance between enjoying the activities and simply taking in the beauty of Andaman. Nothing felt rushed, and the arrangements made it easy for us to just enjoy the trip.\n\nWhat I really liked was the personal touch. It didn’t feel like we were following a standard package that was the same for everyone. The team was always attentive to our needs and made sure everything was comfortable and well coordinated.\n\nIt was a trip filled with some really great memories, and I would definitely recommend Search My Vacation to anyone looking for a personalised travel experience.",
  },
  {
    id: "sunoj-s-m",
    displayOrder: 22,
    name: "Sunoj S M",
    destination: "Munroe Island & Varkala, Kerala",
    experience: "Weekend Getaway",
    travelMonth: "May",
    travelYear: 2025,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "We recently had a wonderful trip to Munroe Island and Varkala, and Search My Vacation made the entire experience smooth and enjoyable.\n\nThe trip was thoughtfully arranged around our requirements, while still being budget-friendly and comfortable. What we particularly appreciated was the personalised communication through our dedicated WhatsApp group. It made reaching out with questions or clarifications extremely easy, and the team was always prompt in responding.\n\nThere was a sense of genuine attention throughout the planning and the trip, rather than feeling like we were simply booking a standard package. Everything was well coordinated, allowing us to relax and enjoy Kerala without having to worry about the arrangements.\n\nOverall, we’re very happy with the experience and would definitely recommend Search My Vacation for anyone looking for a personalised, well-organised and value-for-money holiday.",
  },
  {
    id: "chitra-chandrasekaran",
    displayOrder: 23,
    name: "chitra chandrasekaran",
    destination: "Madurai, Tamil Nadu",
    experience: "Spiritual / Heritage",
    travelMonth: "April",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "We recently travelled to Madurai with Search My Vacation, with our main focus being the beautiful temples and their rich history. The entire experience was very comfortable and well organised.\n\nAs senior citizens, we particularly appreciated how thoughtfully the itinerary was designed. The team paid attention to our comfort and ensured that the journey was not unnecessarily tiring, while still allowing us to experience the places we had hoped to visit.\n\nThe guides added a lot of value to the trip. Their knowledge of the history, culture and significance of the temples helped us appreciate the experience beyond simply visiting each place. Their explanations made the sightseeing much more meaningful.\n\nWhat stood out to us was the care and attention given throughout the trip. Every arrangement felt well considered, and we never felt like just another booking.\n\nWe had a wonderful experience with Search My Vacation and would happily recommend them to anyone looking for a well-planned, comfortable and personalised holiday, especially senior travellers.",
  },
  {
    id: "vaidyanath-balasubramanian",
    displayOrder: 24,
    name: "Vaidyanath Balasubramanian",
    destination: "Rajasthan",
    experience: "Heritage & Luxury",
    travelMonth: "January",
    travelYear: 2024,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: false,
    quote:
      "Our recent Rajasthan trip covering Jodhpur, Udaipur, and Mount Abu was an amazing experience, and Search My Vacation made the entire journey smooth and enjoyable from start to finish. From planning the itinerary and arranging our stays to coordinating the travel, everything was handled with great attention to detail.\n\nJodhpur was a wonderful introduction to Rajasthan’s history and vibrant character. Exploring the magnificent Mehrangarh Fort and wandering through the colourful local markets were definite highlights, especially the incredible panoramic views of the Blue City. Udaipur brought a completely different atmosphere, with its beautiful lakes, grand palaces, and peaceful surroundings. Lake Pichola and the City Palace were particularly memorable and gave us a wonderful glimpse into the city’s regal charm.\n\nOur time in Mount Abu was the perfect contrast to the bustling cities. The cool climate, serene Nakki Lake, and magnificent Dilwara Temples made it a relaxing and refreshing part of the journey.\n\nWhat we appreciated most was how seamlessly everything came together. The accommodations, itinerary, and transportation were well coordinated, allowing us to enjoy each destination without having to worry about the logistics. The trip felt well paced and gave us the freedom to truly experience the unique character of each place.\n\nA big thank you to Search My Vacation for making our Rajasthan holiday comfortable, organised, and memorable. We would definitely recommend them to anyone looking to explore Rajasthan and experience its incredible mix of history, culture, architecture, and natural beauty.",
  },
  {
    id: "lina-mahurkar",
    displayOrder: 25,
    name: "Lina Mahurkar",
    destination: "Manali, Himachal Pradesh",
    experience: "Adventure Vacation",
    travelMonth: "April",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Manali trip with Search My Vacation was an experience we’ll remember for a long time. From the initial planning to the journey itself, everything was handled smoothly and thoughtfully, allowing us to simply enjoy the destination without constantly worrying about the arrangements.\n\nManali was breathtaking — from the snow-covered mountains and lush valleys to the peaceful beauty of the Beas River. The itinerary also had the right mix of relaxation and adventure, with experiences like paragliding and trekking adding an exciting element to the trip. Visiting Solang Valley and Rohtang Pass was definitely among the highlights.\n\nOur stay was comfortable and welcoming, which added to the overall experience. What we appreciated most was how well everything was coordinated, so we could focus on enjoying the views, exploring the destination and making memories.\n\nA big thank you to the Search My Vacation team for making the trip so comfortable and hassle-free. We would definitely recommend them to anyone looking to explore Manali or plan a memorable holiday anywhere else.\n\nBeautiful destination, great experiences and seamless planning — everything came together perfectly!",
  },
  {
    id: "sridevi-mohanty",
    displayOrder: 26,
    name: "Sridevi Mohanty",
    destination: "Munnar, Kerala",
    experience: "Family Holiday",
    travelMonth: "February",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Munnar trip with Search My Vacation was an absolutely seamless and memorable experience. We were looking for a getaway where we could simply relax and enjoy ourselves without having to worry about the arrangements, and that’s exactly what we got.\n\nFrom the booking and stay to food, travel and overall coordination, everything was taken care of so thoughtfully. The support team was always responsive and ready to answer our questions, which made the entire journey feel effortless.\n\nWhat we particularly appreciated was how well they handled the unexpected little changes that naturally come up during a trip. Whether it was making an impromptu pit stop or spending a little extra time at a place we enjoyed, the team was accommodating and made it easy for us to go with the flow.\n\nThe entire experience felt personal rather than rigidly planned. We could enjoy Munnar at our own pace while knowing that the important details were already taken care of.\n\nA special thank you to Vivek and the entire Search My Vacation team for their prompt service and genuine support. We had a wonderful time and will definitely be reaching out to them for our next trip!",
  },
  {
    id: "rajkumar-yadavalli",
    displayOrder: 27,
    name: "Rajkumar Yadavalli",
    destination: "Araku Valley, Andhra Pradesh",
    experience: "Adventure Vacation",
    travelMonth: "February",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our trip to Araku Valley with Search My Vacation was a truly wonderful experience. From the initial planning to the end of the journey, everything was handled with great care and attention to detail.\n\nWhat we appreciated most was how thoughtfully the itinerary was put together. It allowed us to experience the natural beauty, unique charm and local character of Araku Valley without feeling like we were simply ticking places off a list. The recommendations were spot-on, and the local insights along the way added another dimension to the trip.\n\nEvery aspect was well coordinated, giving us the freedom to immerse ourselves in the destination rather than worry about the arrangements. The team's knowledge and attention to the little details made the journey feel effortless.\n\nWe came back with some wonderful memories and a genuine appreciation for Araku Valley. If you're looking for a well-planned, personalised and hassle-free travel experience, we would highly recommend Search My Vacation.\n\nThey truly made our vacation exceptional!",
  },
  {
    id: "swathi-ramesh",
    displayOrder: 28,
    name: "Swathi Ramesh",
    destination: "Manali, Himachal Pradesh",
    experience: "Adventure Vacation",
    travelMonth: "January",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Manali trip with Search My Vacation was an unforgettable experience from beginning to end. What impressed us most was how much thought and care went into planning the trip around what we wanted to experience.\n\nThe team was incredibly responsive throughout the process and helped us put together an itinerary that had a wonderful mix of scenic experiences, adventure and exploration. From comfortable accommodation with beautiful views to convenient transportation and well-planned sightseeing, everything came together seamlessly.\n\nThe adventure experiences were a definite highlight. Ziplining, paragliding and trekking added just the right amount of excitement to our holiday, while the overall arrangements allowed us to enjoy Manali without constantly worrying about logistics.\n\nWe also really appreciated the personal attention from the team. They were always available whenever we had questions and shared useful local tips that helped us experience the destination in a more enjoyable and authentic way.\n\nThroughout the trip, we genuinely felt that someone was looking out for us and making sure everything was going smoothly. That level of care made a big difference to our overall experience.\n\nA huge thank you to the Search My Vacation team for the meticulous planning, constant support and personal touch. We came back with incredible memories and would happily recommend them to anyone looking for a seamless, personalised and memorable holiday.",
  },
  {
    id: "ashika-hema",
    displayOrder: 29,
    name: "Ashika Hema",
    destination: "Meghalaya",
    experience: "Adventure Vacation",
    travelMonth: "December",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our trip to Meghalaya was truly a wonderful experience, and Search My Vacation played a big part in making it so memorable. From the very beginning, the team was attentive, responsive, and genuinely committed to making sure everything was planned and executed perfectly.\n\nThe itinerary was thoughtfully designed to showcase the very best of Meghalaya — from the vibrant charm of Shillong to the peaceful beauty of Cherrapunji, the fascinating landscapes of Mawlynnong, and the incredible living root bridges of Nongriat. Every destination brought something different, making the journey feel diverse and exciting throughout.\n\nSome of the highlights for us were standing before the magnificent Nohkalikai Falls, exploring the Mawsmai Caves, and experiencing the awe-inspiring Double Decker Living Root Bridge. Visiting Mawlynnong was equally special, with its beautiful surroundings and warm local hospitality.\n\nThe comfortable accommodations, dedicated transportation, and knowledgeable local guides added greatly to the experience. We could simply sit back, relax, and enjoy Meghalaya while the arrangements were taken care of. The guides also gave us wonderful insights into the region’s culture, traditions, and natural wonders, making the places we visited even more meaningful.\n\nA big thank you to the entire Search My Vacation team for putting together such a well-planned and memorable Meghalaya experience. We would happily recommend SMV to solo travellers, couples, families, or groups looking to explore this beautiful part of India.",
  },
  {
    id: "abhinaya-murali",
    displayOrder: 30,
    name: "Abhinaya Murali",
    destination: "Sikkim",
    experience: "Adventure Vacation",
    travelMonth: "April",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our journey through Sikkim was nothing short of magical, and Search My Vacation made the entire experience even more special. From the initial planning to the final day of our trip, the team was professional, attentive, and genuinely focused on making sure every part of our holiday was well organised.\n\nThe itinerary was a wonderful balance of adventure, relaxation, and cultural experiences. We explored the vibrant streets and surroundings of Gangtok, experienced the peaceful beauty of Pelling, and travelled through the breathtaking landscapes of Lachung. Each destination had its own character, and the itinerary allowed us to experience the many different sides of Sikkim without the trip feeling rushed.\n\nThe scenic beauty throughout the journey was simply incredible. Visiting the stunning Tsomgo Lake, experiencing the spiritual atmosphere of Rumtek Monastery, and seeing the majestic Kanchenjunga from Pelling were some of the highlights of our trip. But our visit to Yumthang Valley was particularly unforgettable. Surrounded by vibrant blooms, dramatic mountain landscapes, and snow-capped peaks, it was one of those moments that truly stays with you long after the journey is over.\n\nThe accommodations were comfortable and offered beautiful views, while the transportation arrangements made travelling across the mountainous terrain smooth and stress-free. We could simply sit back, enjoy the scenery, and immerse ourselves in the beauty of Sikkim.\n\nThe local guides also added tremendous value to the experience. Their knowledge and enthusiasm helped us understand the region beyond just its sightseeing spots, giving us fascinating insights into Sikkim’s history, culture, traditions, and natural wonders. The warmth and hospitality we experienced along the way made the journey even more memorable.\n\nA heartfelt thank you to the entire Search My Vacation team for putting together such a beautifully planned holiday. Every detail came together seamlessly, allowing us to focus on enjoying the journey and creating wonderful memories. We would happily recommend Search My Vacation to anyone looking to explore Sikkim and look forward to travelling with the team again!",
  },
  {
    id: "prabhu-h",
    displayOrder: 31,
    name: "Prabhu H",
    destination: "Ooty, Tamil Nadu",
    experience: "Family Holiday",
    travelMonth: "June",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our recent trip to Ooty was an incredible experience, and much of what made it special was the thoughtful planning and excellent service provided by Search My Vacation. From our very first interaction, the team was professional, attentive, and genuinely interested in understanding our preferences and making sure the trip was planned around what we wanted.\n\nThe accommodation arranged for us was excellent, with comfortable amenities and beautiful views that made our stay even more enjoyable. The sightseeing itinerary was also very well planned, giving us a wonderful opportunity to experience the natural beauty and charm of Ooty without feeling rushed. From the picturesque landscapes and scenic tea gardens to the local attractions, every part of the itinerary added something special to the trip.\n\nThe cab arrangements were equally impressive. The vehicle was always punctual, and our driver was friendly, knowledgeable, and helpful throughout the journey. Having someone who knew the routes and local surroundings made travelling between different places much easier and allowed us to simply sit back, relax, and enjoy the beautiful hill station.\n\nWhat we appreciated most was the attention to detail throughout the entire trip. Everything, from the stay and transportation to sightseeing and coordination, was handled smoothly. The personalised approach from the Search My Vacation team made us feel well taken care of rather than simply being part of a standard package.\n\nOverall, we are extremely satisfied with the experience and the level of service provided by Search My Vacation. They made our Ooty holiday comfortable, enjoyable, and truly memorable. We would definitely recommend them to anyone planning a trip and looking for a team that takes care of the details while allowing you to focus on enjoying your vacation.\n\nWe look forward to travelling with Search My Vacation again on our future holidays!",
  },
  {
    id: "charuvasine",
    displayOrder: 32,
    name: "Charuvasine",
    destination: "Shimla, Manali, Kullu & Kasol, Himachal Pradesh",
    experience: "Family Holiday",
    travelMonth: "June",
    travelYear: 2024,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "Our holiday to Shimla, Kullu, and Manali was a wonderful experience, and we’re truly grateful to the Search My Vacation team for organising it so well. From the hotels and bookings to the transportation, everything was arranged thoughtfully and was just what we were looking for.\n\nA special mention goes to our driver, who was extremely polite, helpful, and more than just a driver during our journey. His knowledge of the places we visited and his willingness to guide us along the way made exploring the region even more enjoyable. We always felt comfortable and safe while travelling, which made a big difference throughout the trip.\n\nThe communication and support from the Search My Vacation team was also excellent. We were guided throughout the journey and could reach out whenever we needed assistance. That constant support gave us the confidence to simply relax and enjoy our holiday without worrying about the arrangements.\n\nOverall, it was a very comfortable, well-organised, and memorable trip. Thank you to the entire Search My Vacation team for all the effort and support that went into making our holiday special. We would definitely recommend SMV to others and look forward to travelling with the team again in the future!",
  },
  {
    id: "harishankar-kuppusamy",
    displayOrder: 33,
    name: "Harishankar",
    destination: "Visakhapatnam, Andhra Pradesh",
    experience: "Weekend Getaway",
    travelMonth: "October",
    travelYear: 2023,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "It was a wonderful trip to Vizag and Araku Valley with our group of 12, travelling together as 3–4 families. Coordinating a larger group can often be challenging, but everything was planned and organised smoothly, allowing us to simply relax and enjoy our time together.\n\nThe arrangements were comfortable, the travel was well coordinated, and the overall experience was enjoyable for everyone in the group. From exploring Vizag to experiencing the scenic beauty of Araku Valley, it was a memorable getaway filled with beautiful moments, conversations and family memories.\n\nWe truly appreciate the effort put into making the entire trip comfortable and hassle-free. A great experience with Search My Vacation, and we would definitely recommend them for family and group holidays.",
  },
  {
    id: "praveen-kumar",
    displayOrder: 34,
    name: "Praveen Kumar",
    destination: "Sri Lanka",
    experience: "Family Holiday",
    travelMonth: "December",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Sri Lanka trip was overall a wonderful and joyous experience, and Search My Vacation did a great job in making the journey comfortable and well organised. One of the nicest surprises was the warm welcome we received right at the airport with beautiful garlands. It was such a thoughtful gesture and gave us a lovely start to the holiday.\n\nThe transportation arrangements were one of the strongest aspects of the trip. Our driver was extremely humble, courteous, and helpful throughout the journey, which made travelling between destinations much more comfortable. Having someone reliable and pleasant throughout the trip allowed us to sit back, relax, and enjoy the beautiful surroundings of Sri Lanka.\n\nThe accommodations were also well arranged, with some lovely properties that added to the overall experience. We especially appreciated the comfort and ambience of the stays, which gave us a good place to unwind after a day of exploring.\n\nOur time in Bentota was particularly beautiful, and the property itself had a wonderful setting. Looking back, we feel that for a beach destination, staying closer to the main beach area would have suited our preference even better. It’s a small preference we would keep in mind when planning our next coastal holiday.\n\nOverall, we had a great time and truly appreciated the effort put in by the Search My Vacation team to coordinate the trip. The warm welcome, comfortable arrangements, excellent transportation, and personal attention made the journey a memorable one.\n\nThank you to the entire SMV team for organising our Sri Lanka holiday. We look forward to travelling with Search My Vacation again for another wonderful experience!",
  },
  {
    id: "shankar-subramanian",
    displayOrder: 35,
    name: "Shankar Subramanian",
    destination: "Visakhapatnam, Andhra Pradesh",
    experience: "Family Holiday",
    travelMonth: "October",
    travelYear: 2023,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "We had a wonderful trip around Visakhapatnam and Araku Valley, and the cab service arranged by Search My Vacation made the journey comfortable and convenient.\n\nOur driver was very polite, punctual and helpful throughout the trip. He was also happy to guide us along the way, taking us to the important places and ensuring we could cover the key attractions without missing out on the highlights.\n\nThe overall cab experience was smooth from pickup to the final drop, and having a dependable driver made exploring Vizag and Araku Valley much more enjoyable.\n\nOverall, it was a great trip, and we truly appreciate the excellent cab service arranged by Search My Vacation.",
  },
  {
    id: "lavi-rajan",
    displayOrder: 36,
    name: "Lavi Rajan",
    destination: "Kuala Lumpur & Langkawi, Malaysia",
    travelMonth: "March",
    travelYear: 2026,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "I had a wonderful experience travelling with Search My Vacation. From the initial planning to the coordination of accommodations, itinerary and transportation, everything was handled with care and professionalism.\n\nI particularly appreciated how well the destinations and experiences were aligned with my preferences. The itinerary was thoughtfully put together, the arrangements were comfortable, and the overall coordination made the trip feel easy and stress-free.\n\nWhat I liked most was the personal attention throughout the journey. The team was responsive, supportive and genuinely invested in making sure the trip went well. There were a few areas where having more choices and flexibility would make the experience even better, but overall, the positives far outweighed the minor challenges.\n\nI came back with some great memories and would definitely consider Search My Vacation again for my future travel plans. A reliable team that puts genuine effort into creating a well-organised and enjoyable holiday experience.",
  },
  {
    id: "anirudh-s",
    displayOrder: 37,
    name: "Anirudh S",
    destination: "Kashmir",
    travelMonth: "February",
    travelYear: 2026,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Kashmir holiday was a truly memorable experience. Travelling as a couple with our 3-year-old toddler, we were looking for a trip that would let us enjoy the beauty of Kashmir without making the journey too hectic for our little one.\n\nSearch My Vacation did a wonderful job of putting together an itinerary that balanced beautiful places, comfortable travel and enough time to actually enjoy each experience. From the breathtaking landscapes to the carefully planned sightseeing, every part of the trip added something special to our holiday.\n\nWhat we appreciated most was the attention to detail. The arrangements were smooth, communication was clear, and having the trip organised around our family made a big difference. We could relax, enjoy Kashmir and create wonderful memories together without constantly worrying about the logistics.\n\nTravelling with a young child can sometimes make holidays challenging, but this trip felt comfortable, enjoyable and genuinely stress-free.\n\nA fantastic experience with Search My Vacation — and definitely a journey we will look back on with a smile.",
  },
  {
    id: "sonia-negi",
    displayOrder: 38,
    name: "Sonia Negi",
    destination: "Ranthambore, Rajasthan",
    travelMonth: "December",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "“A memorable trip, perfectly organised at short notice.”\n\nWe had a wonderful experience with Search My Vacation for our Ranthambore trip. Even though the trip was planned at relatively short notice, the team took care of all the arrangements efficiently and made sure everything was well coordinated.\n\nThe itinerary was thoughtfully planned, the arrangements were smooth, and the entire journey was comfortable and hassle-free. We really appreciated the team's effort in making sure everything came together seamlessly, allowing us to simply enjoy the trip without having to worry about the logistics.\n\nA big thank you to the entire team for making our Ranthambore getaway smooth, memorable and stress-free. We would happily recommend Search My Vacation for anyone looking for a dependable travel partner.",
  },
  {
    id: "rami-reddy",
    displayOrder: 39,
    name: "Rami Reddy",
    destination: "Dubai & Abu Dhabi, UAE",
    travelMonth: "September",
    travelYear: 2025,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "Our UAE trip with Search My Vacation was a truly wonderful experience. We were able to explore almost all the major places across Dubai and Abu Dhabi, and the entire journey was planned and coordinated so smoothly that we could simply enjoy our holiday.\n\nThe stay and food were excellent, and both our accommodations at Jacob’s Garden in Dubai and Radisson Blu in Abu Dhabi added to the overall comfort of the trip. The arrangements were well thought out, making it easy for us to experience so much of the UAE without feeling overwhelmed by the planning and logistics.\n\nWe really appreciate the Search My Vacation team for taking care of the details and making our family holiday comfortable, enjoyable and hassle-free.\n\nThank you to the entire team for a memorable UAE experience. We would be happy to travel with Search My Vacation again!",
  },
  {
    id: "dinesh-chandrasekaran",
    displayOrder: 40,
    name: "Dinesh Chandrasekaran",
    destination: "Malaysia & Singapore",
    travelMonth: "July",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "“Our first international trip after marriage, and Search My Vacation made it truly special.”\n\nWe recently travelled to Malaysia and Singapore with Search My Vacation, and it turned out to be a wonderful experience from beginning to end.\n\nAs a young couple taking our first international trip after marriage, we wanted to explore both destinations without the stress of figuring out transportation, hotels and day-to-day arrangements ourselves. Search My Vacation planned everything as a private tour, covering the important places while still giving us the freedom to enjoy the trip at our own pace.\n\nThe entire experience was very well organised. From the stay and transportation to the sightseeing arrangements, everything was taken care of smoothly. Whenever we had a question or needed any clarification, the team was always available and quick to help.\n\nWhat we especially appreciated was the balance between budget and experience. The arrangements were reasonably priced, but we never felt like we were compromising on comfort or the overall quality of our holiday. We got to enjoy both Malaysia and Singapore with the kind of experience we had hoped for.\n\nIt was a memorable way to begin our international travels together, and we’re really happy we chose Search My Vacation to plan it for us.\n\nHighly recommended for anyone looking for a well-planned, hassle-free and personalised international holiday!",
  },
  {
    id: "srividhya-subramanian",
    displayOrder: 41,
    name: "Srividhya Subramanian",
    destination: "Bali, Indonesia",
    travelMonth: "June",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "We recently travelled to Bali for a 5-day, 4-night trip planned by Search My Vacation, and we were genuinely impressed with how smoothly everything came together.\n\nSince our trip was planned at the last minute, we were initially a little unsure about how everything would be arranged. But the team took care of the entire journey — from international flight and accommodation bookings to sightseeing, airport transfers and local arrangements in Bali. They also guided us through the immigration process and shared all the important things we needed to take care of before travelling, which made the preparation much easier.\n\nFrom the moment we landed in Bali until our airport drop at the end of the trip, everything was well coordinated between the Search My Vacation team in India and their local team. Having a car and driver at our disposal gave us great convenience, and receiving the next day's plan the previous night made it easy for us to know exactly what to expect.\n\nWe thoroughly enjoyed all four days in Bali without having to worry about the logistics. The coordination, support and attention to detail made the entire experience comfortable and hassle-free.\n\nWe would highly recommend Search My Vacation to anyone looking for a well-planned and personalised holiday, especially when you want someone reliable to take care of the details from start to finish.\n\nA truly memorable Bali experience!",
  },
  {
    id: "sukumar-k",
    displayOrder: 42,
    name: "Sukumar K",
    destination: "Kodaikanal, Tamil Nadu",
    travelMonth: "February",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Kodaikanal getaway with Search My Vacation was a wonderful experience. It was exactly the kind of refreshing break we were looking for — a chance to step away from our routine, spend quality time together and simply enjoy the beauty of the hills.\n\nFrom the planning to the arrangements, everything was handled smoothly, making the trip comfortable and easy for the entire family. We could focus on enjoying our time together without having to worry about the travel details.\n\nKodaikanal was the perfect setting for a relaxed family escape, and Search My Vacation made the experience even more enjoyable with their thoughtful planning and support.\n\nWe truly enjoyed our time together and came back with some lovely family memories. A wonderful experience and definitely a trip we’ll cherish!",
  },
  {
    id: "sridevi-vadhirajan",
    displayOrder: 43,
    name: "Sridevi Vadhirajan",
    destination: "Manali, Himachal Pradesh",
    travelMonth: "March",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Manali trip with Search My Vacation was truly a memorable experience. From the planning to the arrangements, everything came together smoothly and allowed us to simply relax, explore and enjoy our time together.\n\nManali was absolutely beautiful, and experiencing it with the girls made the trip even more special. There was something wonderful about being able to switch off from our usual routine, enjoy the mountains and create memories together without having to worry about the travel arrangements.\n\nA big thank you to the Search My Vacation team for putting everything together so thoughtfully and making our getaway so comfortable and enjoyable.\n\nIt was truly pure bliss! 💛 We came back with beautiful memories, plenty of laughter and a trip we’ll definitely remember for a long time.\n\nHighly recommended for anyone looking to plan a memorable getaway with their favourite people!",
  },
  {
    id: "manikantan-narasimhan",
    displayOrder: 44,
    name: "Manikantan Narasimhan",
    destination: "Manali, Himachal Pradesh",
    travelMonth: "July",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "My Manali vacation was a wonderful experience, thanks to the excellent planning and smooth execution by Search My Vacation. As a solo traveller, the guided tour package made the journey comfortable and worry-free, while still giving me the freedom to enjoy the destination. The itinerary was well planned and offered great value for the budget. Truly appreciate the team for making my Manali trip so enjoyable!",
  },
  {
    id: "hari-haran-ravichandran",
    displayOrder: 45,
    name: "Hariharan R",
    destination: "Mangalore & Murudeshwar, Karnataka",
    travelMonth: "December",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "Our first family trip turned out to be an incredibly special experience, and Search My Vacation made sure it was memorable from beginning to end. From the moment we arrived at the railway station, the warm welcome and thoughtful assistance from the team made us feel comfortable and well taken care of.\n\nEverything we needed for the trip was thoughtfully arranged — from our stays and transportation to the sightseeing and overall coordination. We could simply relax, spend quality time together as a family, and enjoy discovering new places without having to worry about the arrangements.\n\nWhat truly stood out to us was the personal attention throughout the journey. The team checked in with us every day to make sure we were comfortable, enjoying ourselves, and had everything we needed. That level of care made us feel that our trip genuinely mattered to them.\n\nThe entire vacation was filled with wonderful moments, laughter, and memories that we will cherish as a family. A special thanks to Vivek and the entire Search My Vacation team for putting in so much effort and making our first family trip such a smooth, enjoyable, and unforgettable experience.\n\nWe are truly grateful and would be happy to travel with Search My Vacation again!",
  },
  {
    id: "kohila-dev-arun-kumar",
    displayOrder: 46,
    name: "KohilaDevi ArunKumar",
    destination: "Hyderabad, Telangana",
    travelMonth: "December",
    travelYear: 2024,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "Our Hyderabad trip was a truly joyful and memorable experience, and we’re very happy with how well everything was organised by Search My Vacation. From the travel arrangements to the stay and local transportation, everything was taken care of smoothly, allowing us to simply relax and enjoy our time together.\n\nOur driver was particularly wonderful — very humble, polite, and pleasant throughout the trip. Having someone so courteous and comfortable to travel with made a real difference, especially while exploring the city.\n\nThe stay was another highlight. The rooms were spacious, clean, and well maintained, and the complimentary breakfast was a lovely addition. What really stood out to us, though, was the availability of hot water throughout the day. It may sound like a small detail, but having reliable 24/7 hot water made our stay much more comfortable and was something we genuinely appreciated.\n\nOverall, everything was thoughtfully arranged and we had a wonderful time exploring Hyderabad without having to worry about the logistics. Thank you to the Search My Vacation team for organising such a pleasant experience for us.\n\nWe truly enjoyed the trip and would be happy to come on board with SMV again for another holiday!",
  },
  {
    id: "malleswari",
    displayOrder: 47,
    name: "Malleswari Reddy",
    destination: "Dubai & Abu Dhabi, UAE",
    travelMonth: "September",
    travelYear: 2025,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Dubai vacation with Search My Vacation was truly a memorable experience. From the planning stage to the end of the trip, everything was handled with great care and attention, making the entire holiday feel smooth and effortless.\n\nWe were able to relax and enjoy our time together as a family without having to worry about the arrangements. The overall experience was comfortable, well organised and exactly what we hoped for from a family vacation.\n\nA heartfelt thank you to the entire Search My Vacation team for putting together such a wonderful holiday for us. We came back with some beautiful memories and would definitely recommend their services to our friends and family.\n\nLooking forward to travelling with you again! ✨",
  },
  {
    id: "matilda-dsouza",
    displayOrder: 48,
    name: "Matilda Dsouza",
    destination: "Ooty, Tamil Nadu",
    travelMonth: "October",
    travelYear: 2023,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "We thoroughly enjoyed our Ooty trip and had a very pleasant stay. The property was comfortable, and the staff were extremely courteous, helpful and attentive throughout our stay.\n\nFor us, especially as senior travellers, the warmth of the staff and the quality of service made a big difference. Everything felt comfortable and welcoming, allowing us to relax and enjoy our time in beautiful Ooty.\n\nOverall, it was a wonderful experience, and we truly appreciate the arrangements made for us. We would be happy to travel with Search My Vacation again in the future.",
  },
  {
    id: "thiagarajan-s",
    displayOrder: 49,
    name: "Thiyagarajan Sambasivam",
    destination: "Bhubaneswar, Odisha",
    travelMonth: "November",
    travelYear: 2024,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: false,
    quote:
      "Our Bhubaneswar trip was an excellent experience from start to finish. The arrangements were smooth and well coordinated, allowing us to comfortably focus on experiencing the spiritual and cultural side of the journey.\n\nBeing able to attend the Rath Yatra and visit the beautiful temples of Bhubaneswar made the trip especially meaningful. Everything was organised thoughtfully, making the overall experience comfortable, hassle-free, and truly enjoyable.\n\nA big thank you to the Search My Vacation team for organising such a wonderful trip. We had a great time and would be happy to travel with SMV again!",
  },
  {
    id: "vidhya",
    displayOrder: 50,
    name: "Vidhya Karthi",
    destination: "Dubai & Abu Dhabi, UAE",
    travelMonth: "September",
    travelYear: 2025,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "“A fun-filled trip with comfort and convenience!”\n\nWe had a really enjoyable Dubai trip filled with fun, great experiences and wonderful memories. Everything came together nicely, making it easy for us to relax and make the most of our time in Dubai.\n\nOne of the highlights was the hotel stay. The property was in a very convenient and prime location, which made a real difference during the trip. We especially appreciated how easy it was to find good Indian restaurants nearby, making dining comfortable and convenient for our family.\n\nOverall, it was a pleasant and well-organised holiday, with a good balance of sightseeing, comfort and convenience. We came back with plenty of happy memories and would definitely recommend Search My Vacation for a hassle-free travel experience.",
  },
  {
    id: "vidhya-lakshmi",
    displayOrder: 51,
    name: "VidhyaLakshmi",
    destination: "Malaysia & Singapore",
    travelMonth: "July",
    travelYear: 2025,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "We honestly weren’t expecting the trip to go beyond our expectations, but Search My Vacation managed to surprise us in the best possible way.\n\nThe biggest highlight was having a completely private tour, without being clubbed with other tourists. It gave us the freedom to enjoy Malaysia and Singapore at our own pace, adjust our timings when needed, and spend a little more time at places we genuinely enjoyed. That flexibility made the entire experience feel much more personal.\n\nWe also loved how thoughtfully the itinerary was planned. Instead of trying to fit in too many places and rushing from one attraction to another, the schedule was comfortable, leisurely and well organised. Having clear timings for each place made it very easy for us to plan our days without feeling pressured.\n\nThe guides throughout the trip were warm, welcoming and knowledgeable. They explained the places well and made sightseeing much more enjoyable. A special shoutout to Mr. Gugan, who played a wonderful part in making our trip such a memorable experience.\n\nEven when there were little hiccups along the way, they were addressed promptly, which gave us the confidence that someone was always there to support us.\n\nOverall, it was a comfortable, relaxed and beautifully organised trip — exactly the kind of experience we wanted to have together. Search My Vacation truly made exploring Malaysia and Singapore feel effortless.\n\nA wonderful way to celebrate our love and create memories together. ❤️",
  },
  {
    id: "ahilandeswari-v",
    displayOrder: 52,
    name: "Ahilandeshwari V",
    destination: "Sri Lanka",
    travelMonth: "October",
    travelYear: 2024,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "Our Sri Lanka trip as a family of three was a truly wonderful experience, and we are grateful to Search My Vacation for making it so special. From the very beginning, the itinerary was thoughtfully curated, keeping in mind what we wanted from our holiday and ensuring that our time in Sri Lanka was well spent.\n\nWhat we particularly appreciated was the way the trip was planned. Everything felt well organised without making the holiday feel rushed, giving us the opportunity to enjoy the destination, spend quality time together and create beautiful memories as a family.\n\nSri Lanka itself was an incredible experience, with its scenic beauty, unique culture and warm atmosphere. Having a well-planned itinerary gave us the freedom to enjoy the journey rather than constantly worrying about what needed to be arranged next.\n\nIt was a memorable family holiday and one that we will cherish for a long time. Thank you, Search My Vacation, for putting together such a wonderful trip and helping us create memories that will stay with us forever.",
  },
] as const;
