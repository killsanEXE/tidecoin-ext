import Big from "big.js";

export function shortAddress(address?: string, len = 5) {
  if (!address) return "";
  if (address.length <= len * 2) return address;
  return address.slice(0, len) + "..." + address.slice(address.length - len);
}

export const satoshisToBTC = (amount: number) => {
  return amount / 100_000_000;
};

export function tidoshisToAmount(val: number) {
  const num = new Big(val);
  return num.div(100_000_000).toFixed(8);
}

export const isNotification = (): boolean => {
  return window.location.pathname.includes("notification.html");
};