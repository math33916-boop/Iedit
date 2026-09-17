// ===== Public Phone Lookup (No personal name - only public telecom data) =====

const phoneInput = document.getElementById('phone-input');
const searchBtn = document.getElementById('search-btn');
const loadingEl = document.getElementById('loading');
const resultEl = document.getElementById('result');
const errorEl = document.getElementById('error');

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function setLoading(isLoading) {
  if (isLoading) {
    hide(resultEl);
    hide(errorEl);
    show(loadingEl);
    searchBtn.disabled = true;
  } else {
    hide(loadingEl);
    searchBtn.disabled = false;
  }
}

// ===== Main Lookup using Public APIs =====
async function lookupNumber() {
  const country = document.getElementById('country-code').value;
  let number = phoneInput.value.replace(/\D/g, '');

  if (number.length < 8 || number.length > 12) {
    showError("Please enter a valid phone number (8–12 digits).");
    return;
  }

  if (country === "+91" && number.length !== 10) {
    showError("Indian numbers should be 10 digits.");
    return;
  }

  const fullNumber = country + number;
  setLoading(true);

  try {
    const data = await fetchPublicPhoneInfo(fullNumber);
    displayResult(data, fullNumber);
  } catch (err) {
    console.error(err);
    const fallback = localFallback(number, country);
    displayResult(fallback, fullNumber);
  } finally {
    setLoading(false);
  }
}

async function fetchPublicPhoneInfo(e164Number) {
  const encoded = encodeURIComponent(e164Number);

  // 1. Primary free public API (no key)
  try {
    const res = await fetch(`https://phone-number-api.com/json/?number=${encoded}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' || json.numberValid) {
        return {
          name: json.carrier ? `${json.carrier} Number` : 'Valid Number',
          carrier: json.carrier || 'Unknown',
          location: json.city || json.regionName || json.region || '—',
          type: (json.numberType || 'Unknown').toString(),
          spam: json.isDisposible ? 'High (Disposable)' : 'Low',
          source: 'Public API (phone-number-api.com)',
          valid: json.numberValid !== false,
          country: json.countryName || json.country || '—',
          coords: (json.lat && json.lon) ? `${json.lat}, ${json.lon}` : '—'
        };
      }
    }
  } catch (e) {
    console.warn('Primary API failed', e);
  }

  // 2. Fallback public API
  try {
    const res2 = await fetch(`https://libphonenumberapi.com/api/phone-numbers/${encoded}`);
    if (res2.ok) {
      const json2 = await res2.json();
      return {
        name: json2.carrier ? `${json2.carrier} Number` : 'Valid Number',
        carrier: json2.carrier || 'Unknown',
        location: json2.geo_name || '—',
        type: json2.type || 'Unknown',
        spam: '—',
        source: 'Public API (libphonenumber)',
        valid: json2.is_valid,
        country: json2.country || '—',
        coords: '—'
      };
    }
  } catch (e) {
    console.warn('Secondary API failed', e);
  }

  throw new Error('All public APIs failed');
}

// Local offline fallback for India
function localFallback(number, country) {
  const carrierPrefixes = {
    "60": "Jio", "61": "Jio", "62": "Jio", "63": "Jio", "64": "Jio",
    "65": "Jio", "66": "Jio", "67": "Jio", "68": "Jio", "69": "Jio",
    "70": "Jio", "71": "Jio", "72": "Jio", "73": "Jio", "74": "Jio",
    "75": "Jio", "76": "Jio", "77": "Jio", "78": "Jio", "79": "Jio",
    "80": "Airtel", "81": "Airtel", "82": "Airtel", "83": "Airtel",
    "84": "Airtel", "85": "Airtel", "86": "Airtel", "87": "Airtel",
    "88": "Airtel", "89": "Airtel",
    "90": "Vi", "91": "Vi", "92": "Vi", "93": "Vi", "94": "Vi",
    "95": "Vi", "96": "Vi", "97": "Vi", "98": "Vi", "99": "Vi"
  };

  let carrier = 'Unknown';
  if (country === '+91' && number.length >= 2) {
    carrier = carrierPrefixes[number.substring(0, 2)] || 'Unknown Operator';
  }

  return {
    name: 'Number Info',
    carrier: carrier,
    location: '—',
    type: 'Mobile',
    spam: '—',
    source: 'Local Prefix Detection (Offline)',
    valid: true,
    country: country === '+91' ? 'India' : '—',
    coords: '—'
  };
}

function displayResult(data, fullNumber) {
  document.getElementById('result-name').textContent = data.name || 'Valid Number';
  document.getElementById('result-number').textContent = fullNumber;
  document.getElementById('result-carrier').textContent = data.carrier || '—';
  document.getElementById('result-type').textContent = data.type || '—';
  document.getElementById('result-country').textContent = data.country || '—';
  document.getElementById('result-location').textContent = data.location || '—';
  document.getElementById('result-coords').textContent = data.coords || '—';
  document.getElementById('result-spam').textContent = data.spam || '—';
  document.getElementById('result-source').textContent = data.source || 'Public API';

  const initial = (data.carrier || data.name || '?').charAt(0).toUpperCase();
  document.getElementById('result-avatar').textContent = initial;

  const badge = document.getElementById('result-badge');
  if (data.spam && data.spam.toLowerCase().includes('high')) {
    badge.textContent = 'Risk';
    badge.className = 'status-badge spam';
  } else {
    badge.textContent = data.valid === false ? 'Invalid' : 'Public';
    badge.className = 'status-badge';
  }

  hide(errorEl);
  show(resultEl);
}

function showError(msg) {
  document.getElementById('error-msg').textContent = msg;
  hide(resultEl);
  hide(loadingEl);
  show(errorEl);
}

// Events
phoneInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') lookupNumber();
});

phoneInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '');
});
