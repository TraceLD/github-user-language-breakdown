use octocrab::Octocrab;

use std::sync::LazyLock;

pub mod api_utils;
pub mod github_auth;
pub mod github_fetch;
pub mod langs_calculator;

pub static CRAB: LazyLock<Octocrab> = LazyLock::new(|| {
    Octocrab::builder()
        .personal_token(crate::github_auth::get_gh_token().unwrap())
        .build()
        .unwrap()
});
