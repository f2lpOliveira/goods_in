import { loadInbounds } from "./repository/inboundRepository.js";
import { setInbounds } from "./state/inbounds.js";
import { navigate } from "./router.js";

const savedInbounds = loadInbounds();

setInbounds(savedInbounds);

navigate("home");
