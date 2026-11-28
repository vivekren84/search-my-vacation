-- Release 1.5.5 Post-Release Enhancement: Accepted Itinerary Attachments in Itinerary Tab
ALTER TABLE public.workspace_trip_documents
  DROP CONSTRAINT IF EXISTS workspace_trip_documents_category_check;

ALTER TABLE public.workspace_trip_documents
  ADD CONSTRAINT workspace_trip_documents_category_check
  CHECK (category IN ('Hotel Voucher', 'Cab/Transfer', 'Tickets', 'Visa/Insurance', 'Client ID', 'Accepted Itinerary'));
