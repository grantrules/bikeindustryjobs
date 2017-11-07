var sanitizeHtml = require('sanitize-html');

module.exports = html => sanitizeHtml(html,{
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
  })