let inbounds = [];

export function getInbounds() {
  return inbounds;
}

export function addInbound(inbound) {
  inbounds.push(inbound);
}

export function clearInbounds() {
  inbounds = [];
}

export function setInbounds(newInbounds) {
  inbounds = newInbounds;
}
