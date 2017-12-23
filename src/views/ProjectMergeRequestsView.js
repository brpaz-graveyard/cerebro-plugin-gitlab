

const icon = require('./../../assets/icon.png');

const AbstractView = require('./AbstractView');

class ProjectMergeRequestsView extends AbstractView {

  async handle(projectID) {

    try {

      this.loader.show();

      let mrs = await this.gitlabClient.getMergeRequestsByProject(projectID);

      if (mrs.length === 0) {
        this.loader.hide();
        this.display({
          title: 'No merge requests found',
          icon: icon
        });

        return;
      }

      mrs = mrs.map((mr) => {
        return {
          id: mr.id,
          icon: icon,
          title: `[${mr.source_branch} -> ${mr.target_branch}] - ${mr.title}`,
          subtitle: `Author: ${mr.author.name} // Last updated: ${mr.updated_at}`,
          onSelect: () => {
            this.actions.open(mr.web_url);
          }
        };
      });

      this.loader.hide();
      this.display(mrs);

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

module.exports = ProjectMergeRequestsView;
