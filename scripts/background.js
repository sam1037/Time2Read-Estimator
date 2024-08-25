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

//function to toggle estimation


