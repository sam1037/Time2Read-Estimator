//import camelCase from '../node_modules/camelCase'; MODULES DOESN'T WORK FOR SOME REASON
//import {getFilteredArticleText} from "./helper.js";

var { Readability } = require('@mozilla/readability');

const enReadingSpeed = 200;
const chiReadingSpeed = 250;
const debugMode = false; //toggle the debugging lines

console.log("%ccontent script running", "font-weight: bold");
console.log(`English reading speed: ${enReadingSpeed}`);
console.log(`Chinese reading speed: ${chiReadingSpeed}`);

console.log("some experimental features made, test");

function testReadability(){
  const documentClone = document.cloneNode(true);
  const parsedArticle = new Readability(documentClone).parse();
  console.log(parsedArticle.title, typeof(parsedArticle.title));
  console.log(parsedArticle.lang);
  console.log(parsedArticle.length);
  console.log("testsetsetset");

  //const articleObj = new Readability(documentClone, {serializer: el => el}).parse().content;
  //console.log(articleObj);
  //console.log(typeof(articleObj));
}

//get the article title element, from a range of tags option
function getArticleTitleElement() {
  //TODO maybe could use readability to get html element of the article, and just query witin that
  var documentClone = document.cloneNode(true);
  var article = new Readability(documentClone).parse();
  const titleStr = article.title;
  console.log(`title string: ${titleStr}`);
  const tagArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'p', 'a'];
  for (const tag of tagArr) {
    for (const candidate of document.querySelectorAll(tag)) {
      if (candidate.textContent.includes(titleStr)) {
        console.log(`found title element: ${tag}`);
        return candidate;
      }
    }
  }
}

function estimateTimeUsingReadability() {
  const documentClone = document.cloneNode(true);
  const parsedArticleTextContent = new Readability(documentClone).parse().textContent;
  //depending on the language
  if (isChinese()) {
    parsedArticleTextContent = parsedArticleTextContent.replace(/\s+/g, ""); 
    console.debug(`filtered chin text: \n${parsedArticleTextContent}`); //this ????
    var wordCount = parsedArticleTextContent.length;
    var readingTime = Math.ceil(wordCount / chiReadingSpeed);
  }
  else {
    const wordMatchRegExp = /[^\s]+/g;
    const words = parsedArticleTextContent.matchAll(wordMatchRegExp);
    const extractedWords = [...words].map(match => match[0]);
    
    //print out the words for debug purposes
    const joinedWords = extractedWords.join(' ');
    console.debug(typeof(joinedWords), joinedWords);
    
    var wordCount = extractedWords.length;
    var readingTime = Math.ceil(wordCount / enReadingSpeed);
  }
  return readingTime;
}

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
function estimateAndInsert() {
  testReadability();
  console.log('estimateTime() running');
  const readingTime = estimateTimeUsingReadability();
  console.log('new estimated time:'+readingTime);

  //get the filtered article text
  //const articleElement = document.querySelector('article');
  //let text = getFilteredArticleText(articleElement);

  //change style of the article for debug
  //if (debugMode) {
  //  articleElement.style.outline = "3px solid red";
  //}

  //estimate the reading time (case chin and case eng text)
  /*
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
  */

  //create the badge
  const badge = document.createElement("p");
  badge.classList.add("time-estimation");
  badge.textContent = `(${readingTime} min read)`;

  //const heading = document.querySelector("h1");
  const heading = getArticleTitleElement();
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
    badge.style.setProperty("display", "block");
    //badge.style.setProperty("font-family", badgeFontFamily);

    console.log("%cInserted reading time estimation: ", "font-weight: bold")
    console.log(`${badge.textContent}`);
  }
  else {
    console.log("%ccannot insert the estimated time (No heading found)", "font-weight: bold");
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

  /*
  //check if article exist
  const article = document.querySelector("article");
  if (!article) {
    console.log("%cNo article found", "font-weight: bold");
    return;
  }
  */

  observer.disconnect(); //stop observing when my function is making changes
  estimateAndInsert();
  observer.observe(document, config);
}

//listen for the toggle estimation message
function listenForToggleEstimation() {
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.message === "toggle-estimation") {
      //toggle the estimation's display
      const badge = document.querySelector(".time-estimation");
      //if badge is not found
      if (!badge) {
        console.log("toggle estimation: no badge found");
        //sendResponse({setBadgeTextTo: "OFF"});
        return;
      }
      //if badge is visible, hide it with css
      if (badge.style.getPropertyValue("display") != "none") {
        badge.style.setProperty("display", "none");
        //sendResponse({setBadgeTextTo: "OFF"});
      }
      //unhide the badge if it is hidden
      else {
        badge.style.setProperty("display", "block");
        //sendResponse({setBadgeTextTo: "ON"});
      }
    }
  });
}

//main logic
const config = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(observerCallback);
observer.observe(document, config); //working in the background?
listenForToggleEstimation(); //listen for the toggle estimation message
console.log("should get here!");
observerCallback(); //manually 1st time call it