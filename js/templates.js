this["NiftyTemplates"] = this["NiftyTemplates"] || {};

this["NiftyTemplates"]["templates/alert.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="nifty-modal">\n    <div class="nifty-content">\n        <h3>' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n        <div class="nifty-inner">\n            <p class="nifty-alert-message">' +
((__t = ( message )) == null ? '' : __t) +
'</p>\n            <div class="nifty-buttons">\n                <button class="nifty-close">OK</button>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="nifty-overlay"></div>';

}
return __p
};

this["NiftyTemplates"]["templates/confirm.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="nifty-modal">\n    <div class="nifty-content">\n        <h3>' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n        <div class="nifty-inner">\n            <p>' +
((__t = ( message )) == null ? '' : __t) +
'</p>\n            <div class="nifty-buttons">\n                <button class="no">No</button>\n                <button class="yes">Yes</button>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="nifty-overlay"></div>';

}
return __p
};

this["NiftyTemplates"]["templates/loading.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="nifty-modal">\n    <div class="nifty-content">\n        <div class="loading">' +
((__t = ( message )) == null ? '' : __t) +
'</div>\n    </div>\n</div>\n<div class="nifty-overlay"></div>';

}
return __p
};

this["NiftyTemplates"]["templates/modal.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="nifty-modal">\n    <div class="nifty-content"></div>\n</div>\n<div class="nifty-overlay"></div>';

}
return __p
};

this["NiftyTemplates"]["templates/prompt.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="nifty-modal">\n    <div class="nifty-content">\n        <h3>' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n        <div class="nifty-error">This is a test error message</div>\n        <div class="nifty-inner">\n            <p>' +
((__t = ( message )) == null ? '' : __t) +
'</p>\n            <input type="' +
((__t = ( type )) == null ? '' : __t) +
'">\n            <div class="nifty-buttons">\n                <button class="cancel">Cancel</button>\n                <button class="ok">OK</button>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="nifty-overlay"></div>';

}
return __p
};