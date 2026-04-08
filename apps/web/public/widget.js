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
    console.log("KudosWall: Base URL detected:", baseUrl);
  } catch (e) {
    baseUrl = window.location.origin;
    console.warn("KudosWall: Could not parse script URL, falling back to current origin.");
  }

  // Extract other data attributes for dynamic filtering
  const params = new URLSearchParams();
  const attributes = targetScript.attributes;
  const mapping = {
    theme: "theme",
    layout: "layout",
    "max-items": "maxItems",
    maxitems: "maxItems",
    "accent-color": "accentColor",
    accentcolor: "accentColor",
    "background-color": "backgroundColor",
    backgroundcolor: "backgroundColor",
    "text-color": "textColor",
    textcolor: "textColor",
    "hide-badge": "hideBadge",
    hidebadge: "hideBadge",
  };

  const allowedOverrides = ["theme", "layout", "maxItems", "accentColor", "backgroundColor", "textColor", "hideBadge"];

  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    if (attr.name.startsWith("data-") && attr.name !== "data-id") {
      const originalKey = attr.name.slice(5).toLowerCase();
      const mappedKey = mapping[originalKey];

      if (mappedKey && allowedOverrides.includes(mappedKey)) {
        let value = attr.value;
        // Clean hex colors
        if (["accentColor", "backgroundColor", "textColor"].includes(mappedKey) && value.startsWith("#")) {
          value = value.slice(1);
        }
        params.append(mappedKey, value);
      }
    }
  }

  const embedUrl = `${baseUrl}/embed/${widgetId}${params.toString() ? "?" + params.toString() : ""}`;
  console.log("KudosWall: Embed URL:", embedUrl);

  const iframe = document.createElement("iframe");
  iframe.setAttribute("src", embedUrl);
  iframe.setAttribute("width", "100%");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("scrolling", "no");
  iframe.style.width = "100%";
  iframe.style.border = "none";
  iframe.style.overflow = "hidden";
  iframe.style.display = "none"; // Hide initially
  iframe.style.opacity = "0"; // Fade in later
  iframe.style.transition = "opacity 0.3s ease-in-out";
  iframe.title = "KudosWall Widget";

  // State to track if widget is ready
  let isReady = false;

  // Insert iframe after the script tag
  targetScript.parentNode.insertBefore(iframe, targetScript.nextSibling);

  // Fallback: If no ready message within 5 seconds, hide/remove the widget
  const timeoutId = setTimeout(() => {
    if (!isReady) {
      console.warn("KudosWall: Widget failed to load or API is unreachable. Hiding widget container.");
      if (iframe.parentNode) {
        iframe.style.display = "none";
        // Optionally remove it completely to prevent DOM bloat
        // iframe.parentNode.removeChild(iframe);
      }
    }
  }, 5000);

  // Listen for messages from iframe
  window.addEventListener("message", (event) => {
    // Only accept messages from our domain
    if (event.origin !== baseUrl) return;

    if (event.data && event.data.widgetId === widgetId) {
      if (event.data.type === "ready") {
        console.log("KudosWall: Widget ready.");
        isReady = true;
        clearTimeout(timeoutId);
        iframe.style.display = "block";
        // Small delay to ensure styles are applied before fade
        setTimeout(() => {
          iframe.style.opacity = "1";
        }, 50);
      } else if (event.data.type === "resize") {
        const newHeight = event.data.height + "px";
        if (iframe.style.height !== newHeight) {
          iframe.style.height = newHeight;
        }
      }
    }
  });
})();
