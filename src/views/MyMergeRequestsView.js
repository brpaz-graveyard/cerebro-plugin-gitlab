

const icon = require('./../../assets/icon.png');

const TodoType = require('../gitlab/TodoType');
const AbstractView = require('./AbstractView');

class MyMergeRequestsView extends AbstractView {

  async handle() {

    try {

      this.loader.show();

      let todos = await this.gitlabClient.getTodos(TodoType.MERGE_REQUEST);

      if (todos.length === 0) {
        this.loader.hide();
        this.display({
          title: 'No assigned TODOs',
          icon: icon
        });

        return;
      }

      todos = todos.map((todo) => {
        return {
          id: todo.id,
          icon: icon,
          title: todo.body,
          subtitle: todo.project.name,
          onSelect: () => {
            this.actions.open(todo.target_url);
          }
        };
      });

      this.loader.hide();
      this.display(todos);

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

module.exports = MyMergeRequestsView;
