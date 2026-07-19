let currentInbound = null;

export function setCurrentInbound(inbound) {
  currentInbound = inbound;
}

export function getCurrentInbound() {
  return currentInbound;
}

export function clearCurrentInbound() {
  currentInbound = null;
}
