var Nifty = (function () {

  var vent = _.extend({}, Backbone.Events);

  $(window).keydown(function (e) {
    switch (e.which) {
      case 27:
        vent.trigger('escape', e);
        break;
      case 13:
        vent.trigger('enter', e);
        break;
    }
  });

  var template = function (name) {
    return NiftyTemplates['templates/' + name + ".html"];
  };

  var ModalView = Backbone.View.extend({
    template: template("modal"),
    events: {
      "click .nifty-overlay": "closeClicked",
      "click .nifty-close": "closeClicked"
    },
    initialize: function (options) {
      this.options = this.options || options;
      if (!this.options.ignoreEscape) {
        this.listenTo(vent, "escape", this.escapePressed);
      }
      this.setDefaults();
      this.initView();
    },
    initView: function () {
      // a placeholder for subclasses to so some initialization
    },
    setDefaults: function () {
      // a placeholder for subclasses to so set some default stuff
    },
    escapePressed: function () {
      this.hide();
    },
    closeClicked: function () {
      this.hide();
    },
    render: function () {
      this.$el.empty().append(this.template(this.model || {}));
      this.$modal = this.$el.find(".nifty-modal");
      this.setStyles();
      this.onRenderInternal();
      this.onRender();
    },
    onRenderInternal: function() {
      if (this.options.contentView) {
        this.$modal.find(".nifty-content").append(this.options.contentView.el);
        this.options.contentView.render();
        this.options.contentView.parent = this;
      } else {
        this.$modal.find(".nifty-content").append(this.options.content || "");
      }
    },
    onRender: function () {
      // a placeholder for subclasses to so something on rendering
    },
    setStyles: function () {
      this.$modal.addClass("nifty-effect-" + (this.options.effect || 1));
      if (this.options.className) {
        this.$modal.find('.nifty-content').addClass(this.options.className);
      }
    },
    centerModal: function () {
      if (parseInt(this.$modal.css('top')) > 0) {
        var topOffset = 30;
        if ($(window).height() <= 700) {
          topOffset = 0;
        }
        var marginTop = -Math.round(this.$modal.height() / 2) - topOffset;
        this.$modal.css('margin-top', marginTop);
      }
      var marginLeft = -Math.round(this.$modal.width() / 2);
      this.$modal.css('margin-left', marginLeft);
      this.$modal.css('left', '50%');
    },
    open: function () {
      var that = this;
      document.body.appendChild(this.el);
      this.centerModal();
      setTimeout(function () {
        that.$modal.addClass('nifty-show');
        that.$modal.siblings(".nifty-overlay").addClass('nifty-show');
      }, 25);
      setTimeout(function () {
        that.onshow();
        that.options.onshow && that.options.onshow();
      }, 300);
      return this;
    },
    onshow: function () {
    },
    hide: function (value) {
      var that = this;
      this.$modal.removeClass('nifty-show');
      this.$modal.siblings(".nifty-overlay").removeClass('nifty-show');
      this.options.onclose && this.options.onclose(value);
      this.trigger('close', value);
      // TODO: could be done at a more precise time - listen to animation complete event?
      setTimeout(function () {
        that.remove();
      }, 500);
    }
  });

  var LoadingView = ModalView.extend({
    template: template("loading"),
    /**
     * Hide this view either after a set amount of time passes or a Deferred promise is resolved / rejected
     * @param after A millisecond timeout or a promise object
     */
    hideAfter: function (after) {
      var hide = _.bind(this.hide, this);
      if (_.isNumber(after)) {
        setTimeout(hide, after);
      } else if (_.isFunction(after)) {
        after();
        hide();
      } else if (_.isFunction(after.done) && _.isFunction(after.fail)) {
        after.done(hide);
        after.fail(hide);
      }
    },
    setText: function (text) {
      this.$el.find(".loading").html(text);
    }
  });


  var ImageView = ModalView.extend({
    className: "nifty-image",
    template: template("image"),
    loadImage: function () {
      var that = this;
      return new Promise(function(resolve, reject) {
        var image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = that.options.model.image;
      });
    }
  });

  var AlertView = ModalView.extend({
    className: "nifty-alert",
    template: template("alert")
  });

  var ConfirmView = ModalView.extend({
    className: "nifty-confirm",
    template: template("confirm"),
    events: _.extend({
      "click #yes-btn": "yesClicked",
      "click #no-btn": "noClicked"
    }, ModalView.events),
    yesClicked: function () {
      this.hide(true);
    },
    noClicked: function () {
      this.hide(false);
    }
  });

  var PromptView = ModalView.extend({
    className: "nifty-prompt",
    template: template("prompt"),
    initView: function () {
      this.listenTo(vent, "enter", this.submit);
    },
    setDefaults: function() {
      this.model.fields = _.map(this.model.fieldInputs, function(field) {
        if (!_.isObject(field)) {
          return {label: field, name: field};
        } else {
          return field;
        }
      });
    },
    validate: function (promptData) {
      if (this.options.validate) {
        return this.options.validate(promptData);
      }
    },
    events: _.extend({
      "click #ok-btn": "submit",
      "click #cancel-btn": "cancelClicked"
    }, ModalView.events),
    submit: function () {
      var promptData = {};
      _.each(this.model.fields, function(field) {
        promptData[field.name] = $("input[name=" + field.name + "]").val();
      });
      var error = this.validate(promptData);
      if (!error) {
        this.hide(promptData);
      } else {
        this.showError(error);
      }
    },
    cancelClicked: function () {
      this.hide(false);
    },
    onshow: function () {
      this.$el.find("input").first().focus();
    },
    showError: function (error) {
      this.$el.find(".nifty-error").html(error).show();
    }
  });

  var SelectOneView = ModalView.extend({
    className: "nifty-select-one",
    template: template("select-one"),
    initView: function () {
      this.listenTo(vent, "enter", this.submit);
    },
    events: _.extend({
      "click #ok-btn": "submit",
      "click #cancel-btn": "cancelClicked"
    }, ModalView.events),
    submit: function () {
      var value = this.$el.find("select").val();
      this.hide(value);
    },
    cancelClicked: function () {
      this.hide(false);
    }
  });

  var LoginView = ModalView.extend({
    className: "nifty-login",
    template: template("login"),
    initView: function () {
      this.listenTo(vent, "enter", this.enterPressed);
    },
    events: _.extend({
      "click #login-btn": "login",
      "submit form": "formSubmitted",
      "click #cancel-btn": "cancelClicked"
    }, ModalView.events),
    formSubmitted: function (e) {
      e.preventDefault();
      this.login();
    },
    login: function () {
      if (this.options.login) {
        return this.options.login(this.credentials(), this);
      }
    },
    enterPressed: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.login();
    },
    credentials: function () {
      return {
        email: this.$el.find("[id=email]").val(),
        password: this.$el.find("[id=password]").val()
      };
    },
    cancelClicked: function (e) {
      e.preventDefault();
      this.hide(false);
    },
    onshow: function () {
      this.$el.find("[id=email]").focus();
    },
    showError: function (error) {
      this.$el.find(".nifty-error").html(error).show();
    }
  });

  var openModal = function(modal) {
    return new Promise(function(resolve) {
      modal.once('close', resolve);
      modal.render();
      modal.open();
    });
  };

  return {
    modal: function (options) {
      var modal = new ModalView(options);
      return openModal(modal);
    },
    alert: function (title, message, options) {
      options = options || {};
      options.model = {
        title: title,
        message: message
      };
      var modal = new AlertView(options);
      return openModal(modal);
    },
    confirm: function (title, message, options) {
      options = options || {};
      options.model = {
        title: title,
        message: message
      };
      var modal = new ConfirmView(options);
      return new Promise(function(resolve, reject) {
        modal.once('close', function(confirmed) {
          confirmed ? resolve() : reject();
        });
        modal.render();
        modal.open();
      });
    },
    prompt: function (title, fieldInputs, options) {
      options = options || {};
      options.model = {
        title: title,
        fieldInputs: fieldInputs
      };
      var modal = new PromptView(options);
      return new Promise(function(resolve, reject) {
        modal.once('close', function(promptData) {
          promptData ? resolve(promptData) : reject();
        });
        modal.render();
        modal.open();
      });
    },
    selectOne: function(model) {
      model.title = model.title || "";
      model.message = model.message || "";
      var modal = new SelectOneView({
        model: model
      });
      return openModal(modal);
    },
    loading: function (message, options) {
      options = options || {};
      options.effect = 7;
      options.ignoreEscape = true;
      options.model = {
        message: message
      };
      var modal = new LoadingView(options);
      modal.render();
      return modal.open();
    },
    image: function(image, options) {
      options = options || {};
      options.model = {
        image: image
      };
      var modal = new ImageView(options);
      return new Promise(function(resolve, reject) {
        modal.loadImage()
          .then(function() {
            modal.once('close', resolve);
            modal.render();
            modal.open();
          })["catch"](reject);
      });
    }
  }
})();
