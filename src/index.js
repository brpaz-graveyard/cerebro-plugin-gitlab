const Constants = require('./constants');

const icon = require('../assets/icon.png');
const GitLabClient = require('./gitlab/GitlabClient');

// Load view handlers.
const ProjectsView = require('./views/ProjectsView');
const ProjectMRView = require('./views/ProjectMergeRequestsView');
const GroupsView = require('./views/GroupsView');
const MyIssuesView = require('./views/MyIssuesView');
const MyMergeRequestsView = require('./views/MyMergeRequestsView');
const MenuBuilder = require('./menuBuilder');
const ProjectIssuesView = require('./views/ProjectIssuesView');
const CiTemplatesView = require('./views/CiTemplatesVIew');

const gitlab = new GitLabClient();

const plugin = ({ term, display, hide, actions, settings }) => {
  const match = term.match(Constants.PLUGIN_REGEX);

  if (match) {

    gitlab.configure(settings);

    // Split the term into parts.
    const termParts = match[1].trim().split(' ');

    let searchTerm = '';
    let view = '';

    // termParts[0] will contain the main category term (Ex: projects, issues, groups etc)
    switch (termParts[0]) {

      // Ex: lab projects <search>
      case Constants.PLUGIN_TERM_PROJECTS:
        termParts.shift();
        searchTerm = termParts.join(' ');
        view = new ProjectsView(gitlab, display, hide, actions);
        view.handle(searchTerm)
        break;

      // Single project display (Ex: lab project 1234 <category)
      case Constants.PLUGIN_TERM_PROJECT:
        if (termParts[1]) {
          switch (termParts[2]) {
            case Constants.PLUGIN_TERM_PROJECT_ISSUES:
              view = new ProjectIssuesView(gitlab, display, hide, actions);
              view.handle(termParts[1]);
              break;
            case Constants.PLUGIN_TERM_PROJECT_MR:
              view = new ProjectMRView(gitlab, display, hide, actions);
              view.handle(termParts[1]);
              break;
            default:
              display(MenuBuilder.buildProjectMenu(termParts[1], icon, actions, settings));
              break;
          }
        }
        break;
      case Constants.PLUGIN_TERM_GROUPS:
        view = new GroupsView(gitlab, display, hide, actions);
        view.handle();
        break;
      case Constants.PLUGIN_TERM_ISSUES:
        view = new MyIssuesView(gitlab, display, hide, actions);
        view.handle();
        break;
      case Constants.PLUGIN_TERM_MR:
        view = new MyMergeRequestsView(gitlab, display, hide, actions);
        view.handle();
        break;
      case Constants.PLUGIN_TERM_CI_TEMPLATES:
        view = new CiTemplatesView(gitlab, display, hide, actions);

        // its a show
        if (termParts[1]) {
          view.handleSingle(termParts[1]);
        } else {
          view.handle();
        }

        break;
      default:
        display(MenuBuilder.buildMainMenu(icon, settings, actions));
        break;
    }
  }
};

module.exports = {
  fn: plugin,
  name: Constants.PLUGIN_NAME,
  keyword: Constants.PLUGIN_KEYWORD,
  icon,
  settings: {
    accessToken: { type: 'string' },
    baseUrl: {
      type: 'string',
      defaultValue: 'https://gitlab.com'
    }
  }
};
