var Nifty = (function() {

  var template = function(name) {
    return NiftyTemplates['templates/' + name + ".html"];
  };

  var ModalView = Backbone.View.extend({
    template: template("modal"),
    events: {
      "click .md-overlay":"closeClicked",
      "click .md-close":"closeClicked"
    },
    initialize: function() {
      this.render();
    },
    closeClicked: function() {
      this.hide();
    },
    render: function() {
      this.$el.empty().append(this.template(this.model || {}));
      this.$modal = this.$el.find(".md-modal");
      this.setStyles();
      this.onRender();
    },
    onRender: function() {
      this.$modal.find(".md-content").append(this.options.content || "");
    },
    setStyles: function() {
      this.$modal.addClass("md-effect-" + (this.options.effect || 1));
      if (this.options.className) {
        this.$modal.find('.md-content').addClass(this.options.className);
      }
    },
    open: function() {
      var that = this;
      document.body.appendChild(this.el);
      setTimeout(function() {
        that.$modal.addClass('md-show');
      }, 0);
    },
    hide: function() {
      var that = this;
      this.$modal.removeClass('md-show');
      this.options.onclose && this.options.onclose();
      // TODO: could be done at a more precise time - listen to animation complete event?
      setTimeout(function() {
        that.$el.remove();
      }, 1000);
    }
  });

  var AlertView = ModalView.extend({
    template: template("alert")
  });

  return {
    modal: function(options) {
      new ModalView(options).open();
    },
    alert: function(title, message, options) {
      options = options || {};
      options.model = {
        title: title,
        message: message
      };
      new AlertView(options).open();
    }
  }
})();