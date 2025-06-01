// Copy to clipboard function
export const copyToClipboard = async (
  text: string,
  fieldName: string,
  setCopiedField: any,
) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
  } catch (err) {
    console.error("Failed to copy text: ", err);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (fallbackErr) {
      console.error("Fallback copy failed: ", fallbackErr);
    }
    document.body.removeChild(textArea);
  }
};
