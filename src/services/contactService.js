const CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/rosiesuchoi@gmail.com';

/**
 * Submit the contact form payload.
 * Resolves to { ok: true } on success, { ok: false, reason: 'server' | 'network' } otherwise.
 */
export async function sendContactMessage(data) {
  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.ok ? { ok: true } : { ok: false, reason: 'server' };
  } catch (err) {
    return { ok: false, reason: 'network' };
  }
}
