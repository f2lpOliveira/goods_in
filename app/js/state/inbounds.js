import { saveInbounds, loadInbounds } from "../repository/inboundRepository.js";

let inbounds = loadInbounds();

export function getInbounds() {
  return [...inbounds];
}

export function addInbound(inbound) {
  inbounds.push(inbound);

  saveInbounds(inbounds);
}

export function moveInboundToHistory(inboundId) {
  const inbound = inbounds.find(inbound => inbound.id === inboundId);

  if (!inbound) {
    return false;
  }

  inbound.status = "history";

  saveInbounds(inbounds);

  return true;
}

export function clearInbounds() {
  inbounds = [];

  saveInbounds(inbounds);
}
