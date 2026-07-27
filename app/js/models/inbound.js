import { generateId } from "../utils/idUtils.js";

export function createInbound(values = {}) {
  const now = new Date().toISOString();

  return {
    id: generateId(),

    arrivalDate: values.arrivalDate ?? "",

    inboundReferenceNumber: values.inboundReferenceNumber ?? "",

    nextSequence: 1,

    items: [],

    createdAt: now,

    updatedAt: now,
  };
}
