import { generateConfig } from "./drizzle-config-fn";

require("dotenv").config({ path: [".env.development.local"] });
export default generateConfig();
