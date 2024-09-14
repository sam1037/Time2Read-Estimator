const camelCase = require('camelcase');

chrome.runtime.onInstalled.addListener(() => {
	console.log("on installed event happened");
  console.log(camelCase.default("foo-bar"));
});

//listen for command of toggling the estimation
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

//toggle estimation by sending a message to the content script, also toggle the extension badge text
function toggle_estimation() {
  console.log("toggle_estimation() running");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    sendMsgGivenTabID(tabs[0].id);
  });
}

//this is some refactoring that could be done better
//send message to the content script to toggle the estimation display, and toggle the badge text
function sendMsgGivenTabID(tabID){
  //toggle the estimation display by sending a message 
  chrome.tabs.sendMessage(
    tabID, 
    {message: "toggle-estimation", currentTabID: tabID }
  );
}

function tester() {
  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    // tabs is an array of Tab objects representing the tabs in the current window
    console.log('Tabs in the current window:', tabs);
  });
}