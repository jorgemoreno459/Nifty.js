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
      this.render();
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
      this.onRender();
    },
    onRender: function () {
      if (this.options.contentView) {
        this.$modal.find(".nifty-content").append(this.options.contentView.el);
        this.options.contentView.render();
      } else {
        this.$modal.find(".nifty-content").append(this.options.content || "");
      }
    },
    setStyles: function () {
      this.$modal.addClass("nifty-effect-" + (this.options.effect || 1));
      if (this.options.className) {
        this.$modal.find('.nifty-content').addClass(this.options.className);
      }
    },
    centerModal: function () {
      if (parseInt(this.$modal.css('top')) > 0) {
        var marginTop = -Math.round(this.$modal.height() / 2) - 30;
        this.$modal.css('margin-top', marginTop);
      }
      var marginLeft = -Math.round(this.$modal.width() / 2);
      this.$modal.css('margin-left', marginLeft);
    },
    open: function () {
      var that = this;
      document.body.appendChild(this.el);
      this.centerModal();
      setTimeout(function () {
        that.$modal.addClass('nifty-show');
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
    setDefaults: function () {
      this.model.type = this.model.type || "text";
      this.model.value = this.model.value || "";
    },
    validate: function (value) {
      if (this.options.validate) {
        return this.options.validate(value);
      }
    },
    events: _.extend({
      "click #ok-btn": "submit",
      "click #cancel-btn": "cancelClicked"
    }, ModalView.events),
    submit: function () {
      var value = this.$el.find("input").val();
      var error = this.validate(value);
      if (!error) {
        this.hide(value);
      } else {
        this.showError(error);
      }
    },
    cancelClicked: function () {
      this.hide(false);
    },
    onshow: function () {
      this.$el.find("input").focus();
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
        modal.open();
      });
    },
    prompt: function (title, message, options) {
      options = options || {};
      options.model = {
        title: title,
        message: message
      };
      if (options.value) {
        options.model.value = options.value;
      }
      var modal = new PromptView(options);
      return new Promise(function(resolve, reject) {
        modal.once('close', function(value) {
          value ? resolve(value) : reject();
        });
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
      return modal.open();
    }
  }
})();