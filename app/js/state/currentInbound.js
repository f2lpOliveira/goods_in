import {
  saveCurrentInbound,
  loadCurrentInbound,
  clearCurrentInbound as removeCurrentInbound,
} from "../repository/currentInboundRepository.js";

export function getCurrentInbound() {
  return loadCurrentInbound();
}

export function setCurrentInbound(inbound) {
  saveCurrentInbound(inbound);
}

export function updateCurrentInbound(inbound) {
  saveCurrentInbound(inbound);
}

export function clearCurrentInbound() {
  removeCurrentInbound();
}
