use gulb_backend::api_utils::missing_query_param;
use gulb_backend::api_utils::{problem_details, ErrorConverter};
use gulb_backend::config::Config;
use gulb_backend::github_fetch::{get_repos_for_org, get_repos_for_user};
use gulb_backend::langs_calculator::calculate_langs;

use octocrab::Octocrab;
use problem_details::ProblemDetails;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::LazyLock;
use vercel_runtime::run;
use vercel_runtime::{http::ok, Body, Error, Request, Response};

static CRAB: LazyLock<Octocrab> = LazyLock::new(|| {
    Octocrab::builder()
        .personal_token(Config::from_env().unwrap().github_token)
        .build()
        .unwrap()
});

#[derive(Default, Deserialize)]
struct GetUserLangsReqParams {
    name: Option<String>,
    #[serde(rename = "isorg")]
    is_org: Option<String>,
}

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
    let query_str = req.uri().query().unwrap_or("");
    let request_params: GetUserLangsReqParams = serde_urlencoded::from_str(query_str).unwrap_or_default();

    let Some(name) = request_params.name else {
        return missing_query_param("name");
    };

    let repos = if request_params.is_org.is_some() {
        get_repos_for_org(&CRAB, &name).await
    } else {
        get_repos_for_user(&CRAB, &name).await
    };

    match repos {
        Ok(repos) => match calculate_langs(&CRAB, repos, Option::default()).await {
            Ok(langs) => {
                let res = GetUserLangsResponse {
                    name,
                    langs,
                };

                ok(&res)
            }
            Err(err) => problem_details(&ProblemDetails::from_calc_err(err)),
        },
        Err(err) => problem_details(&ProblemDetails::from_octocrab_err(err)),
    }
}
