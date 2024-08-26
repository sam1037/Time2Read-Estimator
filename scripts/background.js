//wtf is this about?
chrome.runtime.onInstalled.addListener(() => {
	console.log("on installed event happened");
  //what is this line abt?
  chrome.action.setBadgeText({
    text: "ON",
  });
});

chrome.commands.onCommand.addListener(function (command) {
  switch (command) {
    case "toggle-estimation":
      console.log("toggle estimation function called");
      toggle_estimation();
      break;
    default:
      console.log(`Command ${command} not found`);
  }
});

//toggle estimation by sending a message to the content script
function toggle_estimation() {
  console.log("toggle_estimation() running");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "toggle-estimation" });
  });
}

function tester() {
  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    // tabs is an array of Tab objects representing the tabs in the current window
    alert('Tabs in the current window:', tabs);
  });
}


