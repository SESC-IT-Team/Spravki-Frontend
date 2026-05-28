const CHANNEL_NAME = 'spravki-auth';
let bc = null;
let initialized = false;
let authApiUrl = '';
let authFrontendUrl = '';
let intervalId = null;

async function doRefresh() {
  if (!authApiUrl) return false;
  try {
    const resp = await fetch(`${authApiUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (resp.ok) {
      try { await resp.json().catch(() => ({})); } catch {};
      bc?.postMessage({ type: 'refresh-result', success: true });
      return true;
    }
  } catch (err) {
    // ignore
  }

  bc?.postMessage({ type: 'refresh-result', success: false });
  return false;
}

export function initTokenRefresher({ AUTH_API_URL, AUTH_FRONTEND_URL, intervalMs = 10 * 60 * 1000 } = {}) {
  if (initialized) return;
  initialized = true;
  authApiUrl = AUTH_API_URL;
  authFrontendUrl = AUTH_FRONTEND_URL;

  try {
    bc = new BroadcastChannel(CHANNEL_NAME);

    bc.addEventListener('message', async (ev) => {
      const data = ev.data || {};
      if (data.type === 'request-refresh') {
        await doRefresh();
      }
    });
  } catch (e) {
    bc = null;
  }

  const tick = async () => {
    try { await doRefresh(); } catch {}
  };

  tick();
  intervalId = setInterval(tick, intervalMs);
}

export async function requestRefresh(timeout = 5000) {
  if (!bc) {
    return await doRefresh();
  }

  const localPromise = doRefresh();

  const waitPromise = new Promise((resolve) => {
    const handler = (ev) => {
      const data = ev.data || {};
      if (data.type === 'refresh-result') {
        bc.removeEventListener('message', handler);
        resolve(!!data.success);
      }
    };

    bc.addEventListener('message', handler);

    setTimeout(() => {
      try { bc.removeEventListener('message', handler); } catch {}
      resolve(false);
    }, timeout);
  });

  try { bc.postMessage({ type: 'request-refresh' }); } catch (e) {}

  const localResult = await Promise.race([localPromise, new Promise((r) => setTimeout(() => r(null), 2500))]);
  if (localResult === true) return true;

  const otherResult = await waitPromise;
  return !!otherResult;
}

export async function logoutAndRedirect() {
  try {
    if (authApiUrl) {
      await fetch(`${authApiUrl}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (e) {
    // ignore
  }

  const from = encodeURIComponent(window.location.href);
  const target = authFrontendUrl ? `${authFrontendUrl}/?from=${from}` : `/?from=${from}`;
  window.location.replace(target);
}

export default {
  initTokenRefresher,
  requestRefresh,
  logoutAndRedirect,
};
