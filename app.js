const API_BASE_URL = 'https://api.github.com';

class GithubService {
  constructor(){}

  _makeUserRepoPath(userHandle) {
    return `/users/${userHandle}/repos`
  }

  _callGithubEndpoint(path) {
    return axios(`${API_BASE_URL}${path}`)
  }

  async getGithubData(userHandle) {
    let path = this._makeUserRepoPath(userHandle);
    let { data } = await this._callGithubEndpoint(path);
    return data.data;
  }
}

class View {
  _renderGithubRepo(github) {
    // TODO make a new template
    return $(`
     <li class="github-repo-list-item">
         <h2>${githubRepo.name}</h2>
         <a href="${githubRepo.html_url}">${github.html_url}</a>
     </li>
  `)
  }

  _renderGithubList(githubData) {
    return githubData.map(g => this._renderGithubRepo(g))
  }

  _appendGithubRepoList(githubHtml) {
    $('.js-github-repo-list').append(githubHtml)
  }

  displayGithubearchResutls(githubData) {
    const githubHtml = this._renderGithubList(githubData);
    this._appendGithubRepoList(githubHtml);
  }

  bindGithubSearchSubmit(handler) {
    $('.js-github-form').submit((e) => {
      e.preventDefault();

      const userHandle = $('.js-userhandle-input').val();
      $('.js-github-list').empty();
      handler(userHandle);
    })
  }
}

class Controller {
  constructor() {
    this.view = new View();
    this.gs = new GithubService();
    this.view.bindGithubSearchSubmit(this.fetchGithubDataAndRenderResults.bind(this));
  }

  async fetchGithubDataAndRenderResults(userHandle) {
    const githubData = await this.gs.getGithubData(userHandle);
    this.view.displayGithubearchResutls(githubData);
  }
}

$(() => {
  const app = new Controller();
});

