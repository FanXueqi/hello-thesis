(function(){
  "use strict";

  const URL = "case.php";
  const CRITERIAS = {
    "application" : ["external", "internal", "intergrated"],
    "control": ["center", "local", "centern and local", "no control"],
    "movement": ["fold", "slide", "rotate", "twist", "roll"],
    "sensors": ["light", "temperature", "moisture", "touch", "acceleration"]
  };

  window.addEventListener("load", init);

  function init() {
    id("singleProjectView").classList.add("hidden");
    createNav();
  }

  function createNav() {
    for (var key in CRITERIAS) {
      if (CRITERIAS.hasOwnProperty(key)) {
        let btn = document.createElement("BUTTON");
        btn.innerText = key;
        btn.id = key;
        btn.addEventListener("click", function() {showClassifications(btn.id)});
        id("criterias").appendChild(btn);
      }
    }
  }

  function showClassifications(key) {
    clearOldClass();
    id(key).classList.add("selected");
    fetchClassificationData(key);
  }

  function clearOldClass() {
    let list = id("classifications");
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }

    let select = qs(".selected");
    if (select != null) {
      select.classList.remove("selected");
    }
  }

  /**
   * Fetches and displays classification data, for example: control
   */
  function fetchClassificationData(key) {
    let url = URL + "?classification=" + key;

    fetch(url)
       .then(checkStatus)
       .then(JSON.parse)
       .then(populateIcons)
       .catch(() => {
         console.log("a!")
       });
  }


  /**
  * Fetches and displays the cases under classifications
  */
  function populateIcons(response) {
    let numClasses = Object.keys(response).length;
    for (let i = 0; i < numClasses; i++) {
      let whatclass = Object.keys(response)[i];

      let classification = document.createElement("div");
      classification.classList.add("classification");
      classification.width = window.innerWidth / numClasses;
      console.log(window.innerWidth);
      console.log(classification.width);

      let classTitle = document.createElement("p");
      classTitle.innerText = whatclass;
      classification.appendChild(classTitle);

      let projects = document.createElement("div");
      projects.id = whatclass;
      projects.classList.add("projectsContainer");
      classification.appendChild(projects);

      id("classifications").appendChild(classification);

      for (let j = 0; j < response[whatclass].length; j++) {
        let project = response[whatclass][j];

        let icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = "cases/" + project + "/icon.png";
        icon.addEventListener("click", function() {showProject(project)});
        id(whatclass).appendChild(icon);
      }
    }

    function showProject(project) {
      id("allCasesView").classList.add("hidden");
      id("singleProjectView").classList.remove("hidden");
      fetchProject(project);
    }

    /**
     * Fetches the project detail data, including introduction, location, architects...
     */
    function fetchProject(project) {
      let url = URL + "?case=" + project;

      fetch(url)
         .then(checkStatus)
         .then(JSON.parse)
         .then(populateProject)
         .catch(() => {
           console.log("aaa!")
         });
    }

    function populateProject(response) {
      //baseInfo
      for (let i = 0; i < 8; i ++) {
        let part1 = document.createElement("p");
        part1.innerText = Object.keys(response)[i] + " : " + Object.values(response)[i];
        id("baseInfo").appendChild(part1);
      }

      //imgs
      let imgSrcs = response["ImgSrcs"];
      console.log(response["ImgSrcs"]);
      console.log(imgSrcs.length);
      for (let i = 0; i < imgSrcs.length; i++) {
        let image = document.createElement("img");
        image.src = imgSrcs[i];
        image.classList.add("images");
        id("imgs").appendChild(image);
      }

      //intro
      let intro = document.createElement("p");
      intro.innerText = response["Intro"];
      id("intro").appendChild(intro);
    }
  }

  /* ------------------------------ Helper Functions  ------------------------------ */
  // Note: You may use these in your code, but do remember that your code should not have
  // any functions defined that are unused.

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /** return the element with the given selector
   * @param {String} selector - selector of the specific html elements
   * @return {element} returns html element of given selector
  */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /** return the element with the given selector
   * @param {String} selector - selector of the specific html elements
   * @return {element} returns html element of given selector
  */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status === 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

})();
