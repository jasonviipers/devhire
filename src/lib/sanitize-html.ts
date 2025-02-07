import sanitizeHtmlLibrary, { simpleTransform } from "sanitize-html";

// Configuration options for HTML sanitization
const sanitizeOptions: sanitizeHtmlLibrary.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "blockquote", "p", "a", "ul", "ol", "nl", "li",
    "b", "i", "strong", "em", "strike", "code", "hr",
    "br", "div", "span", "pre", "mark", "ins", "sup", "sub"
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    span: ["class"],
    div: ["class"],
    p: ["class"],
    pre: ["class"],
    code: ["class"],
    mark: ["class"],
    ins: ["class"],
    sup: ["class"],
    sub: ["class"]
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  enforceHtmlBoundary: true,
  parseStyleAttributes: false,
  transformTags: {
    a: simpleTransform("a", {
      rel: "noopener",
      target: "_blank"
    })
  }
};

export function sanitizeHtml(dirty: string): string {
  return sanitizeHtmlLibrary(dirty, sanitizeOptions);
}

export function sanitizeRichText(dirty: string): string {
    const allowedTags = Array.isArray(sanitizeOptions.allowedTags) ? sanitizeOptions.allowedTags : [];
    return sanitizeHtmlLibrary(dirty, {
      ...sanitizeOptions,
      allowedTags: [...allowedTags, "img"],
      allowedAttributes: {
        ...sanitizeOptions.allowedAttributes,
        img: ["src", "alt", "width", "height"]
      }
    });
  }