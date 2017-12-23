

const icon = require('./../../assets/icon.png');

const AbstractView = require('./AbstractView');

class ProjectIssuesView extends AbstractView {

  async handle(projectSlug) {

    try {

      this.loader.show();

      let issues = await this.gitlabClient.getIssuesByProject(projectSlug);

      if (issues.length === 0) {
        this.loader.hide();
        this.display({
          title: 'No issues found',
          icon: icon
        });

        return;
      }

      issues = issues.map((issue) => {
        return {
          id: issue.id,
          icon: icon,
          title: issue.title,
          subtitle: `Created by: ${issue.author.name} // Last updated at ${issue.updated_at}`,
          onSelect: () => {
            this.actions.open(issue.web_url);
          }
        };
      });

      this.loader.hide();
      this.display(issues);

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

module.exports = ProjectIssuesView;
