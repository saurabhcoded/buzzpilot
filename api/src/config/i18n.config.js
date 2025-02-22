const i18n = require('i18n');
const path = require('path');

// internalisation
i18n.configure({
    locales: ['en', 'hi'],
    defaultLocale: 'en',
    directory: path.join('src', 'locales'),
})

module.exports = i18n;