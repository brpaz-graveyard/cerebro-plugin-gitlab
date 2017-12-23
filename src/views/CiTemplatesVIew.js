

const icon = require('./../../assets/icon.png');

const AbstractView = require('./AbstractView');
const Constants = require('../constants');

/**
 * View that displays the Available GitLab CI YML templates
 */
class CiTemplatesView extends AbstractView {

  async handle() {

    try {

      this.loader.show();

      let templates = await this.gitlabClient.getCiTemplates();

      if (templates.length === 0) {
        this.loader.hide();
        this.display({
          title: 'No Yamls found',
          icon: icon
        });

        return;
      }

      templates = templates.map((template) => {
        return {
          icon: icon,
          title: template.name,
          term: `${Constants.PLUGIN_KEYWORD} citemplates ${template.name}`
        };
      });

      this.loader.hide();
      this.display(templates);

    } catch (err) {
      this.loader.hide();
      this.display({
        title: 'An Error occurred during your request',
        subtitle: err.message,
        icon: icon
      });
    }
  }

  /**
   * Handle single template view
   * @param {string} key The template name
   */
  async handleSingle(key) {

    try {

      this.loader.show();

      let template = await this.gitlabClient.getCiTemplate(key);

      if (template.length === 0) {
        this.loader.hide();
        this.display({
          title: `No template found for ${template}`,
          icon: icon
        });

        return;
      }

      const result = {
        title: template.name,
        icon: icon,
        clipboard: template.content,
        onSelect: () => {
          this.actions.copyToClipboard(template.content);
        },
        getPreview: () => {
          return template.content.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
      };

      this.loader.hide();
      this.display(result);

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

module.exports = CiTemplatesView;
