

const icon = require('./../../assets/icon.png');

const AbstractView = require('./AbstractView');

class GroupsView extends AbstractView {

  async handle() {

    try {

      this.loader.show();

      let groups = await this.gitlabClient.getGroups();

      if (groups.length === 0) {
        this.loader.hide();
        this.display({
          title: 'No groups found',
          icon: icon
        });

        return;
      }

      groups = groups.map((group) => {
        return {
          id: groups.id,
          icon: icon,
          title: group.name,
          subtitle: group.description,
          onSelect: () => {
            this.actions.open(group.web_url);
          }
        };
      });

      this.loader.hide();
      this.display(groups);

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

module.exports = GroupsView;
