

const icon = require('./../../assets/icon.png');
const Loader = require('../Loader');

class AbstractView {
  constructor(gitlabClient, display, hide, actions) {
    if (new.target === AbstractView) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }

    this.gitlabClient = gitlabClient;
    this.display = display;
    this.actions = actions;
    this.loader = new Loader(display, hide, icon, 'Loading');
  }
}

module.exports = AbstractView;
