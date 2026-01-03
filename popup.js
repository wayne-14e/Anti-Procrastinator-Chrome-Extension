const toggle = document.getElementById("toggle-blocking");
const statusText = document.getElementById("status-text");
const siteInput = document.getElementById("site-input");
const addSiteBtn = document.getElementById("add-site-btn");
const siteList = document.getElementById("site-list");
const goalInput = document.getElementById("goal-input");

let productiveSites = [];
let selectedSiteUrl = null;

// Function to update the status text and style
function updateStatus(isEnabled) {
  if (isEnabled) {
    statusText.textContent = "Active";
    statusText.className = "active";
  } else {
    statusText.textContent = "Inactive";
    statusText.className = "inactive";
  }
}

// Function to render the site list
function renderSiteList() {
  siteList.innerHTML = "";

  if (productiveSites.length === 0) {
    siteList.innerHTML = '<li class="empty-msg">No productive sites added yet.</li>';
    return;
  }

  productiveSites.forEach((site, index) => {
    const li = document.createElement("li");
    li.className = `site-item ${site === selectedSiteUrl ? "selected" : ""}`;

    li.innerHTML = `
      <div class="site-info">
        <span class="site-url">${site}</span>
      </div>
      <button class="delete-btn" data-index="${index}">×</button>
    `;

    li.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      selectSite(site);
    });

    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteSite(index);
    });

    siteList.appendChild(li);
  });
}

// Function to add a site
function addSite() {
  let url = siteInput.value.trim();
  if (!url) return;

  // Basic URL normalization
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  if (!productiveSites.includes(url)) {
    productiveSites.push(url);
    if (!selectedSiteUrl) {
      selectedSiteUrl = url;
    }
    saveData();
    renderSiteList();
  }
  siteInput.value = "";
}

// Function to delete a site
function deleteSite(index) {
  const deletedSite = productiveSites[index];
  productiveSites.splice(index, 1);

  if (selectedSiteUrl === deletedSite) {
    selectedSiteUrl = productiveSites.length > 0 ? productiveSites[0] : null;
  }

  saveData();
  renderSiteList();
}

// Function to select a site
function selectSite(url) {
  selectedSiteUrl = url;
  saveData();
  renderSiteList();
}

// Function to save data to storage
function saveData() {
  chrome.storage.local.set({
    productiveSites: productiveSites,
    selectedSiteUrl: selectedSiteUrl,
    userGoal: goalInput.value.trim()
  });
}

// Load state from storage and update UI
chrome.storage.local.get(["blockingEnabled", "productiveSites", "selectedSiteUrl", "userGoal"], (result) => {
  const isEnabled = result.blockingEnabled ?? true; // Default ON
  toggle.checked = isEnabled;
  updateStatus(isEnabled);

  productiveSites = result.productiveSites || [];
  selectedSiteUrl = result.selectedSiteUrl || (productiveSites.length > 0 ? productiveSites[0] : null);
  goalInput.value = result.userGoal || "";

  renderSiteList();

  // Add animation class to show the UI is ready
  document.body.classList.add('loaded');
});

// Save new toggle state when user clicks checkbox
toggle.addEventListener("change", () => {
  const isEnabled = toggle.checked;
  chrome.storage.local.set({ blockingEnabled: isEnabled }, () => {
    updateStatus(isEnabled);
    console.log("Blocking set to", isEnabled);

    // Send message to background script to update the blocking state
    chrome.runtime.sendMessage({ action: "updateBlockingState", enabled: isEnabled });
  });
});

// Add site button listener
addSiteBtn.addEventListener("click", addSite);

// Enter key listener for input
siteInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addSite();
  }
});

// Goal input listener
goalInput.addEventListener("input", () => {
  saveData();
});
