/** Read a server secret at runtime so the bundler cannot bake the value into the build. */
export function serverEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}
