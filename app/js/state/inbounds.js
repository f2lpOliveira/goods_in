import { saveInbounds, loadInbounds } from "../repository/inboundRepository.js";

let inbounds = loadInbounds();

export function getInbounds() {
  return [...inbounds];
}

export function addInbound(inbound) {
  inbounds.push(inbound);

  saveInbounds(inbounds);
}

export function clearInbounds() {
  inbounds = [];

  saveInbounds(inbounds);
}
