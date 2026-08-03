# EBC-011 Journey Itinerary Generation Report

## Result

- Generation: **PASS**
- Deterministic artifact construction: **PASS**
- Source workbook: `outputs/ebc-010a/SMV-Journey-Itinerary-Knowledge-Base-v1.xlsx`
- Source workbook SHA-256: `05aa54863376d159fcc4684305aeb4a18b963f1053e0693122e719c172fa1312`
- Workbook worksheets: 52
- Control sheets: 3
- Itinerary sheets: 49
- INDEX rows: 49
- Included records: 49
- Excluded archived records: 0
- Inclusion mode: `release-1`
- Status distribution: draft=48, review=0, approved=1, archived=0
- Errors: 0
- Review required: 48
- Warnings: 0

Draft records are included temporarily under the explicit Release 1 policy. Workbook status remains in generated source metadata but is never shown to travellers.

## Runtime artifacts

- itinerary-aliases.json: `6eda1153ca1f895977c6532024285147cdb5b6119df477acf63a011b6129ccaa` (29,734 bytes)
- itinerary-catalogue.json: `c136d1f1a482e59ed7598ed4629a64bea4c2cb27dc73471a545ef06593d872a8` (312,396 bytes)
- itinerary-index.json: `2b2a4b379cfa8ff8ff566dcf40338baab4a888ee4e65129d340291d1ca797bb1` (41,049 bytes)

The website consumes generated JSON only. The workbook and generator-time ZIP/XML dependencies are not imported by runtime or client modules.

## Validation errors

- None.

## Review-required items

- DRAFT_INCLUDED — Kerala - Munnar-Alleppey-Kochi: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Uttar Pradesh - Agra: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Punjab - Amritsar: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Andaman Islands: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Goa: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Gujarat - Gir Forest: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Gujarat - Panch Dwarka: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Himachal - Shimla-Manali: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Himachal - Dharamshala & Dal: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Assam - Wildlife Tour: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Assam - Heritage & City Tour: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Gujarat - Rann of Kutch: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Hyderabad: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Karnataka - Hampi: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Karnataka - Coorg: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Karnataka - Bengaluru: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Karnataka - Kabini: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Karnataka - Bandipur: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Kashmir: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Kerala - Wayanad: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Northeast - Meghalaya: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Northeast - Sikkim: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Pondicherry: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Rajasthan - JJU: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Rajasthan - UKM: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Rajasthan - JJJ: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — TamilNadu - Temple Tour: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — TamilNadu - Chennai City Tour: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — TamilNadu - Kotagiri: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — TamilNadu - Kodaikanal: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — TamilNadu - Ooty: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — TamilNadu - Masinagudi: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Vizag: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Corbett National Park: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Bali: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Dubai: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Malaysia - Kuala Lumpur: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Malaysia - KL + Langkawi: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Singapore: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Sri Lanka - Ramayana Trail: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Sri Lanka - Southern Circuit: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Sri Lanka - North-East Circuit: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Thailand - Bangkok & Pattaya: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Thailand - Phuket & Krabi: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Vietnam - Hanoi: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Vietnam - Phu Quoc: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Vietnam - Da Nang: Draft record is included by the active Release 1 policy
- DRAFT_INCLUDED — Vietnam - Ho Chi Minh City: Draft record is included by the active Release 1 policy

## Warnings

- None.

## Workbook-to-runtime mapping

| Worksheet | INDEX Destination | Runtime ID | Destination Code | Parent | Journey Director candidates | Status | Validation |
|---|---|---|---|---|---|---|---|
| Andaman Islands | Port Blair, Havelock | andaman-islands | AN-AND | Andaman Islands | andaman | draft | REVIEW_REQUIRED |
| Vizag | Visakhapatnam & Araku Valley | andhra-pradesh-visakhapatnam-araku | AP-VIZ | Andhra Pradesh | vizag | draft | REVIEW_REQUIRED |
| Assam - Heritage & City Tour | Guwahati, Sivasagar & Majuli | assam-heritage-city-tour | AS-HER | Assam | — | draft | REVIEW_REQUIRED |
| Assam - Wildlife Tour | Kaziranga National Park | assam-wildlife-tour | AS-WLD | Assam | wildlife | draft | REVIEW_REQUIRED |
| Bali | Ubud, Seminyak/Kuta & Uluwatu | bali | ID-BAL | Bali | bali | draft | REVIEW_REQUIRED |
| Dubai | Dubai | dubai | AE-DXB | United Arab Emirates | dubai | draft | REVIEW_REQUIRED |
| Goa | Goa | goa | GA-GOA | Goa | goa | draft | REVIEW_REQUIRED |
| Gujarat - Gir Forest | Gir Forest | gujarat-gir-forest | GJ-GIR | Gujarat | gujarat, wildlife | draft | REVIEW_REQUIRED |
| Gujarat - Panch Dwarka | Dwarka, Bet Dwarka, Nageshwar & Rukmini Devi Temple | gujarat-panch-dwarka | GJ-DWK | Gujarat | gujarat | draft | REVIEW_REQUIRED |
| Gujarat - Rann of Kutch | Rann of Kutch | gujarat-rann-of-kutch | GJ-RAK | Gujarat | gujarat | draft | REVIEW_REQUIRED |
| Himachal - Dharamshala & Dal | Dharamshala | himachal-pradesh-dharamshala-dalhousie | HP-DHD | Himachal Pradesh | himachal-pradesh | draft | REVIEW_REQUIRED |
| Himachal - Shimla-Manali | Shimla & Manali | himachal-pradesh-shimla-manali | HP-SHM | Himachal Pradesh | himachal-pradesh | draft | REVIEW_REQUIRED |
| Kashmir | Srinagar, Gulmarg & Pahalgam | jammu-kashmir-srinagar-gulmarg-pahalgam | JK-KMR | Jammu & Kashmir | kashmir | draft | REVIEW_REQUIRED |
| Karnataka - Bandipur | Bandipur | karnataka-bandipur | KA-BND | Karnataka | karnataka, wildlife | draft | REVIEW_REQUIRED |
| Karnataka - Bengaluru | Bengaluru | karnataka-bengaluru | KA-BLR | Karnataka | karnataka | draft | REVIEW_REQUIRED |
| Karnataka - Coorg | Coorg | karnataka-coorg | KA-COR | Karnataka | karnataka | draft | REVIEW_REQUIRED |
| Karnataka - Hampi | Hampi | karnataka-hampi | KA-HMP | Karnataka | karnataka | draft | REVIEW_REQUIRED |
| Karnataka - Kabini | Kabini | karnataka-kabini | KA-KBN | Karnataka | karnataka, wildlife | draft | REVIEW_REQUIRED |
| Kerala - Munnar | Munnar | kerala-munnar | KL-MUN | Kerala | kerala | approved | PASS |
| Kerala - Munnar-Alleppey-Kochi | Munnar, Alleppey & Cochin | kerala-munnar-alleppey-kochi | KL-MAC | Kerala | kerala | draft | REVIEW_REQUIRED |
| Kerala - Wayanad | Wayanad | kerala-wayanad | KL-WAY | Kerala | kerala | draft | REVIEW_REQUIRED |
| Malaysia - Kuala Lumpur | Kuala Lumpur | malaysia-kuala-lumpur | MY-KUL | Malaysia | malaysia | draft | REVIEW_REQUIRED |
| Malaysia - KL + Langkawi | Kuala Lumpur & Langkawi | malaysia-kuala-lumpur-langkawi | MY-KLL | Malaysia | malaysia | draft | REVIEW_REQUIRED |
| Northeast - Meghalaya | Shillong, Cherrapunji | northeast-meghalaya | ML-SHL | Northeast India | northeast | draft | REVIEW_REQUIRED |
| Northeast - Sikkim | Gangtok, Lachen/Lachung | northeast-sikkim | SK-GTK | Northeast India | northeast | draft | REVIEW_REQUIRED |
| Pondicherry | Pondicherry | pondicherry | PY-PON | Puducherry | pondicherry | draft | REVIEW_REQUIRED |
| Punjab - Amritsar | Amritsar | punjab-amritsar | PB-AMR | Punjab | — | draft | REVIEW_REQUIRED |
| Rajasthan - JJJ | Jaipur, Jodhpur & Jaisalmer | rajasthan-jaipur-jodhpur-jaisalmer | RJ-JJJ | Rajasthan | rajasthan | draft | REVIEW_REQUIRED |
| Rajasthan - JJU | Jaipur, Jodhpur & Udaipur | rajasthan-jaipur-jodhpur-udaipur | RJ-JJU | Rajasthan | rajasthan | draft | REVIEW_REQUIRED |
| Rajasthan - UKM | Udaipur, Kumbhalgarh & Mount Abu | rajasthan-udaipur-kumbhalgarh-mount-abu | RJ-UKM | Rajasthan | rajasthan | draft | REVIEW_REQUIRED |
| Singapore | Singapore | singapore | SG-SIN | Singapore | singapore | draft | REVIEW_REQUIRED |
| Sri Lanka - North-East Circuit | Sigiriya, Trincomalee & Jaffna | sri-lanka-north-east-circuit | LK-SJT | Sri Lanka | sri-lanka | draft | REVIEW_REQUIRED |
| Sri Lanka - Ramayana Trail | Chilaw, Kandy, Nuwara Eliya, Ella & Colombo | sri-lanka-ramayana-trail | LK-RAM | Sri Lanka | sri-lanka | draft | REVIEW_REQUIRED |
| Sri Lanka - Southern Circuit | Kandy, Nuwara Eliya, Bentota, Galle & Colombo | sri-lanka-southern-circuit | LK-KNB | Sri Lanka | sri-lanka | draft | REVIEW_REQUIRED |
| TamilNadu - Chennai City Tour | Chennai | tamil-nadu-chennai | TN-CHE | Tamil Nadu | tamil-nadu | draft | REVIEW_REQUIRED |
| TamilNadu - Kodaikanal | Kodaikanal | tamil-nadu-kodaikanal | TN-KDK | Tamil Nadu | tamil-nadu | draft | REVIEW_REQUIRED |
| TamilNadu - Kotagiri | Kotagiri | tamil-nadu-kotagiri | TN-KTG | Tamil Nadu | tamil-nadu | draft | REVIEW_REQUIRED |
| TamilNadu - Masinagudi | Masinagudi | tamil-nadu-masinagudi | TN-MSN | Tamil Nadu | tamil-nadu, wildlife | draft | REVIEW_REQUIRED |
| TamilNadu - Ooty | Ooty | tamil-nadu-ooty | TN-OOT | Tamil Nadu | tamil-nadu | draft | REVIEW_REQUIRED |
| TamilNadu - Temple Tour | Thanjavur, Chidambaram/Kumbakonam, Madurai & Rameswaram | tamil-nadu-temple-tour | TN-TMP | Tamil Nadu | tamil-nadu | draft | REVIEW_REQUIRED |
| Hyderabad | Hyderabad | telangana-hyderabad | TG-HYD | Telangana | hyderabad | draft | REVIEW_REQUIRED |
| Thailand - Bangkok & Pattaya | Bangkok & Pattaya | thailand-bangkok-pattaya | TH-BKP | Thailand | thailand | draft | REVIEW_REQUIRED |
| Thailand - Phuket & Krabi | Phuket & Krabi | thailand-phuket-krabi | TH-PHK | Thailand | thailand | draft | REVIEW_REQUIRED |
| Uttar Pradesh - Agra | Agra | uttar-pradesh-agra | UP-AGR | Uttar Pradesh | agra | draft | REVIEW_REQUIRED |
| Corbett National Park | Jim Corbett National Park | uttarakhand-corbett-national-park | UK-CBT | Uttarakhand | wildlife | draft | REVIEW_REQUIRED |
| Vietnam - Da Nang | Da Nang & Hoi An | vietnam-da-nang | VN-DAD | Vietnam | vietnam | draft | REVIEW_REQUIRED |
| Vietnam - Hanoi | Hanoi & Halong Bay | vietnam-hanoi | VN-HAN | Vietnam | vietnam | draft | REVIEW_REQUIRED |
| Vietnam - Ho Chi Minh City | Ho Chi Minh City & Mekong Delta | vietnam-ho-chi-minh-city | VN-SGN | Vietnam | vietnam | draft | REVIEW_REQUIRED |
| Vietnam - Phu Quoc | Phu Quoc Island | vietnam-phu-quoc | VN-PQC | Vietnam | vietnam | draft | REVIEW_REQUIRED |

## Unmatched workbook records

- assam-heritage-city-tour
- punjab-amritsar

## Unmatched Journey Director candidates

- None.

## Stable ID and alias governance

- Runtime IDs are explicitly mapped from unique Destination Codes.
- Worksheet names are retained only as source audit metadata.
- Exact Journey Director region IDs, candidate IDs, destination codes, canonical aliases, journey bases, and parent defaults are generated as separate deterministic mappings.
- Rajasthan worksheet abbreviations never appear in traveller-facing destination names.
- New Destination Codes without an explicit stable mapping are marked REVIEW_REQUIRED.

## Normalisation rules

- Durations accept `5 Days / 4 Nights`, `5D/4N`, and equivalent case-insensitive forms.
- Yes/No fields are converted to booleans; any other token is an ERROR.
- Semicolon metadata is trimmed and deduplicated case-insensitively while preserving first display casing.
- Month names are canonicalised to January–December; unknown tokens require review.
- Excel serial dates are converted deterministically to ISO `YYYY-MM-DD` strings.

## Future workbook update workflow

1. Team Satvi updates the Excel workbook.
2. Revision Number and Last Updated are changed.
3. INDEX is reviewed.
4. `npm run generate:journey-itineraries` is run.
5. Validation and mapping reports are reviewed.
6. Generated JSON changes are reviewed; generated JSON is never edited manually.
7. Tests pass.
8. Workbook and generated JSON are committed together.
9. The website is deployed.
