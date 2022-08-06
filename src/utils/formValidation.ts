export function isAlphaNumeric(str: string) {
    // The author of this validator is Michael Martin-Smucker. Source: 
    // https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
    let code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
}
