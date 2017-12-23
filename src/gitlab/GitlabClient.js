

const axios = require('axios');
const cachios = require('cachios');

// Cache configurations to include Headers
cachios.getCacheIdentifier = (config) => {
  return {
    method: config.method,
    url: config.url,
    params: config.params,
    data: config.data,
    headers: config.headers,
  };
};

/**
 * Client for interacting with GitLab API
 */
class GitLabClient {

  constructor() {
    this.api = cachios.create(axios.create({
      baseURL: 'https://gitlab.com/api/v4',
      timeout: 5000,
    }), {
      stdTTL: 300, // 5 minutes
      checkperiod: 60
    });
  }

  /**
   * Configure the client
   * @param {object} config Configuration object
   */
  configure(config = {}) {

    if (config.accessToken) {
      this.setAccessToken(config.accessToken);
    }

    if (config.baseUrl) {
      this.setBaseUrl(config.baseUrl);
    }
  }

  setBaseUrl(baseUrl) {
    this.api.axiosInstance.defaults.baseURL = `${baseUrl}/api/v4/`;
  }

  setAccessToken(accessToken) {
    this.api.axiosInstance.defaults.headers.common['Private-Token'] = accessToken;
  }

  /**
   * Returns the projects visible to the current user.
   */
  async getProjects(filters = {}) {

    try {

      const projects = await this.api.get('/projects', {
        params: {
          order_by: 'last_activity_at',
          simple: true,
          membership: true,
          archived: false,
          per_page: 50,
          search: filters.term ? filters.term : undefined
        },
        ttl: 7200 // 2h
      });

      return projects.data;

    } catch (error) {
      return this.handleErrors(error);
    }
  }

  /**
   * Returns the information of the current LoggedIn user.
   */
  async getUser() {

    try {

      const user = await this.api.get('/user');

      return user.data;

    } catch (error) {
      return this.handleErrors(error);
    }
  }

  /**
   * Returns a List of issues associated with the project.
   * @param {string} projectId
   */
  async getIssuesByProject(projectId) {
    try {

      const encodedProjectId = encodeURIComponent(projectId);

      const issues = await this.api.get(`/projects/${encodedProjectId}/issues`, {
        params: {
          state: 'opened',
          order_by: 'updated_at'
        }
      });

      return issues.data;

    } catch (error) {
      return this.handleErrors(error);
    }
  }

  /**
   * Returns a list of merge requests associated with a project.
   * @param {string} projectId
   */
  async getMergeRequestsByProject(projectId) {
    try {

      const encodedProjectId = encodeURIComponent(projectId);

      const mrs = await this.api.get(`/projects/${encodedProjectId}/merge_requests`, {
        params: {
          state: 'opened',
          order_by: 'updated_at'
        }
      });

      return mrs.data;

    } catch (error) {
      return this.handleErrors(error);
    }
  }

  /**
   * Returns a list of issues assigned to the specified user id.
   * @param {string} userId
   */
  async getTodos(type) {

    try {

      const todos = await this.api.get('/todos', {
        params: {
          action: 'assigned',
          state: 'pending',
          type: type
        }
      });

      return todos.data;

    } catch (error) {
      return this.handleErrors(error);
    }
  }

  /**
   * Get groups that the user belongs.
   * @return {Promise}
   */
  async getGroups() {

    try {

      const groups = await this.api.get('/groups', {
        ttl: 7200 // 2h
      });

      return groups.data;

    } catch (error) {
      return this.handleErrors(error);
    }
  }

  /**
   * Returns the latest jobs executed from a project
   * @param {string} projectId The project id
   * @return {Promise}
   */
  async getJobsByProject(projectId) {
    try {

      const jobs = await this.api.get(`/projects/${projectId}/jobs`);

      return jobs.data;

    } catch (error) {
      return this.handleErrors(error);
    }
  }

  /**
   * Returns a List of available GitLab CI Yaml templates
   */
  async getCiTemplates() {
    try {

      const templates = await this.api.get('/templates/gitlab_ci_ymls', {
        ttl: 86400 // 1d
      });

      return templates.data;

    } catch (error) {
      return this.handleErrors(error);
    }
  }

  /**
   * Returns the GitLab CI Yaml template from the specified template.
   * @param {string} key The template name
   */
  async getCiTemplate(key) {
    try {

      const template = await this.api.get(`/templates/gitlab_ci_ymls/${key}`, {
        ttl: 86400 // 1d
      });

      return template.data;

    } catch (error) {
      return this.handleErrors(error);
    }
  }

  /**
   * Handle Error responses from GitLab API
   * @param error
   */
  handleErrors(error) {

    console.error(error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('401 Unauthorized - Please check your GitLab access token is correctly configured in Plugin settings');
        default:
          throw new Error(`Error fetching information from GitLab. GitLab responded with: ${error.response.status} - ${error.response.statusText}`);
      }
    }

    throw new Error('An error ocurred with your request. Please try again later');
  }
}

module.exports = GitLabClient;
