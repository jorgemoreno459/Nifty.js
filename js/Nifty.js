var Nifty = (function () {

  var vent = _.extend({}, Backbone.Events);

  $(window).keydown(function(e) {
    if (e.which == 27) {
      vent.trigger('escape');
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
    initialize: function () {
      if (!this.options.ignoreEscape) {
        this.listenTo(vent, "escape", this.escapePressed);
      }
      this.initView();
      this.render();
    },
    initView: function() {
      // a placeholder for subclasses to so some init'in
    },
    escapePressed: function() {
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
      if (this.options.onshow) {
        setTimeout(function() {
          that.options.onshow();
        }, 500);
      }
    },
    setStyles: function () {
      this.$modal.addClass("nifty-effect-" + (this.options.effect || 1));
      if (this.options.className) {
        this.$modal.find('.nifty-content').addClass(this.options.className);
      }
    },
    open: function () {
      var that = this;
      document.body.appendChild(this.el);
      setTimeout(function () {
        that.$modal.addClass('nifty-show');
        that.onOpen();
      }, 25);
      return this;
    },
    onOpen: function () {
    },
    hide: function (value) {
      var that = this;
      this.$modal.removeClass('nifty-show');
      this.options.onclose && this.options.onclose(value);
      // TODO: could be done at a more precise time - listen to animation complete event?
      setTimeout(function () {
        that.$el.remove();
      }, 500);
    }
  });

  var LoadingView = ModalView.extend({
    template: template("loading"),
    hideAfter: function(after) {
      var hide = _.bind(this.hide, this);
      if (_.isNumber(after)) {
        setTimeout(hide, after);
      } else if (_.isFunction(after.done) && _.isFunction(after.fail)) {
        after.done(hide);
        after.fail(hide);
      }
    },
    setText: function(text) {
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
      "click .yes": "yesClicked",
      "click .no": "noClicked"
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
      this.model.type = this.model.type || "text";
    },
    validate: function (value) {
      if (this.options.validate) {
        return this.options.validate(value);
      }
    },
    events: _.extend({
      "click .ok": "okClicked",
      "click .cancel": "cancelClicked"
    }, ModalView.events),
    okClicked: function () {
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
    onOpen: function () {
      this.$el.find("input").focus();
    },
    showError: function (error) {
      this.$el.find(".nifty-error").html(error).show();
    }
  });

  return {
    modal: function (options) {
      return new ModalView(options).open();
    },
    alert: function (title, message, options) {
      options = options || {};
      options.model = {
        title: title,
        message: message
      };
      return new AlertView(options).open();
    },
    confirm: function (title, message, options) {
      options = options || {};
      options.model = {
        title: title,
        message: message
      };
      return new ConfirmView(options).open();
    },
    prompt: function (title, message, options) {
      options = options || {};
      options.model = {
        title: title,
        message: message
      };
      return new PromptView(options).open();
    },
    loading: function (message, options) {
      options = options || {};
      options.effect = 7;
      options.ignoreEscape = true;
      options.model = {
        message: message
      };
      return new LoadingView(options).open();
    }
  }
})();