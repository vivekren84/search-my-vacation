-- Release 1.5.5 Milestone 5: Split-Layout Sign-In Banners (EPIC 5),
-- Destination-First Regional Circuits Engine (EPIC 7), and DB Copy Hygiene (EPIC 8)

-- ============================================================================
-- 1. Admin-Configurable Login Showcase Banners (public.portal_login_banners)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portal_login_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  region_label TEXT NOT NULL DEFAULT 'Curated Slow Travel',
  image_url TEXT NOT NULL,
  cta_label TEXT DEFAULT 'Explore Destinations',
  cta_href TEXT DEFAULT '/destinations',
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.portal_login_banners ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.portal_login_banners FROM PUBLIC;
GRANT SELECT ON public.portal_login_banners TO anon, authenticated;
GRANT ALL ON public.portal_login_banners TO authenticated, service_role;

DROP POLICY IF EXISTS portal_login_banners_read_all ON public.portal_login_banners;
CREATE POLICY portal_login_banners_read_all ON public.portal_login_banners
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS portal_login_banners_staff_write ON public.portal_login_banners;
CREATE POLICY portal_login_banners_staff_write ON public.portal_login_banners
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO public.portal_login_banners (title, subtitle, region_label, image_url, cta_label, cta_href, sort_order, is_active)
SELECT * FROM (
  VALUES
    (
      'Unhurried Mornings on Kerala Backwaters',
      'Private heritage houseboats, spice-trail estates, and quiet coastal pauses crafted for thoughtful travellers.',
      'Kerala • Slow Travel',
      '/images/golden-hour.png',
      'Explore Kerala',
      '/destinations',
      1,
      true
    ),
    (
      'Western Himalayan Deodar Sanctuaries',
      'Colonial ridge retreats in Dalhousie & Kangra Valley paired with private mountain transfers and guided forest walks.',
      'Himachal Pradesh • Mountains',
      '/images/travel-inspiration/feeling-led-journey.webp',
      'Explore Himalayas',
      '/destinations',
      2,
      true
    ),
    (
      'Sri Lanka Tea Highlands & Southern Coast',
      'From misty Nuwara Eliya estates to Galle Fort heritage lanes—curated end-to-end by our Chennai Journey Design Desk.',
      'Sri Lanka • International',
      '/images/homepage/our-promise-planning.webp',
      'Explore Sri Lanka',
      '/destinations',
      3,
      true
    )
) AS seed(title, subtitle, region_label, image_url, cta_label, cta_href, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.portal_login_banners);

-- ============================================================================
-- 2. Regional Circuits Master Table (public.regional_circuits — EPIC 7.2)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.regional_circuits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circuit_title TEXT UNIQUE NOT NULL,
  state_or_country TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  indicative_days TEXT NOT NULL DEFAULT '6–8 Days',
  anchor_destinations TEXT[] NOT NULL DEFAULT '{}'::text[],
  compatible_personas TEXT[] NOT NULL DEFAULT '{}'::text[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.regional_circuits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.regional_circuits FROM PUBLIC;
GRANT SELECT ON public.regional_circuits TO anon, authenticated;
GRANT ALL ON public.regional_circuits TO authenticated, service_role;

DROP POLICY IF EXISTS regional_circuits_read_all ON public.regional_circuits;
CREATE POLICY regional_circuits_read_all ON public.regional_circuits
  FOR SELECT TO anon, authenticated
  USING (true);

INSERT INTO public.regional_circuits (circuit_title, state_or_country, subtitle, indicative_days, anchor_destinations, compatible_personas, is_active)
VALUES
  -- Himachal Pradesh
  (
    'Dharamshala, Dalhousie & Kangra Valley Circuit',
    'Himachal Pradesh',
    'Deodar forest trails, colonial hill retreats & Dhauladhar views',
    '6–8 Days',
    ARRAY['Dalhousie', 'Khajjiar', 'Chamba', 'Dharamshala', 'McLeod Ganj', 'Palampur', 'Himachal Pradesh'],
    ARRAY['spirited_adventurer', 'mindful_explorer', 'multi_gen_voyager', 'heritage_connoisseur'],
    true
  ),
  (
    'Shimla, Kinnaur & Spiti / Kullu-Manali Alpine Corridor',
    'Himachal Pradesh',
    'Cedar pine ridges, apple orchards & high Himalayan passes',
    '6–8 Days',
    ARRAY['Shimla', 'Manali', 'Kullu', 'Kasol', 'Jibhi', 'Spiti', 'Kinnaur', 'Himachal Pradesh'],
    ARRAY['spirited_adventurer', 'mindful_explorer', 'romantic_wanderer'],
    true
  ),
  -- Rajasthan
  (
    'Udaipur, Kumbhalgarh & Aravalli Sanctuary Circuit',
    'Rajasthan',
    'Lakeside heritage palaces, Aravalli hill forts & leopard country',
    '5–7 Days',
    ARRAY['Kumbhalgarh', 'Udaipur', 'Ranakpur', 'Jawai', 'Mount Abu', 'Rajasthan'],
    ARRAY['heritage_connoisseur', 'romantic_wanderer', 'spirited_adventurer', 'multi_gen_voyager'],
    true
  ),
  (
    'Jaipur, Jodhpur & Thar Heritage Trail',
    'Rajasthan',
    'Living royal forts, desert dune camps & craft ateliers',
    '6–8 Days',
    ARRAY['Jaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Bikaner', 'Ranthambore', 'Rajasthan'],
    ARRAY['heritage_connoisseur', 'multi_gen_voyager', 'spirited_adventurer'],
    true
  ),
  -- Kerala & Tamil Nadu
  (
    'Central Backwaters & Marari Coast',
    'Kerala',
    'Palm-fringed tranquil waterways, heritage homesteads & sea air',
    '5–7 Days',
    ARRAY['Kerala', 'Alleppey', 'Kumarakom', 'Marari', 'Kochi', 'Munnar', 'Thekkady', 'Kovalam', 'Varkala', 'Wayanad'],
    ARRAY['romantic_wanderer', 'mindful_explorer', 'multi_gen_voyager'],
    true
  ),
  (
    'Nilgiri Highlands & Foothills Corridor',
    'Tamil Nadu',
    'Colonial tea hills, biosphere trails & coastal heritage towns',
    '4–6 Days',
    ARRAY['Tamil Nadu', 'Ooty', 'Kotagiri', 'Masinagudi', 'Kodaikanal', 'Yercaud', 'Pondicherry', 'Madurai', 'Chennai'],
    ARRAY['mindful_explorer', 'multi_gen_voyager', 'heritage_connoisseur'],
    true
  ),
  -- Uttarakhand
  (
    'Garhwal Highlands & Rishikesh Gateway',
    'Uttarakhand',
    'Forest river valleys, alpine sanctuaries & quiet mountain retreats',
    '6–8 Days',
    ARRAY['Uttarakhand', 'Rishikesh', 'Mussoorie', 'Dehradun', 'Auli', 'Pauri Garhwal', 'Corbett'],
    ARRAY['mindful_explorer', 'spirited_adventurer', 'multi_gen_voyager'],
    true
  ),
  -- Karnataka
  (
    'Coorg Coffee Estates & Kabini Wildlife Trail',
    'Karnataka',
    'Misty plantation bungalows, river safaris & heritage temples',
    '5–7 Days',
    ARRAY['Karnataka', 'Coorg', 'Kabini', 'Bandipur', 'Chikmagalur', 'Mysuru', 'Bengaluru', 'Sakleshpur'],
    ARRAY['spirited_adventurer', 'romantic_wanderer', 'multi_gen_voyager'],
    true
  ),
  -- Kashmir & Ladakh
  (
    'Srinagar, Gulmarg & Pahalgam Alpine Valley Circuit',
    'Kashmir',
    'Dal Lake houseboats, chinar meadows & high-altitude gondolas',
    '6–8 Days',
    ARRAY['Kashmir', 'Srinagar', 'Gulmarg', 'Pahalgam', 'Leh Ladakh'],
    ARRAY['romantic_wanderer', 'mindful_explorer', 'multi_gen_voyager', 'spirited_adventurer'],
    true
  ),
  -- Andaman
  (
    'Port Blair, Havelock & Neil Island Archipelago',
    'Andaman',
    'Bioluminescent lagoons, coral reefs & unhurried island beaches',
    '5–7 Days',
    ARRAY['Andaman', 'Havelock', 'Port Blair', 'Neil'],
    ARRAY['romantic_wanderer', 'multi_gen_voyager', 'mindful_explorer'],
    true
  ),
  -- International
  (
    'Sri Lanka Cultural Triangle, Tea Hills & Galle Coast',
    'Sri Lanka',
    'Sigiriya rock fortresses, Ella tea estates & Dutch-era coast',
    '7–9 Days',
    ARRAY['Sri Lanka', 'Colombo', 'Nuwara Eliya, Sri Lanka', 'Beruwala, Sri Lanka'],
    ARRAY['heritage_connoisseur', 'multi_gen_voyager', 'romantic_wanderer'],
    true
  ),
  (
    'Hanoi, Halong Bay & Hoi An Heritage Trail',
    'Vietnam',
    'Limestone karsts, lantern-lit river towns & culinary walks',
    '7–9 Days',
    ARRAY['Vietnam', 'Hanoi'],
    ARRAY['heritage_connoisseur', 'spirited_adventurer', 'romantic_wanderer'],
    true
  ),
  (
    'Ubud Rainforest Sanctuaries & Uluwatu Coast',
    'Bali',
    'Terraced rice paddies, temple rituals & cliffside ocean sunsets',
    '6–8 Days',
    ARRAY['Bali'],
    ARRAY['romantic_wanderer', 'mindful_explorer'],
    true
  )
ON CONFLICT (circuit_title) DO UPDATE
SET
  state_or_country = EXCLUDED.state_or_country,
  subtitle = EXCLUDED.subtitle,
  indicative_days = EXCLUDED.indicative_days,
  anchor_destinations = EXCLUDED.anchor_destinations,
  compatible_personas = EXCLUDED.compatible_personas,
  is_active = true;
