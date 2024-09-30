console.log("%cpopup.js loaded", "font-weight: bold");

document.addEventListener("DOMContentLoaded", function () {
	//get the button from popup.html
	const button = document.querySelector(".blacklistButton");
	button.addEventListener("click", function () {
		console.log("blacklist button clicked");
		alert("button clicked");

		//get the input from popup.html
		const input = document.getElementsByClassName("blacklistInput")[0];
		let blacklistPattern = input.value;
		console.log(`blacklistPattern: ${blacklistPattern}`);
		//alert(`blacklistPattern: ${blacklistPattern}`);

		saveBlacklistPattern(blacklistPattern);
	});

	const testBtn = document.querySelector(".testButton");
	testBtn.addEventListener("click", function () {
		console.log("test button clicked");
		chrome.storage.sync.get(["testKey"]).then((result) => {
			if (result.testKey) {
				console.log("testKey found");
				console.log(result.testKey);
			} else {
				console.log("testKey not found");
			}
		});
	});

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
	console.log("saveBlacklistPattern called");

	chrome.storage.sync.set({ "testKey": blacklistPattern }).then(() => {
		console.log("Value is set");
	});
	  
	  
}