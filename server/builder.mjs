import lunr from 'lunr';

const builder = new lunr.Builder();
builder.field('aclLabel', { boost: 20 });
builder.field('label', { boost: 20 });
builder.field('title', { boost: 20 });
builder.field('dcElementsDescription', { boost: 5 });
builder.field('dcTermsDescription', { boost: 5 });
builder.field('comment', { boost: 1 });
builder.field('note', { boost: 1 });
builder.field('ns');
builder.ref('uri');

export default builder;
