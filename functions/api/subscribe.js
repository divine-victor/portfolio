export async function onRequestPost(context) {
  try {
    // 1. Unpack the request from context (The Form Data)
    const body = await context.request.json();
    
    const email = (body.email || '').trim().toLowerCase();
    const name = (body.name || '').trim();
    const project = (body.project || '').trim();
    const message = (body.message || '').trim();

    // 2. Validate the data
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Valid email required' }, 400);
    }
    if (!name || !project || !message) {
      return json({ error: 'All fields are required' }, 400);
    }

    // Split the name into First and Last for Brevo
    const [firstName, ...rest] = name.split(/\s+/);
    const lastName = rest.join(' ');

    // 3. Call Brevo using the Secret from context.env
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': context.env.BREVO_API_KEY, // <--- Pulled from Cloudflare Secrets
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          PROJECT_TYPE: project,
          MESSAGE: message,
          SOURCE: 'portfolio-contact'
        },
        listIds: [Number(context.env.BREVO_LIST_ID)], // <--- Pulled from Cloudflare Variables
        updateEnabled: true // If the contact exists, it updates them instead of throwing an error
      })
    });

    // 4. Handle Brevo's response
    if (!brevoRes.ok && brevoRes.status !== 204) {
      console.error('Brevo error:', await brevoRes.text());
      return json({ error: 'Brevo subscription failed' }, 502);
    }

    // 5. Success! Tell the frontend
    return json({ ok: true }, 200);

  } catch (err) {
    return json({ error: 'Invalid request payload' }, 400);
  }
}

// Helper function for clean JSON responses
function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
}
