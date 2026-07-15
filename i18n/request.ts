import { getRequestConfig } from "next-intl/server";
import zhHK from "@/messages/zh-HK.json";

// The client locale selector controls browser UI today. This server default keeps
// App Router rendering deterministic until locale-prefixed routes are introduced.
export default getRequestConfig(async () => ({
  locale: "zh-HK",
  messages: zhHK,
  timeZone: "Asia/Hong_Kong",
}));
