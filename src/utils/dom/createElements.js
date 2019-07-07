export const createOptionWithLabel = function(config, currQ) {
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
