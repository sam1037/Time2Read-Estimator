//import camelCase from '../node_modules/camelCase'; MODULES DOESN'T WORK FOR SOME REASON
//import {getFilteredArticleText} from "./helper.js";

const enReadingSpeed = 200;
const chiReadingSpeed = 250;
const debugMode = false; //toggle the debugging lines

console.log("%ccontent script running", "font-weight: bold");
console.log(`English reading speed: ${enReadingSpeed}`);
console.log(`Chinese reading speed: ${chiReadingSpeed}`);

console.log("some experimental features made, test");


//determine if the text is chinese of not
function isChinese() {
  var lang = document.documentElement.getAttribute('lang');
  console.log(`lang attribute: ${lang}`);
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
//TODO: some room of improvements

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
} 

//estimate the time and insert the estimation
function estimateTime() {
  console.log('estimateTime() running');

  //get the filtered article text
  const articleElement = document.querySelector('article');
  let text = getFilteredArticleText(articleElement);

  //change style of the article for debug
  if (debugMode) {
    articleElement.style.outline = "3px solid red";
  }

  //estimate the reading time (case chin and case eng text)
  if (isChinese()) {
    text = text.replace(/\s+/g, ""); 
    console.debug(`filtered chin text: \n${text}`);
    var wordCount = text.length;
    var readingTime = Math.ceil(wordCount / chiReadingSpeed);
  }
  else {
    const wordMatchRegExp = /[^\s]+/g;
    const words = text.matchAll(wordMatchRegExp);
    const extractedWords = [...words].map(match => match[0]);
    
    //print out the words for debug purposes
    const joinedWords = extractedWords.join(' ');
    console.debug(typeof(joinedWords), joinedWords);
    
    var wordCount = extractedWords.length;
    var readingTime = Math.ceil(wordCount / enReadingSpeed);
  }

  //create the badge
  const badge = document.createElement("p");
  badge.classList.add("time-estimation");
  badge.textContent = `(${readingTime} min read)`;

  const heading = document.querySelector("h1");
  //const date = articleElement.querySelector("time")?.parentNode; //?
  
  //insert the badge under under heading
  if (heading) {
    heading.insertAdjacentElement("beforeend", badge);
    //modify the badge's font size and color
    //TODO: seperate this into the css file
    const headingStyles = window.getComputedStyle(heading);
    const headingFontSize = headingStyles.getPropertyValue("font-size");
    const badgeFontSize = parseFloat(headingFontSize) * 0.7;

    badge.style.setProperty("font-size", String(badgeFontSize)+'px');
    badge.style.setProperty("color", "grey");
    //badge.style.setProperty("font-family", badgeFontFamily);

    console.log("%cInserted reading time estimation: ", "font-weight: bold")
    console.log(`${badge.textContent}`);
  }
  else {
    console.log("%ccannot insert the estimated time (No h1 heading found)", "font-weight: bold");
  }
}


function observerCallback() {
  //check if the extension is on or off
  
  //check if the sites is ready
  if (document.readyState != 'complete' && document.readyState != 'interactive') {
    console.log(`doc ready state: ${document.readyState}`);
    return;
  }

  //TODO: need some modification for (1. updated article length, 2. ?)
  //check if already estimated time for the web page 
  if (document.querySelector(".time-estimation")) {
    console.log("Time2Read has already been estimated");
    return;
  }

  //check if article exist
  const article = document.querySelector("article");
  if (!article) {
    console.log("%cNo article found", "font-weight: bold");
    return;
  }

  observer.disconnect(); //stop observing when my function is making changes
  estimateTime();
  observer.observe(document, config);
}


//main logic
const config = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(observerCallback);
observer.observe(document, config); //working in the background?
console.log("should get here!");
observerCallback(); //manually 1st time call it