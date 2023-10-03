"use strict";
(() => {
  // src/content-script/index.ts
  function injectScript() {
  }
  function doctypeCheck() {
    const { doctype } = window.document;
    if (doctype) {
      return doctype.name === "html";
    }
    return true;
  }
  function suffixCheck() {
    const prohibitedTypes = [/\.xml$/u, /\.pdf$/u];
    const currentUrl = window.location.pathname;
    for (let i = 0; i < prohibitedTypes.length; i++) {
      if (prohibitedTypes[i].test(currentUrl)) {
        return false;
      }
    }
    return true;
  }
  function documentElementCheck() {
    const documentElement = document.documentElement.nodeName;
    if (documentElement) {
      return documentElement.toLowerCase() === "html";
    }
    return true;
  }
  function blockedDomainCheck() {
    const blockedDomains = [];
    const currentUrl = window.location.href;
    let currentRegex;
    for (let i = 0; i < blockedDomains.length; i++) {
      const blockedDomain = blockedDomains[i].replace(".", "\\.");
      currentRegex = new RegExp(`(?:https?:\\/\\/)(?:(?!${blockedDomain}).)*$`, "u");
      if (!currentRegex.test(currentUrl)) {
        return true;
      }
    }
    return false;
  }
  function iframeCheck() {
    return window.self != window.top;
  }
  function shouldInjectProvider() {
    return doctypeCheck() && suffixCheck() && documentElementCheck() && !blockedDomainCheck() && !iframeCheck();
  }
  if (shouldInjectProvider()) {
    injectScript();
  }
})();
