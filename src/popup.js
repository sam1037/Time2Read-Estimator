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

	//show the synced array
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

	//clear all stored item
	const clearBtn = document.querySelector(".clearButton");
	clearBtn.addEventListener("click", function () {
		console.log("clear button clicked");
		chrome.storage.sync.clear(() => {
			console.log("storage cleared");
		})
	});
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