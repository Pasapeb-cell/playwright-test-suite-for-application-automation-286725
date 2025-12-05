/**
 * Returns the baseURL for tests using environment variable FRONTEND_URL
 * or the default http://localhost:3000 when not defined.
 */
// PUBLIC_INTERFACE
export function getBaseUrl(): string {
  return process.env.FRONTEND_URL || 'http://localhost:3000';
}
