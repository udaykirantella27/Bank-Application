const url = 'https://gpanclnjulgzgjvjpbyr.supabase.co/rest/v1/loan_applications';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYW5jbG5qdWxnemdqdmpwYnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1Mzc1NTMsImV4cCI6MjA4OTExMzU1M30.PVw3OEoDQwyx2HX6Vbk1ZOIknt8J81lnsa8Eyw7m-u0';

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    loan_amount: 1000,
    loan_purpose: 'home',
    employment_type: 'salaried',
    monthly_salary: 50000
  })
}).then(res => res.json()).then(console.log).catch(console.error);
