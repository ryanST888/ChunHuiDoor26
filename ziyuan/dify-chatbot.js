(function () {
  var token = "OLjiwrNfuhfXcfFM";
  var baseUrl = "https://udify.app";

  window.difyChatbotConfig = {
    token: token,
    isDev: false,
    baseUrl: baseUrl,
    inputs: {},
    systemVariables: {},
    userVariables: {},
  };

  var style = document.createElement("style");
  style.textContent = [
    "#dify-chatbot-bubble-button {",
    "  background-color: #1C64F2 !important;",
    "}",
    "#dify-chatbot-bubble-window {",
    "  width: 24rem !important;",
    "  height: 40rem !important;",
    "}",
    "@media (max-width: 480px) {",
    "  #dify-chatbot-bubble-window {",
    "    width: calc(100vw - 2rem) !important;",
    "    height: calc(100vh - 6rem) !important;",
    "  }",
    "}",
  ].join("\n");
  document.head.appendChild(style);

  var script = document.createElement("script");
  script.src = baseUrl + "/embed.min.js";
  script.id = token;
  script.defer = true;
  document.body.appendChild(script);
})();
