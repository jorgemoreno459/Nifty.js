this["NiftyTemplates"] = this["NiftyTemplates"] || {};

this["NiftyTemplates"]["templates/alert.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="md-modal md-effect-1">\n    <div class="md-content">\n        <h3>' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n        <div>\n            <p>' +
((__t = ( message )) == null ? '' : __t) +
'</p>\n            <button class="md-close">OK</button>\n        </div>\n    </div>\n</div>\n<div class="md-overlay"></div>';

}
return __p
};

this["NiftyTemplates"]["templates/modal.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="md-modal">\n    <div class="md-content"></div>\n</div>\n<div class="md-overlay"></div>';

}
return __p
};