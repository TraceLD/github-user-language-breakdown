use futures::TryStreamExt;
use std::collections::HashMap;
use tokio::pin;

use octocrab::{models::Repository, Octocrab, Page};

use crate::github_fetch;

#[derive(thiserror::Error, Debug)]
pub enum LangCalcError {
    #[error("GitHub API error")]
    OctocrabError(#[from] octocrab::Error),
    #[error("invalid repo object")]
    InvalidRepoObject(),
    #[error("unknown error")]
    Unknown,
}

pub async fn calculate_langs(
    crab: &Octocrab,
    start_page: Page<Repository>,
    max_pages: Option<u8>,
) -> Result<HashMap<String, i64>, LangCalcError> {
    let max_repos = max_pages.unwrap_or(5) * 100;

    let mut results: HashMap<String, i64> = HashMap::new();
    let repo_pages_stream = start_page.into_stream(crab);

    pin!(repo_pages_stream);

    let mut current_repo = 0;

    while let Some(repo) = repo_pages_stream.try_next().await? {
        if current_repo > max_repos {
            break;
        }

        if let Some(true) = repo.fork {
            continue;
        }

        let Some(repo_owner) = repo.owner.map(|x| x.login) else {
            continue;
        };

        let repo_langs = github_fetch::get_langs_for_repo(crab, repo_owner, repo.name).await?;

        for (lang, bytes) in repo_langs {
            results
                .entry(lang)
                .and_modify(|count| *count += bytes)
                .or_insert(bytes);
        }

        current_repo += 1;
    }

    Ok(results)
}
