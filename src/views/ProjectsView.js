

const icon = require('./../../assets/icon.png');
const Constants = require('../constants');

const AbstractView = require('./AbstractView');

class ProjectsView extends AbstractView {

  async handle(term) {

    try {

      this.loader.show();

      let projects = await this.gitlabClient.getProjects({
        term: term
      });

      if (projects.length === 0) {
        this.loader.hide();
        this.display({
          title: 'No projects found matching your criteria',
          icon: icon
        });

        return;
      }

      projects = projects.map((project) => {
        return {
          id: project.id,
          icon: icon,
          title: project.path_with_namespace,
          subtitle: project.description,
          term: `${Constants.PLUGIN_KEYWORD} ${Constants.PLUGIN_TERM_PROJECT} ${project.path_with_namespace}`,
          onSelect: () => {
            this.actions.open(project.web_url);
          }
        };
      });

      this.loader.hide();
      this.display(projects);

    } catch (err) {
      this.loader.hide();
      this.display({
        title: 'An Error occurred during your request',
        subtitle: err.message,
        icon: icon
      });
    }
  }
}

module.exports = ProjectsView;
