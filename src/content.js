//import camelCase from '../node_modules/camelCase'; MODULES DOESN'T WORK FOR SOME REASON
import {isCurrentTabBlacklisted} from "./helper.js";

var { Readability } = require('@mozilla/readability');

const enReadingSpeed = 200;
const chiReadingSpeed = 250;
const debugMode = false; //toggle the debugging lines

console.log("%ccontent script running", "font-weight: bold");
console.log(`English reading speed: ${enReadingSpeed}`);
console.log(`Chinese reading speed: ${chiReadingSpeed}`);


function testReadability(){
  console.log("%ctestReadability()", "font-weight: bold");
  const documentClone = document.cloneNode(true);
  const parsedArticle = new Readability(documentClone).parse();
  console.log(parsedArticle.textContent);
  console.log(`%ctitle string: ${parsedArticle.title}`, "font-weight: bold");
  console.log(parsedArticle.lang);
  console.log(parsedArticle.length);
  console.log("testsetsetset");

  //const articleObj = new Readability(documentClone, {serializer: el => el}).parse().content;
  //console.log(articleObj);
  //console.log(typeof(articleObj));
}

function getParsedTitleStr() {
  var documentClone = document.cloneNode(true);
  var article = new Readability(documentClone).parse();
  //check valid
  if (!article) {
    console.log("getParsedTitleStr(): article not found");
    return null;
  }
  const titleStr = article.title;
  console.log(`title string: ${titleStr}`);
  const parsedTitleStr = titleStr.split(' - ')[0];
  console.log(`parsed title string: ${parsedTitleStr}`);

  return parsedTitleStr;
}

//get the article title element, from a range of tags option
function getArticleTitleElement() {
  //hardcode for certain websites
  const currentUrl = window.location.href;
  let heading = "";
  console.log("Current URL:", currentUrl);
  if (currentUrl.includes("www.hk01.com")) {
    heading = document.querySelector("h1");
    console.log("hk01.com detected");
    return heading;
  }
  if (currentUrl.includes("news.rthk.hk")){
    heading = document.getElementsByClassName("itemTitle")[0];
    return heading;
  }

  //return the title element based on the parsed title str
  const parsedTitleStr = getParsedTitleStr();
  const tagArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  for (const tag of tagArr) {
    for (const candidate of document.querySelectorAll(tag)) {
      if (candidate.textContent.includes(parsedTitleStr)) {
        console.log(`found title element text content: ${candidate.textContent}`);
        console.log(`found title element of tag ${tag}`);
        return candidate;
      }
    }
  }
  console.log("no title element found based on the parsed title string");

  //return the title element based on the first h1 tag
  const h1 = document.querySelector("h1");
  if (h1) {
    console.log("found h1 tag as the title element");
    return h1;
  }
  //return the title element based on the first h2 tag
  const h2 = document.querySelector("h2");
  if (h2) {
    console.log("found h2 tag as the title element");
    return h2;
  }
}

function estimateTimeUsingReadability() {
  //TODO check out exisiting libraries for this
  const documentClone = document.cloneNode(true);
  let parsedArticleTextContent = new Readability(documentClone).parse().textContent;
  //depending on the language
  if (isChinese()) {
    //TODO make this consider the edge case of chinese text with english words as well
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

//estimate the time and insert the estimation
function estimateAndInsert() {
  testReadability();
  console.log('estimateTime() running');
  const readingTime = estimateTimeUsingReadability();
  console.log('new estimated time:'+readingTime);

  //create the badge
  const badge = document.createElement("p");
  badge.classList.add("time-estimation");
  badge.textContent = `(${readingTime} min read)`;

  const heading = getArticleTitleElement();
  
  //insert the badge under under heading
  if (heading) {
    //heading.style.setProperty("border", "1px solid purple");
    console.log(heading.tagName);
    //insert differently if the heading is a div
    if (heading.tagName === 'DIV') {
      //TODO better insert of badge for div heading
      console.log("heading is a fucking fucking div! (the estimation may be in awkward location)");
      heading.insertAdjacentElement("beforeend", badge);
    }
    else{
      heading.insertAdjacentElement("beforeend", badge);
    }

    //modify the badge's font size and color
    //TODO: seperate this into the css file
    const headingStyles = window.getComputedStyle(heading);
    const headingFontSize = headingStyles.getPropertyValue("font-size");
    const badgeFontSize = parseFloat(headingFontSize) * 0.7;

    badge.style.setProperty("font-size", String(badgeFontSize)+'px');
    badge.style.setProperty("color", "grey");
    badge.style.setProperty("display", "block");


    //badge.style.setProperty("border", "1px solid red");
    //badge.style.setProperty("font-family", badgeFontFamily);

    console.log("%cInserted reading time estimation: ", "font-weight: bold")
    console.log(`${badge.textContent}`);
  }
  else {
    console.log("%ccannot insert the estimated time (No heading found)", "font-weight: bold");
  }
}


async function observerCallback() {
  //check if the sites is ready
  if (document.readyState != 'complete' && document.readyState != 'interactive') {
    console.log(`%cdoc ready state: ${document.readyState}`, "font-weight: bold");
    return;
  }

  //check if the current tab is in blacklist or not
  //TODO
  let blacklistBool = await isCurrentTabBlacklisted()
  if (blacklistBool) {
    console.log("%ccurrent tab is in blacklist!", "font-weight: bold");
    return;
  }
  else {
    console.log("current tab is not in blacklist");
  }

  //TODO: need some modification for (1. updated article length, 2. ?)
  //check if already estimated time for the web page 
  
  if (document.querySelector(".time-estimation")) {
    console.log("%cTime2Read has already been estimated", "font-weight: bold");
    return;
  }
  

  //check if can find the title
  const title = getArticleTitleElement();
  if (!title) {
    console.log("%cNo title found", "font-weight: bold");
    return;
  }

  //TODO stop the observer if can't insert several times in a short period
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