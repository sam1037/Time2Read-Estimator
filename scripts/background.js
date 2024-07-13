chrome.runtime.onInstalled.addListener(() => {
	console.log("on installed event happened");
  chrome.action.setBadgeText({
    text: "ON",
  });
});