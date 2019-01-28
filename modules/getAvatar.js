const GithubGraphQLApi = require("node-github-graphql");
const github = new GithubGraphQLApi({
    token: "token"
});

module.exports = async (username) => {
    try {
        let getAvatar = await github.query(`
        {
            user(login:"${username}") {
                avatar:
                    avatarUrl
            }
        }
    `)
    return getAvatar.data.user.avatar
    } catch (e) {
        return e
    }
}