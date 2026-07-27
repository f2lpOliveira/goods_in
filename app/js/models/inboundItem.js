import { generateId } from "../utils/idUtils.js";

export function createInboundItem(values = {}, sequence = 1) {
  return {
    id: generateId(),

    productCode: values.productCode ?? "",

    mixedPallet: values.mixedPallet === "true",

    batchCode: values.batchCode ?? "",

    bbd: values.bbd ?? "",

    quantity: Number(values.quantity ?? 0),

    sequence,

    photos: [],
  };
}
