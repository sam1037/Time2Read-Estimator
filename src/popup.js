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
		alert(`blacklistPattern: ${blacklistPattern}`);

		saveBlacklistPattern(blacklistPattern);
	});
});

//function to save the blacklist pattern and msg content script, para blacklistPattern should be a regex
function saveBlacklistPattern(blacklistPattern) {
	console.log("saveBlacklistPattern called");
	//TODO
}