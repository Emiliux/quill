// CSP-compatible style utilities for Quill
// This module provides CSP-safe alternatives to inline style manipulation

class CSPStyleManager {
  constructor() {
    this.styleCounter = 0;
    this.styleSheet = null;
    this.styleCache = new Map();
  }

  // Create a stylesheet for CSP-compatible styles
  ensureStyleSheet() {
    if (!this.styleSheet) {
      this.styleSheet = document.createElement('style');
      this.styleSheet.type = 'text/css';
      this.styleSheet.setAttribute('data-quill-csp', 'true');
      document.head.appendChild(this.styleSheet);
    }
    return this.styleSheet;
  }

  // Convert inline styles to CSS classes
  convertStyleToClass(element, styleValue) {
    // Check cache first
    if (this.styleCache.has(styleValue)) {
      return this.styleCache.get(styleValue);
    }

    this.styleCounter += 1;
    const className = 'quill-csp-style-' + this.styleCounter;
    const styleSheet = this.ensureStyleSheet();

    // Add the style rule to the stylesheet
    const rule = '.' + className + ' { ' + styleValue + ' }';
    if (styleSheet.styleSheet) {
      // IE8
      styleSheet.styleSheet.cssText += rule;
    } else {
      // Modern browsers
      styleSheet.appendChild(document.createTextNode(rule));
    }

    // Cache the result
    this.styleCache.set(styleValue, className);
    return className;
  }

  // CSP-safe style setter
  setStyle(element, property, value) {
    try {
      // Try to set the style normally first
      element.style[property] = value;
    } catch (e) {
      // If CSP blocks it, convert to CSS class
      if (e.name === 'SecurityError' || e.message.includes('Content Security Policy')) {
        const styleString = property + ': ' + value + ';';
        const className = this.convertStyleToClass(element, styleString);
        element.classList.add(className);
        return className;
      }
      throw e;
    }
  }

  // CSP-safe multiple style setter
  setStyles(element, styles) {
    const styleString = Object.keys(styles)
      .map((prop) => prop + ': ' + styles[prop])
      .join('; ') + ';';

    try {
      // Try to set styles normally first
      Object.keys(styles).forEach((prop) => {
        element.style[prop] = styles[prop];
      });
    } catch (e) {
      // If CSP blocks it, convert to CSS class
      if (e.name === 'SecurityError' || e.message.includes('Content Security Policy')) {
        const className = this.convertStyleToClass(element, styleString);
        element.classList.add(className);
        return className;
      }
      throw e;
    }
  }

  // CSP-safe backgroundColor setter for color picker
  setBackgroundColor(element, color) {
    return this.setStyle(element, 'backgroundColor', color);
  }

  // CSP-safe positioning setter
  setPosition(element, left, top) {
    return this.setStyles(element, {
      left: left + 'px',
      top: top + 'px'
    });
  }

  // CSP-safe margin setter
  setMargin(element, property, value) {
    return this.setStyle(element, 'margin' + property.charAt(0).toUpperCase() + property.slice(1), value + 'px');
  }

  // CSP-safe width setter
  setWidth(element, width) {
    return this.setStyle(element, 'width', width + 'px');
  }

  // CSP-safe display setter
  setDisplay(element, display) {
    return this.setStyle(element, 'display', display);
  }

  // CSP-safe stroke/fill setter for SVG elements
  setSVGStyle(element, property, value) {
    try {
      element.style[property] = value;
    } catch (e) {
      if (e.name === 'SecurityError' || e.message.includes('Content Security Policy')) {
        const styleString = property + ': ' + value + ';';
        const className = this.convertStyleToClass(element, styleString);
        element.classList.add(className);
        return className;
      }
      throw e;
    }
  }
}

// Create a global instance
const cspStyleManager = new CSPStyleManager();

export default cspStyleManager;
