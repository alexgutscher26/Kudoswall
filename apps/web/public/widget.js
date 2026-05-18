(function () {
  console.log("KudosWall: Initializing...");

  const scripts = document.getElementsByTagName("script");
  let targetScript = document.currentScript;

  if (!targetScript) {
    for (let i = scripts.length - 1; i >= 0; i--) {
      const s = scripts[i];
      if (s.getAttribute("data-id") && s.src.indexOf("widget.js") !== -1 && !s.hasAttribute("data-initialized")) {
        targetScript = s;
        break;
      }
    }
  }

  if (!targetScript) {
    console.error("KudosWall: Could not find script tag. Ensure data-id is present.");
    return;
  }

  targetScript.setAttribute("data-initialized", "true");
  const widgetId = targetScript.getAttribute("data-id");
  console.log("KudosWall: Widget ID found:", widgetId);

  let baseUrl;
  try {
    const scriptUrl = new URL(targetScript.src, window.location.origin);
    baseUrl = scriptUrl.origin;
  } catch (e) {
    baseUrl = window.location.origin;
  }

  // Extract other data attributes for query overrides
  const params = new URLSearchParams();
  const attributes = targetScript.attributes;
  const mapping = {
    theme: "theme",
    layout: "layout",
    "accent-color": "accentColor",
    "background-color": "backgroundColor",
    "max-items": "maxItems",
  };

  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    if (attr.name.startsWith("data-") && attr.name !== "data-id") {
      const key = mapping[attr.name.slice(5)];
      if (key) params.append(key, attr.value);
    }
  }

  const embedUrl = `${baseUrl}/embed/${widgetId}${params.toString() ? "?" + params.toString() : ""}`;
  
  const iframe = document.createElement("iframe");
  iframe.setAttribute("src", embedUrl);
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowTransparency", "true");
  iframe.style.width = "100%";
  iframe.style.border = "none";
  iframe.style.overflow = "hidden";
  iframe.style.background = "transparent";
  iframe.style.display = "block"; 
  iframe.style.opacity = "0";
  iframe.style.transition = "opacity 0.3s ease-in-out";
  iframe.title = "KudosWall Widget";

  targetScript.parentNode.insertBefore(iframe, targetScript.nextSibling);

  window.addEventListener("message", (event) => {
    if (event.origin !== baseUrl) return;
    if (event.data && event.data.widgetId === widgetId) {
      if (event.data.type === "ready") {
        console.log("KudosWall: Received ready.");
        iframe.style.opacity = "1";
      } else if (event.data.type === "resize") {
        const height = event.data.height;
        if (height > 0) {
          iframe.style.height = height + "px";
        }
      }
    }
  });
})();
