(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr Script',
        email: 'drscript@example.com',
        password: 'Test1234',
        role: 'doctor',
        specialty: 'Geriatrics',
        licenseNumber: 'LIC-SCRIPT-001'
      })
    });

    const text = await res.text();
    console.log('STATUS:', res.status);
    console.log('BODY:', text);
  } catch (err) {
    console.error('REQUEST ERROR:', err);
  }
})();
