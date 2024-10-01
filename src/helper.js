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

export function isCurrentTabBlacklisted(){
  //get current tab's url
  const currentUrl = window.location.href;
  console.log(`current url: ${currentUrl}`);
  //check if current tab's url is within the blacklist
  chrome.storage.sync.get(["blacklistArr"]).then((result) => {
    if (result.blacklistArr) {
      const arr = result.blacklistArr;
      console.log(arr);
      //for now, we just do an exact match TODO improve later
      if (arr.includes(currentUrl)) {
        console.log("should get here");
        return true;
      }
    }
    console.log("should not get here");
    return false;
  });
  
}