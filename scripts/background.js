//not using this file

/*
chrome.webNavigation.onHistoryStateUpdated.addListener( async (details) =>  {           
   
    const getCurrentTab = async () => {
        let queryOptions = { active: true, lastFocusedWindow: true };     
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
      }
    
    let tab = await getCurrentTab();

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: () => {} //this literally will execute an empty function in the current tab which seems to be enough to reload or reconnect the content-script
      });
});
*/


const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'

/*chrome.tabs.onCreated.addListener(function(tab) {
    console.log('New Tab Opened:', tab);
    sendMsg(tab.id);
}); */ //probably don't need this one

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("tab update: ", tab);
    console.log("url: ", tab.url);
    if (tab.url?.startsWith(extensions) || tab.url?.startsWith(webstore)) {
        //call content script to do the work
        console.log("should call content script");
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["scripts/content.js"],
        });
    }
});

/*chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log('Navigation in tab:', details.tabId);
    sendMsg(details.tabId);
}); */ //probably don't need this one as well


//function of sending msg to content.js to display the reading time
function sendMsg(tabId) {
    console.log("sendMsg function");
    /*chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ["scripts/content.js"],
    });*/
} //this func can or can't stay down?