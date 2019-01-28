const Octokit = require("@octokit/rest");

const octokit = new Octokit({
    auth: 'token tokenhere'
})

const GithubGraphQLApi = require("node-github-graphql");
const github = new GithubGraphQLApi({
    token: "token"
});

module.exports.getLang = async (username) => {
    try {
        let repos = await github.query(`
            {
                user(login:"${username}") {
                    name:
                        repositories(last: 100) {
                            nodes {
                                name
                                isFork
                        }
                    }
                }
            }
        `)
        
        let reposArr1 = repos.data.user.name.nodes;
        
        let newreposArr = [];
        
        for (let i = 0; i < reposArr1.length; i++) {
            if (reposArr1[i].isFork === false) {
                newreposArr.push(reposArr1[i]);
            }
        }
        
        let reposArray = newreposArr.map(v => v.name);
        
        let languagesArray1 = [];

        for (var i = 0; i < reposArray.length; i++) {
            let a = reposArray[i];
            try {
                const getLanguages = await octokit.request(`GET /repos/${username}/${a}/languages`);
                languagesArray1.push(getLanguages.data);
            } catch {

            }
        }

        let languagesArray = await languagesArray1.filter(value => Object.keys(value).length !== 0);

        let oneObject = {}

        languagesArray.forEach(function (group) {
            Object.keys(group).forEach(function (key) {
                if (oneObject[key]) {
                    oneObject[key] += group[key];
                } else {
                    oneObject[key] = group[key];
                }
            })
        });

        function sum(obj) {
            let sum = 0;
            for (var el in obj) {
                if (obj.hasOwnProperty(el)) {
                    sum += parseFloat(obj[el]);
                }
            }
            return sum;
        }

        let summed = sum(oneObject);
        let howManyKeys = Object.keys(oneObject).length;

        let unsortedArray = [];

        for (let i = 0; i < howManyKeys; i++) {
            let name = Object.keys(oneObject)[i]
            let bytes = oneObject[Object.keys(oneObject)[i]];
            let percentage1 = (bytes / summed) * 100;
            let percentage = parseFloat(Math.round(percentage1 * 100) / 100).toFixed(2);

            unsortedArray.push(`${name}: ${percentage}%`);
        }

        return unsortedArray;

    } catch {
        return "User does not exist."
    }
}