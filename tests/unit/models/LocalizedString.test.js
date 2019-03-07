const LocalizedString = require('../../../server/models/LocalizedString');

describe('LocalizedString', () => {
  it('Initializes from a simple string', () => {
    const s = new LocalizedString('test');
    expect(s.get()).toBe('test');
    expect(s.get('en')).toBe('test');
    expect(s.languages).toEqual({ en: 'test' });
  });

  it('Initializes from an array of strings', () => {
    const s = new LocalizedString(['1', '2']);
    expect(s.get()).toBe('1\n2');
  });

  it('Initializes from a json-ld localized object', () => {
    const s = new LocalizedString({
      '@language': 'en',
      '@value': 'test',
    });
    expect(s.get()).toBe('test');
  });

  it('Initializes with another default', () => {
    const s = new LocalizedString('pourquoi?', 'fr');
    expect(s.get()).toBe('pourquoi?');
  });

  it('Returns the correct language', () => {
    const why = new LocalizedString('why');
    why.set('wieso', 'de');
    why.set('pourquoi', 'fr');
    expect(why.get()).toBe('why');
    expect(why.get('de')).toBe('wieso');
    why.default = 'fr';
    expect(why.get()).toBe('pourquoi');
  });

  it('Initializes from multiple json-ld language objects', () => {
    const why = new LocalizedString([
      { '@language': 'en', '@value': 'why' },
      { '@language': 'de', '@value': 'wieso' }
    ]);
    expect(why.get()).toBe('why');
    expect(why.get('de')).toBe('wieso');
  });
});
