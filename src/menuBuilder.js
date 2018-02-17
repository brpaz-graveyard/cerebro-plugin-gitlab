

const Constants = require('.//constants');

const buildMainMenu = (icon, settings, actions) => {
  return [
    {
      title: 'My Projects',
      subtitle: 'Show list of My Projects',
      icon: icon,
      term: `${Constants.PLUGIN_KEYWORD} ${Constants.PLUGIN_TERM_PROJECTS}`,
      onSelect: () => {
        actions.open(`${settings.baseUrl}/dashboard/projects`);
      }
    },
    {
      title: 'My Groups',
      subtitle: 'List my groups',
      icon: icon,
      term: `${Constants.PLUGIN_KEYWORD} ${Constants.PLUGIN_TERM_GROUPS}`,
      onSelect: () => {
        actions.open(`${settings.baseUrl}/dashboard/groups`);
      }
    },
    {
      title: 'My Issues',
      subtitle: 'Show list of all issues assigned to me',
      icon: icon,
      term: `${Constants.PLUGIN_KEYWORD} ${Constants.PLUGIN_TERM_ISSUES}`,
      onSelect: () => {
        actions.open(`${settings.baseUrl}/dashboard/todos?state=pending&type=Issue`);
      }
    },
    {
      title: 'My Merge Requests',
      subtitle: 'List the Merge requests assigned to me',
      icon: icon,
      term: `${Constants.PLUGIN_KEYWORD} ${Constants.PLUGIN_TERM_MR}`,
      onSelect: () => {
        actions.open(`${settings.baseUrl}/dashboard/todos?state=pending&type=MergeRequest`);
      }
    },
    {
      title: 'My Snippets',
      subtitle: 'Open Snippets in GitLab',
      icon: icon,
      onSelect: () => {
        actions.open(`${settings.baseUrl}/dashboard/snippets`);
      }
    },
    {
      title: 'Get CI YAML Templates',
      subtitle: 'Fetch the contents for a CI YAML.',
      icon: icon,
      term: `${Constants.PLUGIN_KEYWORD} ${Constants.PLUGIN_TERM_CI_TEMPLATES}`,
      onSelect: () => {
        actions.open(`${settings.baseUrl}/gitlab-org/gitlab-ci-yml`);
      }
    },
    {
      title: 'GitLab.com status',
      subtitle: 'Open GitLab.com status page',
      icon: icon,
      onSelect: () => {
        actions.open('https://status.gitlab.com');
      }
    }
  ];
};

const buildProjectMenu = (projectId, icon, settings, actions) => {
  return [
    {
      title: 'Issues',
      subtitle: 'List most recent project issues',
      icon: icon,
      term: `${Constants.PLUGIN_KEYWORD} ${Constants.PLUGIN_TERM_PROJECT} ${projectId} ${Constants.PLUGIN_TERM_PROJECT_ISSUES}`,
      onSelect: () => {
        actions.open(`${settings.baseUrl}/${projectId}/issues`);
      }
    },
    {
      title: 'Merge Requests',
      subtitle: 'List the project pending Merge Requests',
      icon: icon,
      term: `${Constants.PLUGIN_KEYWORD} ${Constants.PLUGIN_TERM_PROJECT} ${projectId} ${Constants.PLUGIN_TERM_PROJECT_MR}`,
      onSelect: () => {
        actions.open(`${settings.baseUrl}/${projectId}/merge_requests`);
      }
    },
    {
      title: 'Jobs',
      subtitle: 'Opens GitLab jobs page for this project',
      icon: icon,
      term: `${Constants.PLUGIN_KEYWORD} ${Constants.PLUGIN_TERM_PROJECT} ${projectId} ${Constants.PLUGIN_TERM_PROJECT_JOBS}`,
      onSelect: () => {
        actions.open(`${settings.baseUrl}/${projectId}/-/jobs`);
      }
    },
  ];
};


module.exports = {
  buildMainMenu,
  buildProjectMenu
};
