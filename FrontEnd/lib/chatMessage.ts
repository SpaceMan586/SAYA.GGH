export type ChatRole = "user" | "bot" | "admin";

const ROLE_PREFIX = "__role:";
const ROLE_SEPARATOR = "__";

export function encodeChatContent(role: ChatRole, content: string) {
  return `${ROLE_PREFIX}${role}${ROLE_SEPARATOR}${content}`;
}

export function decodeChatContent(raw: string): { role: ChatRole; content: string } {
  if (raw.startsWith(ROLE_PREFIX)) {
    const rest = raw.slice(ROLE_PREFIX.length);
    const sepIndex = rest.indexOf(ROLE_SEPARATOR);
    if (sepIndex > -1) {
      const role = rest.slice(0, sepIndex) as ChatRole;
      const content = rest.slice(sepIndex + ROLE_SEPARATOR.length);
      if (role === "user" || role === "bot" || role === "admin") {
        return { role, content };
      }
    }
  }
  return { role: "user", content: raw };
}
