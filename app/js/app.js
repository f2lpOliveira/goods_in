import { navigate } from "./router.js";
import { createInbound } from "./models/inbound.js";
import { createInboundItem } from "./models/inboundItem.js";

navigate("home");

console.log(createInbound());
console.log(createInboundItem());
