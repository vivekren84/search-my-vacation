# SMV Destination Editorial Collection

## Document Control

- Version: v1.1
- Status: Release 1 active mapping approved; one documented fallback remains
- Last Updated: 29 July 2026
- Owner: Search My Vacation
- Collection: Journey Director Destination Imagery

This tracker is the source of truth for Journey Director presentation imagery. “Canonical” means selected by the active runtime. “Retained” means preserved for editorial reference or a future catalogue area and never selected by the current deterministic mapping.

The collection is not complete: the active Tamil Nadu runtime area is Madurai, and no approved Madurai-specific image is present. That candidate therefore uses the documented generic fallback until a suitable asset is approved.

## Visual Standard

Each approved destination image is a unique, photorealistic, premium editorial travel scene in a wide 16:9 composition. It must have an unmistakable destination signature, warm natural light, safe crop space, credible architecture or landscape, and understated human presence where it strengthens the story. Images must not contain overlays, logos, watermarks, collages or readable text.

## Canonical Runtime Asset

| Runtime identifier | Display destination and active area | Canonical runtime asset | Status | Notes |
| --- | --- | --- | --- | --- |
| `agra` | Agra — Taj East Gate / Tajganj | `agra.webp` | Approved and active | Agra appears once; the superseded pending row was removed. |
| `amritsar` | Amritsar — Golden Temple precinct | `amritsar.webp` | Approved and active | Amritsar appears once; the superseded pending row was removed. |
| `andaman` | Andaman — Swaraj Dweep (Havelock) | `andaman-v2.webp` | Approved and active | The Cellular Jail composition is the current approved Andaman identity. |
| `bali` | Bali — Ubud | `bali.webp` | Approved and active | Replaces the legacy Journey Director JPG at runtime. |
| `dubai` | Dubai — Downtown Dubai | `dubai.webp` | Approved and active | Base and `v3` files are byte-identical; the stable base filename is canonical. |
| `goa` | Goa — South Goa | `goa.webp` | Approved and active | Replaces the Journey Passport beach fallback at runtime. |
| `gujarat` | Gujarat — Ahmedabad and heritage corridor | `gujarat.webp` | Approved and active | Base and `v2` files are byte-identical; the stable base filename is canonical. |
| `himachal-pradesh` | Himachal Pradesh — Shimla / Mashobra | `himachal-pradesh.webp` | Approved and active | Base and `v2` files are byte-identical; the destination-level asset is not an area-specific promise. |
| `hyderabad` | Hyderabad — Charminar and old city | `hyderabad.webp` | Approved and active | — |
| `karnataka` | Karnataka — Coorg | `karnataka.webp` | Approved and active | Destination-level asset; not an area-specific promise. |
| `kashmir` | Kashmir — Pahalgam | `kashmir.webp` | Approved and active | Destination-level asset; not an area-specific promise. |
| `kerala` | Kerala — Alappuzha | `kerala.webp` | Approved and active | Replaces the legacy Journey Director JPG at runtime. |
| `malaysia` | Malaysia — Penang / George Town | `malaysia.webp` | Approved and active | Destination-level asset; not an area-specific promise. |
| `northeast` | North East India — Shillong and Sohra, Meghalaya | `meghalaya.webp` | Approved and active | Meghalaya is the active catalogue area. Sikkim and Darjeeling remain served aliases but are not active areas in this candidate record. |
| `pondicherry` | Pondicherry — French Quarter / White Town | `pondicherry.webp` | Approved and active (review note) | The approved source contains small café-board text; product approval remains recorded. |
| `assam` | Assam — Kaziranga | `assam.webp` | Approved and active | — |
| `rajasthan` | Rajasthan — Udaipur | `rajasthan.webp` | Approved and active | Destination-level asset; not an area-specific promise. |
| `singapore` | Singapore — Civic District / Singapore River | `singapore.webp` | Approved and active | Destination-level asset; not an area-specific promise. |
| `sri-lanka` | Sri Lanka — Bentota and Galle | `sri-lanka.webp` | Approved and active | Replaces the legacy Journey Director JPG at runtime; the asset is destination-level rather than area-specific. |
| `tamil-nadu` | Tamil Nadu — Madurai | `/images/golden-hour.png` | Approved, activation pending | Documented generic fallback. Ooty, Kotagiri and Kodaikanal images are not valid substitutes for Madurai. |
| `thailand` | Thailand — Krabi / Ao Nang / Railay access | `thailand.webp` | Approved and active | Destination-level asset; not an area-specific promise. |
| `vietnam` | Vietnam — Hoi An | `vietnam.webp` | Approved and active | Destination-level asset; not an area-specific promise. |
| `vizag` | Vizag — Rushikonda / northern coast | `vizag.webp` | Approved and active | Replaces the Journey Passport tropical fallback at runtime. |
| `wildlife` | Wildlife Circuits — Kabini | `kabini.webp` | Approved and active | Kabini is the active catalogue area. Corbett, Bandipur and Masinagudi remain served aliases but are not active areas in this candidate record. |

All canonical asset paths are root-relative under `/images/journey-director/`, except the explicitly documented Tamil Nadu fallback.

## Retained Editorial Alternatives

| Destination or group | Retained files | Status | Relationship to canonical asset |
| --- | --- | --- | --- |
| Andaman | `andaman.webp`, `andaman-v3.webp` | Editorial alternative retained | Both are visually distinct from canonical `andaman-v2.webp`. |
| Bali | `bali-ubud-golden-hour.jpg` | Editorial alternative retained | Legacy JPG; inactive after WebP activation. |
| Darjeeling | `darjeeling.webp`, `darjeeling-v2.webp` | Editorial alternative retained | Byte-identical pair; neither is active while Meghalaya remains the `northeast` area. |
| Dubai | `dubai-v3.webp` | Editorial alternative retained | Byte-identical to canonical `dubai.webp`. |
| Gujarat | `gujarat-v2.webp` | Editorial alternative retained | Byte-identical to canonical `gujarat.webp`. |
| Himachal Pradesh | `himachal-pradesh-v2.webp`, `himachal-pradesh-v3.webp` | Editorial alternative retained | `v2` is byte-identical to canonical; `v3` is visually distinct. |
| Kabini | `kabini-final.webp` | Editorial alternative retained | Byte-identical to canonical `kabini.webp`. |
| Kerala | `kerala-alleppey-golden-hour.jpg` | Editorial alternative retained | Legacy JPG; inactive after WebP activation. |
| Kodaikanal | `kodaikanal.webp`, `kodaikanal-v2.webp`, `kodaikanal-v3.webp` | Editorial alternative retained | Base and `v3` are byte-identical; `v2` is distinct. None represents active Madurai. |
| Kotagiri | `kotagiri.webp` | Editorial alternative retained | Retained for a future Tamil Nadu area record; inactive for Madurai. |
| Meghalaya | `meghalaya-v2.webp` | Editorial alternative retained | Byte-identical to canonical `meghalaya.webp`. |
| Ooty | `ooty.webp` | Editorial alternative retained | Retained for a future Tamil Nadu area record; inactive for Madurai. |
| Sikkim | `sikkim.webp`, `sikkim-v2.webp` | Editorial alternative retained | Byte-identical pair; inactive while Meghalaya remains the `northeast` area. |
| Sri Lanka | `sri-lanka-galle-golden-hour.jpg` | Editorial alternative retained | Legacy JPG; inactive after WebP activation. |
| Wildlife circuits | `corbett.webp`, `bandipur.webp`, `masinagudi.webp` | Editorial alternative retained | Retained for future area-specific records; inactive while Kabini is the active `wildlife` area. |

No retained alternative is selected by filesystem order, filename suffix, or rotation. The runtime uses only the explicit canonical mapping.

## Fallback Policy

1. A fallback is allowed only when an active runtime destination-area pair lacks an approved matching asset.
2. The fallback must be explicit in both this tracker and the runtime mapping.
3. A nearby or aliased destination image must not be used when it would misrepresent the selected area.
4. The fallback remains deterministic and cannot affect destination eligibility, scoring, recommendation order or personality assignment.
5. When an approved matching asset is activated, its canonical path must replace the fallback in the tracker, runtime mapping and verification checks together.

The only current fallback is `tamil-nadu` / Madurai, which uses `/images/golden-hour.png`.

## Outstanding Actions

- Source, review and approve a Madurai-specific 16:9 WebP.
- Replace the `tamil-nadu` generic fallback only after that asset is approved.
- Create separate governed candidate-area records before activating the retained Sikkim, Darjeeling, Ooty, Kotagiri, Kodaikanal, Corbett, Bandipur or Masinagudi images.
- Re-review the small café-board text in `pondicherry.webp` if product standards change.
- Preserve all retained files until a separate editorial-retention decision authorises cleanup.
