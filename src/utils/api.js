export default function api(config) {
  if (!config.method) {
    config.method = "GET";
  }

  if (!config.url) {
    return;
  }
  const oReq = new XMLHttpRequest();

  oReq.addEventListener("load", config.cb);
  oReq.open(config.method, config.url);
  oReq.send();
}
