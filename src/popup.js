console.log("%cpopup.js loaded", "font-weight: bold");

document.addEventListener("DOMContentLoaded", function () {
	//blacklist btn
	const button = document.querySelector(".blacklistButton");
	button.addEventListener("click", function () {
		console.log("blacklist button clicked");
		//alert("button clicked");

		//get the input from popup.html and clear it
		const input = document.getElementsByClassName("blacklistInput")[0];
		let blacklistPattern = input.value;
		console.log(`blacklistPattern: ${blacklistPattern}`);
		input.value = "";


		saveBlacklistPattern(blacklistPattern);
	});

	/*
	//show the synced array (handle the test btn)
	const testBtn = document.querySelector(".testButton");
	testBtn.addEventListener("click", function () {
		console.log("test button clicked");
		chrome.storage.sync.get(["blacklistArr"]).then((result) => {
			if (result.blacklistArr) {
				console.log("blacklistArr found");
				const numberedList = result.blacklistArr.map((item, index) => `${index + 1}. ${item}`);
				alert(numberedList.join('\n'));
			} else {
				console.log("blacklistArr not found");
			}
		});
	});
	*/

	/*
	//clear all stored item
	const clearBtn = document.querySelector(".clearButton");
	clearBtn.addEventListener("click", function () {
		console.log("clear button clicked");
		chrome.storage.sync.clear(() => {
			console.log("storage cleared");
		})
	});
	*/

	//handle for the manageBlacklist btn
	const manageBtn = document.querySelector(".manageBlacklist");
	manageBtn.addEventListener("click", function () {
		console.log("manage button clicked");
		chrome.tabs.create({ url: "option.html" });
	});

	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		console.log(tabs);
	});

	//set input's default value to current tab's url
	setInputDefaultValue();

	//update the status of blacklist when popup is opened
	updateStatus();
	//update the status and refresh current tab when storage.sync on changed
	handleStorageChange();
});

//function to save the blacklist pattern and msg content script, para blacklistPattern should be a regex
function saveBlacklistPattern(blacklistPattern) {
	//check if pattern is valid or not
	if (!blacklistPattern) {
		console.log("invalid blacklist pattern");
		return;
	}
	
	console.log("saveBlacklistPattern called");

	// get the array of blacklist urls, modify and save it
	let newArr = []
	chrome.storage.sync.get(["blacklistArr"]).then((result) => {
		if (result.blacklistArr){	
			newArr = result.blacklistArr;
		} 
		newArr.push(blacklistPattern)

		//save the modified array	
		chrome.storage.sync.set({"blacklistArr": newArr});
	});
}


//function to update the status of isCurrentWebisteEnabled (element id enableOrNot)
async function updateStatus() {
	//init and get the blacklistArr
	let res = await chrome.storage.sync.get(["blacklistArr"]);
	const enableOrNot = document.getElementById("enableOrNot");
	enableOrNot.style.fontWeight = "bold";
	//early return if blacklistArr not found
	if (!res.blacklistArr) {
		console.log("blacklistArr not found");
		enableOrNot.textContent = "enabled";
		enableOrNot.style.color = "green";
		return;
	}

	const blacklistArr = res.blacklistArr || [];
	//get currentUrl by chrmoe.tabs.query
	let activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
	console.log(activeTabs);
	let currentUrl = activeTabs[0].url;
	console.log(`current url: ${currentUrl}`);

	//check if currentUrl is in blacklistArr
	let isCurrentWebisteDisabled = false;

	for (const pattern of blacklistArr) {
		console.log(`pattern: ${pattern}`);
		let regex = new RegExp(pattern);
		if (currentUrl.match(regex)) {
			isCurrentWebisteDisabled = true;
			break;
		}
	}
	console.log(`isCurrentWebisteDisabled: ${isCurrentWebisteDisabled}`);
	
	//update the status by modifying the html element
	enableOrNot.textContent = isCurrentWebisteDisabled ? "disabled" : "enabled";
	enableOrNot.style.color = isCurrentWebisteDisabled ? "red" : "green";
}

function handleStorageChange() {
	//add event listener
	chrome.storage.onChanged.addListener(function (changes, areaName) {
		//check if we need to concern this change
		if (!(areaName === "sync" && changes.blacklistArr)) {
			console.log("not concerned change");
			return;
		}

		updateStatus();

		//refresh the current tab
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.reload(tabs[0].id); //?
            }
        });

	});
}

async function setInputDefaultValue(){
	//get current tab's url
	let activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
	let currentUrl = activeTabs[0].url;
	console.log(`current url: ${currentUrl}`);

	//clean the url to get only the schema and host
	const urlObj = new URL(currentUrl);
    const cleanedUrl = `${urlObj.protocol}//${urlObj.host}/*`;

	//get the input elment and modify its value
	const input = document.getElementsByClassName("blacklistInput")[0];
	input.value = cleanedUrl;
}


/* NO LONGER NEEDED AS REALIZED THAT MESSAGING IS NOT NEEDED, CAN GET CURRENT TAB'S URL IN POPUP.JS
function updateStatusOnContentScriptMsg() {
	chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
		if (message.message === "blacklist-status") {
			console.log(`blacklist-status message received: ${message.isCurrentTabBlacklistedVar}`);
			//TODO the rest
		}
	});
}

function msgContentScriptToGetStatus() {
	console.log("msgContentScriptToGetStatus called");
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ message: "get-blacklist-status" }
		);
	});
}
*/