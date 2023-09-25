export function shortAddress(address?: string, len = 5) {
  if (!address) return '';
  if (address.length <= len * 2) return address;
  return address.slice(0, len) + '...' + address.slice(address.length - len);
}

export const copyToClipboard = async (textToCopy?: string) => {
  if (!textToCopy) return
  await navigator.clipboard.writeText(textToCopy)
};