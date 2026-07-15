import { getRequestConfig } from "next-intl/server";
import enUS from "@/messages/en-US.json";

// The client locale selector controls browser UI today. This server default keeps
// App Router rendering deterministic until locale-prefixed routes are introduced.
export default getRequestConfig(async () => ({
  locale: "en-US",
  messages: enUS,
  timeZone: "Asia/Hong_Kong",
}));
