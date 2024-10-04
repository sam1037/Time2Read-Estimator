//determine if the text is chinese of not
export function isChinese() {
  var lang = document.documentElement.getAttribute('lang');
  console.log(`lang attribute: ${lang}`);
  if (lang && lang.startsWith('zh')){
    return true;
  }
  return false;
}

// Function to check if an element is visible
export function isVisible(elem) {
  return !(window.getComputedStyle(elem).display === 'none' || window.getComputedStyle(elem).visibility === 'hidden');
}

//return the filtered article text 
//TODO: some room of improvements
export function getFilteredArticleText(article) {
  //filter scripts
  article.querySelectorAll('script').forEach(script => script.remove());
  
  //filter hidden elements
  article.querySelectorAll('*').forEach(element => {
    if (!isVisible(element)) {
      element.remove();
    }
  });

  return article.textContent;
}

export async function isCurrentTabBlacklisted(){
  //get current tab's url
  const currentUrl = window.location.href;
  console.log(`current url: ${currentUrl}`);
  
  //return a promise abt if the current tab is in the blacklist or not
  let res = await chrome.storage.sync.get(["blacklistArr"]);
  if (res.blacklistArr) {
    const arr = res.blacklistArr;
    console.log(arr);
    /*
    if (arr.includes(currentUrl)) {
      console.log("should get here (from func isCurrentTabBlacklisted())");
      return true;
    }
    */
    //regex check if pattern match
    for (let i = 0; i < arr.length; i++) {
      const regex = new RegExp(arr[i]);
      if (currentUrl.match(regex)) {
        console.log("regex match! (from func isCurrentTabBlacklisted())");
        return true;
      }
    }
  }

  return false;
}

export async function __isCurrentTabBlacklisted() {
  try {
    // Get current tab's URL
    const currentUrl = window.location.href;
    console.log(`current url: ${currentUrl}`);

    // Return a promise about if the current tab is in the blacklist or not
    let res = await chrome.storage.sync.get(["blacklistArr"]);
    if (res.blacklistArr) {
      const arr = res.blacklistArr;
      console.log(arr);

      // Regex check if pattern matches
      for (let i = 0; i < arr.length; i++) {
        const regex = new RegExp(arr[i]);
        if (currentUrl.match(regex)) {
          console.log("regex match! (from func isCurrentTabBlacklisted())");
          return true;
        }
      }
    }
  } catch (error) {
    console.error("Error in isCurrentTabBlacklisted:", error);
    if (error.message.includes("Extension context invalidated")) {
      // Handle the specific error
      console.error("Extension context invalidated. Please reload the extension.");
    }
  }

  return false;
}