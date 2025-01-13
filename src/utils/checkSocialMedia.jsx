
function checkSocialMedia(url) {
  // Regular expressions for Line, Facebook, and Telegram URLs
  const linePattern = /^https?:\/\/line\.me\//;
  const facebookPattern = /^https?:\/\/(?:www\.)?facebook\.com\//;
  const telegramPattern = /^https?:\/\/t\.me\//;
  const instagramPattern = /^https?:\/\/(?:www\.)?instagram\.com\//;

  if (telegramPattern.test(url)) {
    return "Telegram";
  } else if (facebookPattern.test(url)) {
    return "Facebook";
  } else if (linePattern.test(url)) {
    return "Line";
  } else if (instagramPattern.test(url)) {
    return "Instagram";
  } else {
    return "Link";
  }
}

export default checkSocialMedia;
