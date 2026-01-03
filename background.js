// List of domains to block (without www or protocol)
const blockedSites = [
  'youtube.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'reddit.com',
  'netflix.com',
  'tiktok.com'
];

// Get the URL of our blocked.html page
const blockedPageUrl = chrome.runtime.getURL('blocked.html');

// Function to check if a URL should be blocked
function shouldBlockUrl(urlString) {
  try {
    if (!urlString) return false;
    const url = new URL(urlString);
    return blockedSites.some(site =>
      url.hostname === site ||
      url.hostname.endsWith('.' + site)
    );
  } catch (e) {
    console.error('Error checking URL:', e);
    return false;
  }
}

// Track active tabs on the blocked page
const activeBlockedTabs = {};

// Function to update avoided time in storage
function updateAvoidedTime(durationMs) {
  const today = new Date().toISOString().split('T')[0];
  chrome.storage.local.get(['avoidedTime', 'lastResetDate'], (result) => {
    let totalTime = result.avoidedTime || 0;
    const lastResetDate = result.lastResetDate;

    if (lastResetDate !== today) {
      totalTime = 0;
    }

    totalTime += durationMs;
    chrome.storage.local.set({
      avoidedTime: totalTime,
      lastResetDate: today
    });
  });
}

// Block navigation to blocked sites
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  // Don't block iframes or other navigation types
  if (details.frameId !== 0) return;

  chrome.storage.local.get(["blockingEnabled"], (result) => {
    const blockingEnabled = result.blockingEnabled ?? true; // Default ON
    if (!blockingEnabled) return; // If toggle is OFF, do nothing

    // Don't block if it's our own blocked page to prevent redirect loops
    if (details.url === blockedPageUrl) return;

    if (shouldBlockUrl(details.url)) {
      // Store the original URL in session storage to allow going back
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: (url) => {
          sessionStorage.setItem('lastBlockedUrl', url);
        },
        args: [details.url]
      });

      // Cancel the current navigation and redirect to blocked page
      chrome.tabs.update(details.tabId, { url: blockedPageUrl });
    }
  });
}, { urls: ["<all_urls>"] });

// Track time spent on blocked page and block direct URL entry
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Handle blocking
  if (changeInfo.status === 'loading' && changeInfo.url) {
    chrome.storage.local.get(["blockingEnabled"], (result) => {
      const blockingEnabled = result.blockingEnabled ?? true;
      if (!blockingEnabled) return;

      if (shouldBlockUrl(changeInfo.url) && changeInfo.url !== blockedPageUrl) {
        chrome.tabs.update(tabId, { url: blockedPageUrl });
      }
    });
  }

  // Handle time tracking
  if (changeInfo.status === 'complete') {
    if (tab.url === blockedPageUrl) {
      // Only start tracking if not already tracking this tab
      if (!activeBlockedTabs[tabId]) {
        activeBlockedTabs[tabId] = Date.now();
      }
    } else if (activeBlockedTabs[tabId]) {
      const duration = Date.now() - activeBlockedTabs[tabId];
      updateAvoidedTime(duration);
      delete activeBlockedTabs[tabId];
    }
  }
});

// Handle tab removal for time tracking
chrome.tabs.onRemoved.addListener((tabId) => {
  if (activeBlockedTabs[tabId]) {
    const duration = Date.now() - activeBlockedTabs[tabId];
    updateAvoidedTime(duration);
    delete activeBlockedTabs[tabId];
  }
});
