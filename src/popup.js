console.log("%cpopup.js loaded", "font-weight: bold");

document.addEventListener("DOMContentLoaded", function () {
	//get the button from popup.html
	const button = document.getElementById("toggle-extension");
	button.addEventListener("click", function () {
		console.log("button clicked");
		alert("button clicked");
	});

	chrome.storage.sync.get(["test"]).then((result) => {
		console.log("Value is " + result.key);
	});

});