const LocalizedString = function (init, defaultLanguage = 'en') {
  this.default = defaultLanguage;
  this.languages = {};

  if (typeof init === 'string') {
    this.languages[this.default] = init;
  } else if (!!init && init.constructor === Array) {
    init.forEach(s => {
      const t = new LocalizedString(s);
      Object.entries(t.languages).forEach(([key, value]) => {
        if (!this.languages[key]) return this.languages[key] = value;
        this.languages[key] += `\n${value}`;
      });
    });
  } else if (!!init && init.constructor === Object) {
    if (init['@value']) {
      const lang = init['@language'] || this.default;
      this.languages[lang] = init['@value'];
    }
  }

  this.get = (language = this.default) => {
    return this.languages[language];
  }
  this.set = (value, language = this.default) => {
    this.languages[language] = value;
  }
};

module.exports = LocalizedString;
