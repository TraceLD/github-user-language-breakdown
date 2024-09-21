use gulb_backend::api_utils::missing_query_param;
use gulb_backend::api_utils::{problem_details, ErrorConverter};
use gulb_backend::config::Config;
use gulb_backend::github_fetch::{get_repos_for_org, get_repos_for_user};
use gulb_backend::langs_calculator::calculate_langs;

use octocrab::Octocrab;
use problem_details::ProblemDetails;
use serde::Serialize;
use std::collections::HashMap;
use std::sync::LazyLock;
use url::Url;
use vercel_runtime::run;
use vercel_runtime::{http::ok, Body, Error, Request, Response};

const NAME_PARAM: &str = "name";
const IS_ORG_PARAM: &str = "isorg";

static CRAB: LazyLock<Octocrab> = LazyLock::new(|| {
    Octocrab::builder()
        .personal_token(Config::from_env().unwrap().github_token)
        .build()
        .unwrap()
});

#[derive(Serialize)]
struct GetUserLangsResponse {
    name: String,
    langs: HashMap<String, i64>,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let parsed_url = Url::parse(&req.uri().to_string()).unwrap();
    let hash_query: HashMap<String, String> = parsed_url.query_pairs().into_owned().collect();

    let Some(name) = hash_query.get(NAME_PARAM) else {
        return missing_query_param(NAME_PARAM);
    };

    let repos = if let Some(_) = hash_query.get(IS_ORG_PARAM) {
        get_repos_for_org(&*CRAB, name).await
    } else {
        get_repos_for_user(&*CRAB, name).await
    };

    match repos {
        Ok(repos) => match calculate_langs(&*CRAB, repos, Option::default()).await {
            Ok(langs) => {
                let res = GetUserLangsResponse {
                    name: name.to_string(),
                    langs,
                };

                ok(&res)
            }
            Err(err) => problem_details(&ProblemDetails::from_calc_err(err)),
        },
        Err(err) => problem_details(&ProblemDetails::from_octocrab_err(err)),
    }
}
