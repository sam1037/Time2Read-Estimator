//import camelCase from '../node_modules/camelCase';

const enReadingSpeed = 200;
const chiReadingSpeed = 250;
const debugMode = false; //toggle the debugging lines

console.log("%ccontent script running", "font-weight: bold");
console.log(`English reading speed: ${enReadingSpeed}`);
console.log(`Chinese reading speed: ${chiReadingSpeed}`);


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
    //TODO: print out the words for debug purposes
    var wordCount = [...words].length;
    var readingTime = Math.ceil(wordCount / enReadingSpeed);
  }

  //create the badge
  const badge = document.createElement("p");
  badge.id = "myBadge";
  badge.classList.add("time-estimation");
  badge.textContent = `(${readingTime} min read)`;

  const heading = document.querySelector("h1");
  const date = articleElement.querySelector("time")?.parentNode; //?

  //create the span element
  //TODO: style it w/ a sepearte css file and link together, also change the style
  //TODO: check style of websites that have built in time estimation for articles like medium
  const spanElement = document.createElement("span");
  spanElement.style.fontWeight = "bold";
  spanElement.style.backgroundColor = "yellow";
  spanElement.classList.add("time-estimation");
  spanElement.textContent = `${readingTime} min read`;
  console.log("%c span element: ", "font-weight: bold");
  console.log(spanElement);

  //display (span element)
  /*if (heading) {
    console.log(heading);
    console.log(heading.textContent);
    
    heading.appendChild(spanElement);
    badge.style.display = "none";
    return;
  }
  */
  //()
  if (heading) {
    heading.insertAdjacentElement("beforeend", badge);
    //print style of the badge for debug
    const headingStyles = window.getComputedStyle(heading);
    const headingFontSize = headingStyles.getPropertyValue("font-size");
    const headingFontFamily = headingStyles.getPropertyValue('font-family');
    const badgeFontFamily = "nyt-cheltenham-cond, nyt-cheltenham, cheltenham-fallback-georgia";

    let badgeFontSize = parseFloat(headingFontSize) * 0.7;
    console.log("heading font size: ", headingFontSize);
    console.log("badge font size: ", badgeFontSize);
    console.log("heaing font family: ", headingFontFamily);

    //modify style of the badge 
    //TODO: seperate this into the css file
    badge.style.setProperty("font-size", String(badgeFontSize)+'px');
    badge.style.setProperty("color", "grey");
    //badge.style.setProperty("font-family", badgeFontFamily);

    console.log("%cInserted reading time estimation: ", "font-weight: bold")
    console.log(`${badge.textContent}`);
  }
  else {
    console.log("cannot insert the estimated time (no h1 heading found)");
  }
}


function observerCallback() {
  //check if the sites is ready
  if (document.readyState != 'complete' && document.readyState != 'interactive') {
    console.log(`doc ready state: ${document.readyState}`);
    return;
  }

  //check if already estimated time for the web page
  if (document.querySelector(".time-estimation")) {
    console.log("Time2Read has already been estimated");
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


//main logic
const config = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(observerCallback);
observer.observe(document, config); 
observerCallback(); 