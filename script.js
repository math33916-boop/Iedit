// ===== Navigation Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== Tool Modal =====
const toolInfo = {
  chat: {
    title: 'Chat Screenshot Editor',
    desc: 'Upload a chat screenshot and edit names, timestamps, messages, profile pictures and bubbles. WhatsApp-style templates included. Export as PNG/JPG. Full canvas-based editing can be connected here.'
  },
  screenshot: {
    title: 'Screenshot Editor',
    desc: 'Crop, resize, blur, pixelate, add text/stickers/shapes, highlight areas and apply filters. Perfect for cleaning screenshots before sharing.'
  },
  pdf: {
    title: 'PDF Editor',
    desc: 'Add text, images, signatures and shapes. Highlight, rearrange or delete pages, then download the edited PDF. Powered by PDF.js / pdf-lib when fully integrated.'
  },
  image: {
    title: 'Image Editor',
    desc: 'Background removal, text overlay, filters, compress, resize and format conversion (JPG ↔ PNG ↔ WebP).'
  },
  docs: {
    title: 'Document Tools',
    desc: 'Convert PDF ↔ JPG, merge PDFs, split pages, compress files. Batch-friendly utilities for everyday document work.'
  }
};

function openTool(type) {
  const info = toolInfo[type] || { title: 'Tool', desc: 'Coming soon.' };
  document.getElementById('modal-title').textContent = info.title;
  document.getElementById('modal-desc').textContent = info.desc;
  document.getElementById('tool-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('tool-modal').classList.add('hidden');
}

// Close modal on backdrop click
document.getElementById('tool-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'tool-modal') closeModal();
});

// ===== AI Chat =====
const aiMessages = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');

function addMessage(text, isUser = false) {
  const div = document.createElement('div');
  div.className = `ai-msg ${isUser ? 'user' : 'bot'}`;
  div.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function sendAiMessage() {
  const text = aiInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  aiInput.value = '';

  // Simulated intelligent response (replace with real xAI / Grok API call later)
  setTimeout(() => {
    const reply = generateAiReply(text);
    addMessage(reply);
  }, 600 + Math.random() * 400);
}

function generateAiReply(userText) {
  const lower = userText.toLowerCase();

  if (lower.includes('whatsapp') || lower.includes('chat') || lower.includes('message')) {
    return `Got it! For a WhatsApp-style chat edit I suggest:\n\n1. Change display name to the one you want\n2. Update timestamps to look natural\n3. Adjust bubble colors if needed\n4. Blur or remove any phone numbers\n\nWould you like me to generate a precise editing prompt for the Chat Screenshot Editor?`;
  }

  if (lower.includes('blur') || lower.includes('pixelate') || lower.includes('hide')) {
    return `To protect privacy:\n• Use the Screenshot Editor → Pixelate or Blur tool\n• Select the sensitive area (phone number, face, address)\n• Export as PNG for best quality\n\nTell me the exact area and I can refine the steps.`;
  }

  if (lower.includes('pdf') || lower.includes('signature') || lower.includes('page')) {
    return `For PDF work:\n• Upload the PDF in the PDF Editor\n• Use “Add Signature” or “Add Text”\n• Rearrange pages if needed\n• Download the final file\n\nDescribe the exact change (e.g. “add signature on page 2”) and I’ll give you a step-by-step prompt.`;
  }

  if (lower.includes('background') || lower.includes('remove bg')) {
    return `Background removal is available in the Image Editor.\n\nQuick tip: Upload a clear product/person photo → click “Remove Background” → optionally add a soft shadow or solid color.\n\nWant a ready-to-use prompt for an external AI background remover?`;
  }

  if (lower.includes('prompt') || lower.includes('help me write')) {
    return `Sure! Tell me the final result you want (e.g. “make this product photo look premium with soft lighting and white background”) and I’ll write a strong, detailed prompt for you.`;
  }

  // Default helpful reply
  return `Thanks for the details!\n\nI can help you:\n• Refine prompts for better AI results\n• Plan edits for chat screenshots, images or PDFs\n• Suggest the right tool inside I✨R-1\n\nJust describe the before → after you want, and I’ll guide you step by step.`;
}

function clearAiChat() {
  aiMessages.innerHTML = `
    <div class="ai-msg bot">
      <p>Hi! I’m the I✨R-1 AI Assistant.<br>
      Describe what you want to edit or the prompt you need. I can help refine your request and suggest edits for screenshots, chats, images or PDFs.</p>
    </div>
  `;
}

// Enter key to send
aiInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendAiMessage();
  }
});

// ===== Prompt Generator =====
function generatePrompt() {
  const goal = document.getElementById('prompt-goal').value.trim();
  const output = document.getElementById('generated-prompt');

  if (!goal) {
    output.classList.remove('hidden');
    output.textContent = 'Please describe what you want the AI to do first.';
    return;
  }

  // Simple but useful prompt engineering
  const prompt = `You are an expert image and document editor.

Task: ${goal}

Requirements:
- Keep the result clean, professional and natural-looking
- Preserve important details unless asked to remove them
- Use high quality and realistic lighting/colors
- If text is involved, make it sharp and correctly spelled
- Output only the final edited result or clear step-by-step instructions

Additional context: This will be used inside the I✨R-1 editor suite (chat screenshots, images, PDFs).`;

  output.classList.remove('hidden');
  output.textContent = prompt;
}

// ===== File Drop / Preview =====
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const previewArea = document.getElementById('preview-area');
const previewImg = document.getElementById('preview-img');

dropZone?.addEventListener('click', () => fileInput.click());

dropZone?.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone?.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone?.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput?.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      dropZone.classList.add('hidden');
      previewArea.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  } else if (file.type === 'application/pdf') {
    alert('PDF preview is ready for integration with PDF.js. For now, use the PDF Editor button above.');
  } else {
    alert('Please upload an image or PDF.');
  }
}

function resetWorkspace() {
  previewArea.classList.add('hidden');
  dropZone.classList.remove('hidden');
  previewImg.src = '';
  fileInput.value = '';
}

function downloadResult() {
  if (!previewImg.src) return;
  const a = document.createElement('a');
  a.href = previewImg.src;
  a.download = 'ir1-edited-image.png';
  a.click();
}

// ===== Smooth scroll for older browsers =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
