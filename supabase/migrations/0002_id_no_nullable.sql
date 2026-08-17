-- The card number is now the row's own auto-incrementing `id` (unique,
-- sequential, starting at 1, assigned by the database and never user-edited),
-- so the old free-text id_no field is no longer collected from the form.
alter table public.cards alter column id_no drop not null;
