export function createInbound() {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),

    arrivalDate: "",
    inboundReferenceNumber: "",

    nextSequence: 1,

    items: [],

    createdAt: now,
    updatedAt: now,
  };
}
