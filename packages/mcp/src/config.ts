/**
 * The server holds no content of its own — every tool resolves to a fetch of a
 * canonical Arlo UI URL. Point it at a local site/registry with env vars for
 * development; it defaults to production so `npx @arloui/mcp` just works.
 */
const strip = (url: string) => url.replace(/\/+$/, '');

export const BASE_URL = strip(process.env.ARLO_BASE_URL ?? 'https://arloui.com');

/** The registry index/entries live under `<base>/r` unless overridden. */
export const REGISTRY_URL = strip(process.env.ARLO_REGISTRY_URL ?? `${BASE_URL}/r`);

export const SERVER_NAME = 'arloui';
export const SERVER_VERSION = '0.1.0';
