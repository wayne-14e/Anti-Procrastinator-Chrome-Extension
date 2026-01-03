# 🚫 Anti-Procrastinator — Behavior-Aware Chrome Extension

Anti-Procrastinator is a Chrome extension designed to reduce digital distraction by blocking selected websites and actively redirecting users toward productive work.

Instead of simply blocking access, the extension uses **timers, goals, and intentional redirection** to help users stay focused.

---

## ✨ Features

### 🔒 Website Blocking
- Blocks user-defined distracting websites (e.g. YouTube, Instagram).
- Triggers a custom block page instead of allowing access.

### ⏱️ Visible Focus Timer
- A timer is displayed every time a blocked page is opened.
- Helps users become aware of how much time they are saving by avoiding distractions.

### 🎯 Goal Reminder
- Users can set a personal focus goal (e.g. *“Prepare for IELTS Band 8”*).
- The goal is displayed prominently on the block page to reinforce motivation at the moment of temptation.

### 🔁 Return to Work Button
- A **“Return to Work”** button redirects the user to a productive website.
- Default redirect target: **Notion**.

### ⚙️ Custom Productive Sites
- Users can add multiple productive websites in the popup.
- One site can be selected as the current redirect target.
- Fully customizable and stored locally.

### 🔐 Privacy-First Design
- No analytics, tracking, or external servers.
- All data is stored locally using `chrome.storage`.

---

## 🧠 Design Philosophy

The extension is built around the idea that **awareness + intention** is more effective than pure restriction.

Key principles:
- Minimal UI to avoid cognitive overload
- Immediate redirection to productive work
- Motivation at the exact moment distraction occurs
- Full user control over goals and redirect destinations

---

## 🛠️ Tech Stack

- JavaScript
- Chrome Extension APIs
- HTML & CSS
- `chrome.storage.local` for state persistence

---

## 📦 Installation (Load as Unpacked Extension)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/anti-procrastinator.git
2. Open Google Chrome and go to: `chrome://extensions/`
3. Enable *Developer mode* using the toggle in the top-right corner.
4. Click *Load unpacked*.
5. Select the project folder.
6. The extension will now appear in your Chrome toolbar.
7. Don't forget to pin it!

---

## ⚙️ How to Use

1. Open the extension popup from the Chrome toolbar.
2. Add websites you want to block.
3. Add productive websites (for example: Notion, Google Docs).
4. Select one productive website as the current redirect target.
5. Set your current focus goal.
6. Try opening a blocked website to see the focus page with the timer, goal reminder, and return-to-work button.
