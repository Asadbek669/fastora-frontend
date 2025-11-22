import { useEffect, useRef } from "react";

export default function NativeBanner() {
  const ref = useRef(null);

  useEffect(() => {
    const containerId = "container-1b881f8fdc3c6acb1ad0dc99388e8c85";
    const scriptUrl = "//pl28113073.effectivegatecpm.com/1b881f8fdc3c6acb1ad0dc99388e8c85/invoke.js";

    // containerni yangilab qo'yish
    if (ref.current) {
      ref.current.innerHTML = `<div id="${containerId}"></div>`;
    }

    // banner scriptni yaratish
    const script = document.createElement("script");
    script.async = true;
    script.src = scriptUrl;
    script.setAttribute("data-cfasync", "false");

    ref.current.appendChild(script);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        minHeight: "160px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    ></div>
  );
}
