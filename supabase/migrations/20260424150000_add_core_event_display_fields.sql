/*
  # Add Core Event Display Fields

  Extends wedding_details so Mark Your Calendar card text can be managed
  directly from the Core tab, with proper date/time picker backing fields.
*/

ALTER TABLE wedding_details
ADD COLUMN IF NOT EXISTS wedding_date_value date;

ALTER TABLE wedding_details
ADD COLUMN IF NOT EXISTS ceremony_time_value time;

ALTER TABLE wedding_details
ADD COLUMN IF NOT EXISTS event_day_label text NOT NULL DEFAULT '';

ALTER TABLE wedding_details
ADD COLUMN IF NOT EXISTS event_time_note text NOT NULL DEFAULT '';

ALTER TABLE wedding_details
ADD COLUMN IF NOT EXISTS event_location_label text NOT NULL DEFAULT '';

UPDATE wedding_details
SET
  event_day_label = CASE WHEN event_day_label = '' THEN 'Saturday' ELSE event_day_label END,
  event_time_note = CASE WHEN event_time_note = '' THEN 'Reception to follow' ELSE event_time_note END,
  event_location_label = CASE WHEN event_location_label = '' THEN venue_address_line2 ELSE event_location_label END
WHERE true;

