import bowser = require('bowser');

export default (userAgent: string) => {
  const parser = bowser.getParser(userAgent);
  const currentBrowser = parser.getBrowser();
  const currentOs = parser.getOS();

  if (
    Object.values(currentBrowser).some((elem) => !elem.length) ||
    Object.keys(currentOs).some((elem) => !elem.length)
  ) {
    return null;
  }

  return `${currentOs.name} ${currentOs.versionName}: ${currentBrowser.name}(${currentBrowser.version})`;
};
