const auth = JSON.parse(localStorage.getItem('auth'))

const github = {
  client: {
    api: `https://api.github.com/`,
    options: {
      headers: {
        Accept: `application/vnd.github.v3+json`,
        Authorization: `token ${auth}`,
      },
    },
    setupRequest(endpoint, { api, options } = github.client) {
      // return a function to delay execution. fetch seemed to execute an extra
      // time during testing when it wasn't wrapped in a function
      return () => fetch(`${api}${endpoint}`, options)
        .then((res) => {
          if (res.status !== 200) {
            return Promise.reject(new Error(res.status))
          }
          return res.json()
        })
    },
    getRepos(login) {
      const request = github.client.setupRequest(`users/${login}/repos`)
      return request()
    },

    getReadMe(login, repo) {
      // make request to repos/login/repo/readme
      // then decode response.content with atob()
      const request = github.client.setupRequest(`repos/${login}/${repo}/readme`)
      return request()
        .then(res => atob(res.content))
        .catch(e => Promise.reject(new Error("Read Me not found")))
    },
    validateUser(login) {
      // make request to users/user
      const request = github.client.setupRequest(`users/${login}`)
      return request()
        .catch(e => Promise.reject(new Error("User not found")))
    },
  },
}
