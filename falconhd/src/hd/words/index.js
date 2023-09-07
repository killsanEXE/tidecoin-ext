"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const chinese_simplified_1 = __importDefault(require("./chinese-simplified"));
const chinese_traditional_1 = __importDefault(require("./chinese-traditional"));
const french_1 = __importDefault(require("./french"));
const english_1 = __importDefault(require("./english"));
const italian_1 = __importDefault(require("./italian"));
const japanese_1 = __importDefault(require("./japanese"));
const spanish_1 = __importDefault(require("./spanish"));
function default_1(name) {
  switch (name) {
    case "simplified chinese":
      return chinese_simplified_1.default;
    case "traditional chinese":
      return chinese_traditional_1.default;
    case "english":
      return english_1.default;
    case "french":
      return french_1.default;
    case "italian":
      return italian_1.default;
    case "japanese":
      return japanese_1.default;
    case "spanish":
      return spanish_1.default;
    default:
      throw new Error(`Unknown language: ${name}.`);
  }
}
exports.default = default_1;
