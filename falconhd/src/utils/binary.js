"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.insert = exports.search = void 0;
function search(items, key, compare, insert) {
  let start = 0;
  let end = items.length - 1;
  while (start <= end) {
    const pos = (start + end) >>> 1;
    const cmp = compare(items[pos], key);
    if (cmp === 0) return pos;
    if (cmp < 0) start = pos + 1;
    else end = pos - 1;
  }
  if (!insert) return -1;
  return start;
}
exports.search = search;
function insert(items, item, compare, uniq) {
  const i = exports.search(items, item, compare, true);
  if (uniq && i < items.length) {
    if (compare(items[i], item) === 0) return -1;
  }
  if (i === 0) items.unshift(item);
  else if (i === items.length) items.push(item);
  else items.splice(i, 0, item);
  return i;
}
exports.insert = insert;
function remove(items, item, compare) {
  const i = search(items, item, compare, false);
  if (i === -1) return false;
  splice(items, i);
  return true;
}
exports.remove = remove;
function splice(list, i) {
  if (i === 0) {
    list.shift();
    return;
  }
  let k = i + 1;
  while (k < list.length) list[i++] = list[k++];
  list.pop();
}
