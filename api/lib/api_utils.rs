use std::str::FromStr;

use http::{Response, StatusCode};

use serde::{Deserialize, Serialize};
use vercel_runtime::Body;

use crate::langs_calculator::LangCalcError;

pub use problem_details::ProblemDetails;

pub trait ErrorConverter {
    fn from_octocrab_err(err: octocrab::Error) -> Self;
    fn from_calc_err(err: LangCalcError) -> Self;
}

#[derive(Deserialize, Serialize, Clone, Default)]
pub struct ErrorsExt<T> {
    pub errors: Vec<T>,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct MissingParameterDetails {
    pub detail: String,
    pub parameter: String,
}

impl<T> ErrorsExt<T> {
    pub const fn new(errors: Vec<T>) -> Self {
        Self { errors }
    }
}

impl ErrorConverter for ProblemDetails {
    fn from_octocrab_err(err: octocrab::Error) -> Self {
        match err {
            octocrab::Error::GitHub {
                source,
                ..
            } => Self::new()
                .with_title("GitHub API Error")
                .with_status(source.status_code)
                .with_detail(source.message),

            _ => create_internal_server_err_details(),
        }
    }

    fn from_calc_err(err: LangCalcError) -> Self {
        match err {
            LangCalcError::OctocrabError(err) => {
                Self::from_octocrab_err(err)
            }

            _ => create_internal_server_err_details(),
        }
    }
}

impl MissingParameterDetails {
    pub fn new(parameter_name: impl Into<String>) -> Self {
        let parameter_string = parameter_name.into();

        Self {
            detail: format!("The query parameter {parameter_string} is required"),
            parameter: parameter_string,
        }
    }
}

pub fn missing_query_param(
    param_name: impl Into<String>,
) -> Result<Response<Body>, vercel_runtime::Error> {
    let errors = vec![MissingParameterDetails::new(param_name)];

    let details = ProblemDetails::new()
        .with_type(
            http::Uri::from_str(
                "https://problems-registry.smartbear.com/missing-request-parameter",
            )
            .unwrap(),
        )
        .with_title("Missing request parameter")
        .with_detail("The request is missing an expected query parameter.")
        .with_status(StatusCode::BAD_REQUEST)
        .with_extensions(ErrorsExt::new(errors));

    ext_problem_details(&details)
}

pub fn problem_details(problem: &ProblemDetails) -> Result<Response<Body>, vercel_runtime::Error> {
    Ok(Response::builder()
        .status(&problem.status.unwrap_or(StatusCode::INTERNAL_SERVER_ERROR))
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&problem).unwrap().into())?)
}

pub fn ext_problem_details<Ext>(
    problem: &ProblemDetails<Ext>,
) -> Result<Response<Body>, vercel_runtime::Error>
where
    Ext: Serialize,
{
    Ok(Response::builder()
        .status(&problem.status.unwrap_or(StatusCode::INTERNAL_SERVER_ERROR))
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&problem).unwrap().into())?)
}

fn create_internal_server_err_details() -> ProblemDetails {
    problem_details::ProblemDetails::from_status_code(StatusCode::INTERNAL_SERVER_ERROR)
        .with_detail("An Internal Server Error has occurred")
}
