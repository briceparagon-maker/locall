export function isSameOriginPost(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }

  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(",")[0]
    .trim();
  if (!host) return false;

  const proto = (
    request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "")
  )
    .split(",")[0]
    .trim();

  return originUrl.origin === `${proto}://${host}`;
}
