export function showLoader(bool, loaderId, containerId) {
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
