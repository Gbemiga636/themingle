/** Read a server secret at runtime. The name stays a variable so the bundler cannot inline the value. */
export function serverEnv(name: string) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  if (!env) return "";
  const value = env[name];
  return typeof value === "string" ? value.trim() : "";
}
