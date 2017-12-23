

/**
 * Loader Element
 */
class Loader {
  constructor(display, hide, icon, title) {
    this.display = display;
    this.hidePl = hide;
    this.title = title;
    this.icon = icon;
  }

  show() {
    this.display({
      id: 'loader',
      title: this.title,
      icon: this.icon
    });
  }

  hide() {
    this.hidePl('loader');
  }
}

module.exports = Loader;
