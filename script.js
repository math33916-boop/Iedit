// ===== Mock Database (Demo only) =====
const mockData = {
  "9876543210": {
    name: "Rahul Sharma",
    carrier: "Jio",
    location: "Delhi NCR",
    type: "Mobile",
    spam: "Low",
    source: "Demo Database"
  },
  "9123456789": {
    name: "Priya Patel",
    carrier: "Airtel",
    location: "Mumbai, Maharashtra",
    type: "Mobile",
    spam: "Low",
    source: "Demo Database"
  },
  "9988776655": {
    name: "Unknown / Business",
    carrier: "Vi (Vodafone Idea)",
    location: "Bangalore, Karnataka",
    type: "Mobile",
    spam: "Medium",
    source: "Demo Database"
  },
  "9000012345": {
    name: "Spam Likely",
    carrier: "BSNL",
    location: "Kolkata, West Bengal",
    type: "Mobile",
    spam: "High",
    source: "Demo Database"
  }
};

// Carrier prefix map (simplified public knowledge)
const carrierPrefixes = {
  "70": "Jio", "71": "Jio", "72": "Jio", "73": "Jio", "74": "Jio",
  "75": "Jio", "76": "Jio", "77": "Jio", "78": "Jio", "79": "Jio",
  "80": "Airtel", "81": "Airtel", "82": "Airtel", "83": "Airtel",
  "84": "Airtel", "85": "Airtel", "86": "Airtel", "87": "Airtel",
  "88": "Airtel", "89": "Airtel",
  "90": "Vi", "91": "Vi", "92": "Vi", "93": "Vi", "94": "Vi",
  "95": "Vi", "96": "Vi", "97": "Vi", "98": "Vi", "99": "Vi",
  "60": "Jio", "61": "Jio", "62": "Jio", "63": "Jio",
  "64": "Jio", "65": "Jio", "66": "Jio", "67": "Jio", "68": "Jio", "69": "Jio"
};

function getCarrierFromNumber(num) {
  const prefix = num.substring(0, 2);
  return carrierPrefixes[prefix] || "Unknown Operator";
}

function getRandomLocation() {
  const locations = [
    "Delhi NCR", "Mumbai, Maharashtra", "Bangalore, Karnataka",
    "Hyderabad, Telangana", "Chennai, Tamil Nadu", "Kolkata, West Bengal",
    "Pune, Maharashtra", "Ahmedabad, Gujarat", "Jaipur, Rajasthan",
    "Lucknow, Uttar Pradesh", "Chandigarh", "Indore, Madhya Pradesh"
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

// ===== UI Helpers =====
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

// ===== Main Lookup =====
function lookupNumber() {
  const country = document.getElementById('country-code').value;
  let number = phoneInput.value.replace(/\D/g, ''); // only digits

  if (number.length < 8 || number.length > 12) {
    showError("Please enter a valid phone number (8–12 digits).");
    return;
  }

  // For India, expect 10 digits
  if (country === "+91" && number.length !== 10) {
    showError("Indian numbers should be 10 digits.");
    return;
  }

  setLoading(true);

  // Simulate network delay
  setTimeout(() => {
    const data = generateResult(number, country);
    displayResult(data, country + number);
    setLoading(false);
  }, 1200 + Math.random() * 800);
}

function generateResult(number, country) {
  // Check mock database first
  if (mockData[number]) {
    return { ...mockData[number], isDemo: true };
  }

  // Generate realistic looking demo data
  const carrier = country === "+91" ? getCarrierFromNumber(number) : "International";
  const location = country === "+91" ? getRandomLocation() : "Unknown Region";
  
  // Random name style for demo
  const firstNames = ["Amit", "Sneha", "Vikram", "Ananya", "Rohit", "Neha", "Karan", "Pooja", "Unknown"];
  const lastNames = ["Kumar", "Singh", "Gupta", "Verma", "Shah", "Reddy", "Khan", ""];
  const name = Math.random() > 0.3 
    ? firstNames[Math.floor(Math.random()*firstNames.length)] + " " + lastNames[Math.floor(Math.random()*lastNames.length)]
    : "Not Found in Demo DB";

  const spamLevels = ["Low", "Low", "Low", "Medium", "High"];
  const spam = spamLevels[Math.floor(Math.random() * spamLevels.length)];

  return {
    name: name.trim(),
    carrier,
    location,
    type: "Mobile",
    spam,
    source: "Demo Mode (Mock Data)",
    isDemo: true
  };
}

function displayResult(data, fullNumber) {
  document.getElementById('result-name').textContent = data.name;
  document.getElementById('result-number').textContent = fullNumber;
  document.getElementById('result-carrier').textContent = data.carrier;
  document.getElementById('result-location').textContent = data.location;
  document.getElementById('result-type').textContent = data.type;
  document.getElementById('result-spam').textContent = data.spam;
  document.getElementById('result-source').textContent = data.source;

  // Avatar initial
  const initial = data.name.charAt(0).toUpperCase() || "?";
  document.getElementById('result-avatar').textContent = initial;

  // Badge
  const badge = document.getElementById('result-badge');
  badge.textContent = data.spam === "High" ? "Spam Risk" : "Demo";
  badge.className = "status-badge" + (data.spam === "High" ? " spam" : "");

  hide(errorEl);
  show(resultEl);
}

function showError(msg) {
  document.getElementById('error-msg').textContent = msg;
  hide(resultEl);
  hide(loadingEl);
  show(errorEl);
}

// Enter key support
phoneInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') lookupNumber();
});

// Only allow numbers
phoneInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '');
});
