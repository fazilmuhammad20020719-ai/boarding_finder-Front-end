// Room availability as sent by the API (capacity, occupied_count,
// spaces_available, is_fully_booked). Older responses without these
// fields are treated as a 1-bed room.
export function getAvailability(listing = {}) {
  const capacity = Math.max(1, Number(listing.capacity) || 1);
  const occupied = Math.max(0, Number(listing.occupied_count) || 0);
  const available = Math.max(0, capacity - occupied);
  const full = listing.is_fully_booked === true || occupied >= capacity;
  return {
    capacity,
    occupied,
    available,
    full,
    // e.g. "4/8 occupied – 4 spaces available"
    label: full
      ? `${occupied}/${capacity} occupied – Fully Booked`
      : `${occupied}/${capacity} occupied – ${available} ${available === 1 ? 'space' : 'spaces'} available`,
    short: full ? 'Fully Booked' : `${available}/${capacity} available`,
  };
}
