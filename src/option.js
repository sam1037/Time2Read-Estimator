document.addEventListener("DOMContentLoaded", function () {
    const tableTbody = document.getElementById("option_tbody");
    const blacklistInput = document.getElementById("blacklistInput");
    const addBlacklistButton = document.getElementById("addBlacklistButton");

    // Function to render the blacklist table
    async function renderBlacklistTable() {
        // Clear existing rows
        tableTbody.innerHTML = "";

        // Get the blacklist array from storage
        let res = await chrome.storage.sync.get(["blacklistArr"]);
        const blacklistArr = res.blacklistArr || [];

        // Add rows for each blacklist pattern
        blacklistArr.forEach((pattern, index) => {
            const row = document.createElement("tr");

            const patternCell = document.createElement("td");
            patternCell.textContent = pattern;
            row.appendChild(patternCell);

            const removeCell = document.createElement("td");
            const removeButton = document.createElement("input");
            removeButton.type = "button";
            removeButton.className = "remove";
            removeButton.value = "✖";
            removeButton.addEventListener("click", () => {
                removeBlacklistPattern(index);
            });
            removeCell.appendChild(removeButton);
            row.appendChild(removeCell);

            tableTbody.appendChild(row);
        });
    }

    // Function to add a new blacklist pattern
    async function addBlacklistPattern(pattern) {
        let res = await chrome.storage.sync.get(["blacklistArr"]);
        const blacklistArr = res.blacklistArr || [];
        blacklistArr.push(pattern);
        await chrome.storage.sync.set({ blacklistArr });
    }

    // Function to remove a blacklist pattern
    async function removeBlacklistPattern(index) {
        let res = await chrome.storage.sync.get(["blacklistArr"]);
        const blacklistArr = res.blacklistArr || [];
        blacklistArr.splice(index, 1);
        await chrome.storage.sync.set({ blacklistArr });
    }

    // Event listener for adding a new blacklist pattern
    addBlacklistButton.addEventListener("click", function () {
        const pattern = blacklistInput.value.trim();
        if (pattern) {
            addBlacklistPattern(pattern);
            blacklistInput.value = "";
        }
    });

    // Event listener for storage changes, which will re-render the blacklist table
    chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (areaName === "sync" && changes.blacklistArr) {
            renderBlacklistTable();
        }
    });

    // Load and render the blacklist table on page load
    renderBlacklistTable();
});