use std::collections::HashMap;

use octocrab::{
    models::Repository, params::repos::Type as OrgRepoType,
    params::users::repos::Type as UserRepoType, Octocrab, Page,
};

pub type RepoLanguages = HashMap<String, i64>;

pub async fn get_repos_for_user(
    crab: &Octocrab,
    user: impl Into<String>,
) -> Result<Page<Repository>, octocrab::Error> {
    crab.users(user)
        .repos()
        .r#type(UserRepoType::Owner)
        .per_page(100)
        .send()
        .await
}

pub async fn get_repos_for_org(
    crab: &Octocrab,
    org_name: impl Into<String>,
) -> Result<Page<Repository>, octocrab::Error> {
    crab.orgs(org_name)
        .list_repos()
        .repo_type(OrgRepoType::Sources)
        .per_page(100)
        .send()
        .await
}

pub async fn get_langs_for_repo(
    crab: &Octocrab,
    repo_owner: impl Into<String>,
    repo_name: impl Into<String>,
) -> Result<RepoLanguages, octocrab::Error> {
    crab.repos(repo_owner, repo_name).list_languages().await
}
