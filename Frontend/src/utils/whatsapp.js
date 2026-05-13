export const sendWhatsApp = (parent) => {
  console.log("FUNCTION CALLED:", parent);

  if (!parent) return alert("No parent object");

  let digits = String(parent.mobileNumber).replace(/\D/g, '');

  console.log("CLEAN NUMBER:", digits);

  if (digits.length === 10) {
    digits = '91' + digits;
  }

  const url = `https://wa.me/${digits}?text=test`;

  console.log("FINAL URL:", url);

  window.open(url, "_blank");
};