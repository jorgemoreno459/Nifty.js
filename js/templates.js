this["NiftyTemplates"] = this["NiftyTemplates"] || {};

this["NiftyTemplates"]["templates/alert.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="nifty-modal">\n    <div class="nifty-content">\n        <h3>' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n        <div class="nifty-inner">\n            <p class="nifty-alert-message">' +
((__t = ( message )) == null ? '' : __t) +
'</p>\n            <div class="nifty-buttons">\n                <button class="btn btn-default nifty-close">OK</button>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="nifty-overlay"></div>';

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
'</p>\n            <div class="nifty-buttons">\n                <button id="no-btn" class="btn btn-default">No</button>\n                <button id="yes-btn" class="btn btn-default">Yes</button>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="nifty-overlay"></div>';

}
return __p
};

this["NiftyTemplates"]["templates/image.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="nifty-modal">\n    <div class="nifty-content">\n        <div class="image">\n          <img src="' +
((__t = ( image )) == null ? '' : __t) +
'">\n        </div>\n    </div>\n</div>\n<div class="nifty-overlay"></div>';

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
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="nifty-modal">\n    <div class="nifty-content">\n        <h3>' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n        <div class="nifty-error">This is a test error message</div>\n        <div class="nifty-inner">\n            ';
 _.each(fields, function(field) { ;
__p += '\n                <p class="field-label">' +
((__t = ( field.label )) == null ? '' : __t) +
'</p>\n                <input type="' +
((__t = ( field.type || 'text' )) == null ? '' : __t) +
'" name="' +
((__t = ( field.name )) == null ? '' : __t) +
'" value="' +
((__t = ( field.value )) == null ? '' : __t) +
'">\n            ';
 }); ;
__p += '\n            <div class="nifty-buttons">\n                <button id="cancel-btn" class="btn btn-default">Cancel</button>\n                <button id="ok-btn" class="btn btn-default">OK</button>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="nifty-overlay"></div>';

}
return __p
};

this["NiftyTemplates"]["templates/select-one.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="nifty-modal">\n  <div class="nifty-content">\n    <h3>' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n    <div class="nifty-error"></div>\n    <div class="nifty-inner">\n      <p>' +
((__t = ( message )) == null ? '' : __t) +
'</p>\n      <select class="form-control">\n        ';

        _.each(options, function(option) {
          if (_.isString(option)) {
        ;
__p += '\n        <option>' +
((__t = ( option )) == null ? '' : __t) +
'</option>\n        ';
 } else { ;
__p += '\n        <option value="' +
((__t = ( option.value )) == null ? '' : __t) +
'">' +
((__t = ( option.label )) == null ? '' : __t) +
'</option>\n        ';
 } ;
__p += '\n\n        ';
 }); ;
__p += '\n      </select>\n      <div class="nifty-buttons">\n        <button id="cancel-btn" class="btn btn-default">Cancel</button>\n        <button id="ok-btn" class="btn btn-default">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="nifty-overlay"></div>';

}
return __p
};