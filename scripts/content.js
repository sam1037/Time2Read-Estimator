//import camelCase from '../node_modules/camelCase';

const enReadingSpeed = 200;
const chiReadingSpeed = 250;

console.log("content script running");

//determine if the text is chinese of not
function isChinese() {
  var lang = document.documentElement.getAttribute('lang');
  console.log(`lang: ${lang}`);
  if (lang && lang.startsWith('zh')){
    return true;
  }
  return false;
}

// Function to check if an element is visible
function isVisible(elem) {
  return !(window.getComputedStyle(elem).display === 'none' || window.getComputedStyle(elem).visibility === 'hidden');
}

//return the filtered article text
function getFilteredArticleText(article) {
  //filter scripts
  article.querySelectorAll('script').forEach(script => script.remove());
  
  //filter hidden elements
  article.querySelectorAll('*').forEach(element => {
    if (!isVisible(element)) {
      element.remove();
    }
  });

  return article.textContent;

  /*var textNodes = articleElement.querySelectorAll('*:not(script):not(noscript):not(style)');
  var articleText = Array.from(textNodes).filter(isVisible).map(node => node.textContent).join(' ');
  return articleText;
  */
}


//the heavy work
function estimateTime() {
  console.log('estimateTime() running');

  //get the filtered article text
  const articleElement = document.querySelector('article');
  let text = getFilteredArticleText(articleElement);

  //change style of the article for debug
  articleElement.style.outline = "3px solid red";

  //estimate the reading time
  if (isChinese()) {
    text = text.replace(/\s+/g, ""); //filter out white space, do i need to do the same for eng?
    console.log(`filtered chin text: \n${text}`);
    var wordCount = text.length;
    var readingTime = Math.ceil(wordCount / chiReadingSpeed);
  }
  else {
    const wordMatchRegExp = /[^\s]+/g; // Regular expression
    const words = text.matchAll(wordMatchRegExp);
    console.log(`words: \n${words}`);
    var wordCount = [...words].length;
    var readingTime = Math.ceil(wordCount / enReadingSpeed);
  }

  //create the badge
  const badge = document.createElement("p");
  badge.id = "myBadge";
  badge.textContent = `⏱️ ${readingTime} min read`;
  const heading = document.querySelector("h1");
  const date = articleElement.querySelector("time")?.parentNode; //?

  //display
  if (date || heading) {
    (date ?? heading).insertAdjacentElement("afterend", badge);
    console.log("%cInserted reading time estimation: ", "font-weight: bold")
    console.log(`${badge.textContent}`);
  }
  else {
    console.log("cannot insert the estimated time");
  }
}


function observerCallback() {
  //console.log(camelCase('mutation detected'));

  //check if the sites is ready
  if (document.readyState != 'complete' && document.readyState != 'interactive') {
    console.log(`doc ready state: ${document.readyState}`);
    return;
  }

  //check if already estimated time for the web page
  if (document.getElementById("myBadge")) {
    console.log("article already estimated");
    return;
  }

  //check if article exist
  const article = document.querySelector("article");
  if (!article) {
    console.log("No article found");
    return;
  }

  observer.disconnect(); //stop observing when my function is making changes
  estimateTime();
  observer.observe(document, config);
}


const config = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(observerCallback);
observer.observe(document, config); 
observerCallback(); 