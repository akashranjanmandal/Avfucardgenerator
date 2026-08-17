-- Role drives the card's border color and who signs it (Registrar signs
-- everyone's card except their own, which the Vice Chancellor signs).
alter table public.cards add column if not exists role text;
