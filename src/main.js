import api from "./utils/api";
import config from "./config.json";
import "./index.css";
import baseStore from "./store/baseStore";

showLoader(true);

api({
  url: config.surveyBaseApi,
  cb: response => {
    const surveyData = response.currentTarget;
    const resp = surveyData.response;
    const jsonData = JSON.parse(resp);
    showLoader(false);
    startSurvey(jsonData);
  }
});

function showLoader(bool) {
  const loaderEle = document.getElementById("loader");
  const containerEle = document.getElementById("container");

  if (bool) {
    loaderEle.style.display = "block";
    containerEle.style.display = "none";
  } else {
    loaderEle.style.display = "none";
    containerEle.style.display = "block";
  }
}

//
/**
 *
 * @param {String} config.name
 * @param {String} config.label
 * @param {String} config.value
 * @param {String} config.text
 */
function makeRadioButton(config) {
  const label = document.createElement("label");
  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = config.label;
  radio.value = config.value;

  label.appendChild(radio);

  label.appendChild(document.createTextNode(config.text));
  return label;
}

const createOptionWithLabel = function(config, currQ) {
  // creating checkbox element
  const checkbox = document.createElement("input");
  const li = document.createElement("li");
  const div = document.createElement("div");
  const div2 = document.createElement("div");

  // Assigning the attributes
  // to created checkbox
  checkbox.type = !config.isMultiSelect ? "radio" : "checkbox";
  checkbox.name = !config.isMultiSelect ? "option" : config.label;
  checkbox.value = config.label;
  checkbox.id = config.id;

  // creating label for checkbox
  var label = document.createElement("label");

  // assigning attributes for
  // the created label tag
  label.htmlFor = `l-${config.id}`;

  let img = null;
  if (config.type === "image_text") {
    img = document.createElement("img");
    img.src = config.src;
    img.style.width = "35%";
    div.appendChild(img);
  }
  // appending the created text to
  // the created label tag
  div2.appendChild(checkbox);
  label.appendChild(document.createTextNode(config.label));
  div2.appendChild(label);
  div.appendChild(div2);
  li.appendChild(div);

  checkbox.setAttribute("data-qid", config.qid);
  checkbox.setAttribute("data-oid", config.oid);
  checkbox.setAttribute("data-ismulti", config.isMultiSelect);

  return li;
};

const updateCurrentQ = function(store) {
  const currentQEle = document.getElementById("currentQ");
  currentQEle.innerText = store.currentQN + 1; // due to 0 index
};

const updateTotalQ = function(store) {
  const currentQEle = document.getElementById("totalQ");
  currentQEle.innerText = store.totalQs; // due to 0 index
};

const thankyou = function(store) {
  const container = document.getElementById("container");
  container.innerHTML = `
    <div class="thankyou">
      <span>Thank you for completing the survey<span>
    </div>
  `;

  console.log(store.answers);
};

const showQuestion = function(store) {
  const currQ = store.currentQ;
  const qEle = document.getElementById("question");
  qEle.innerText = `
    ${currQ.question.text}
  `;

  if (currQ.required) {
    const oEle = document.getElementById("optional");
    oEle.style.display = "none";
  } else {
    const oEle = document.getElementById("optional");
    oEle.style.display = "inline";
  }

  updateOptions(currQ, store);
  updateFooter(currQ);
};

const updateFooter = function(currQ) {
  const skipBtn = document.getElementById("skipBtn");
  const continueBtn = document.getElementById("continueBtn");
  if (currQ.required) {
    skipBtn.style.display = "none";
    continueBtn.style.display = "none";
  } else {
    skipBtn.style.display = "block";
    continueBtn.style.display = "none";
  }
};

const optionsAreaCb = (store, currQ, e) => {
  const qid = e.target.getAttribute("data-qid");
  const oid = e.target.getAttribute("data-oid");
  const ismulti = e.target.getAttribute("data-ismulti");
  if (qid && oid) {
    store.updateAnswers(qid, oid, ismulti);
    const skipBtn = document.getElementById("skipBtn");
    const continueBtn = document.getElementById("continueBtn");
    if (store.isMinOneAnswerSelected(qid)) {
      skipBtn.style.display = "none";
      continueBtn.style.display = "block";
    } else {
      if (!currQ.required) {
        skipBtn.style.display = "block";
      } else {
        skipBtn.style.display = "none";
      }

      continueBtn.style.display = "none";
    }

    console.log(store.answers);
  }
};

const updateOptions = function(currQ, store) {
  const options = currQ.options.map((o, i) => {
    return createOptionWithLabel({
      label: o.label.text,
      option: o.value,
      name: o.label.text,
      id: i,
      isMultiSelect: currQ.multiSelect,
      type: currQ.optionType,
      src: o.img && o.img.src,
      oid: i,
      qid: currQ.id
    });
  });

  const optionsArea = document.getElementById("optionsArea");
  const div = document.createElement("div");
  const optionsAreaCbWithData = optionsAreaCb.bind(this, store, currQ);
  div.addEventListener("click", optionsAreaCbWithData, false);
  while (optionsArea.firstChild) {
    optionsArea.removeChild(optionsArea.firstChild);
  }
  options.forEach(o => {
    div.appendChild(o);
  });

  optionsArea.appendChild(div);
};

const addEventsToFooter = function(store) {
  const skipBtn = document.getElementById("skipBtn");
  const continueBtn = document.getElementById("continueBtn");
  skipBtn.style.display = "none";

  skipBtn.addEventListener(
    "click",
    e => {
      const optionsArea = document.getElementById("optionsArea");
      optionsArea.removeEventListener("click");
      store.skipCurrentQ();
      const nextQ = store.getNextQ();
      if (!nextQ) {
        thankyou(store);
        return;
      }
      updateCurrentQ(store); // question number
      showQuestion(store);
    },
    false
  );
  continueBtn.addEventListener(
    "click",
    e => {
      const nextQ = store.getNextQ();
      if (!nextQ) {
        thankyou(store);
        return;
      }
      updateCurrentQ(store); // question number
      showQuestion(store);
    },
    false
  );
};

const startSurvey = function(data) {
  const store = new baseStore(data);
  updateCurrentQ(store);
  updateTotalQ(store);
  addEventsToFooter(store);
  showQuestion(store);
};
