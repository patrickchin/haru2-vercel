import { generateConfig } from "./drizzle-config-fn";

require("dotenv").config({ path: [".env.production.local"] });
export default generateConfig();
