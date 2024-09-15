use std::str::FromStr;

use http::{Response, StatusCode};

pub use problem_details::ProblemDetails;
use serde::Serialize;
use vercel_runtime::Body;

#[derive(serde::Serialize)]
pub struct ErrorsExt<T> {
    errors: Vec<T>,
}

impl<T> ErrorsExt<T> {
    pub fn new(errors: Vec<T>) -> Self {
        Self { errors }
    }
}

#[derive(serde::Serialize)]
pub struct MissingParameterDetails {
    detail: String,
    parameter: String,
}

impl MissingParameterDetails {
    pub fn new(parameter_name: impl Into<String>) -> Self {
        let parameter_string = parameter_name.into();

        MissingParameterDetails {
            detail: format!("The query parameter {} is required", parameter_string),
            parameter: parameter_string,
        }
    }
}

pub trait ErrorConverter {
    fn from_octocrab_err(err: octocrab::Error) -> Self;
    fn from_calc_err(err: crate::langs_calculator::LangCalcError) -> Self;
}

impl ErrorConverter for ProblemDetails {
    fn from_octocrab_err(err: octocrab::Error) -> Self {
        match err {
            octocrab::Error::GitHub {
                source,
                backtrace: _,
            } => problem_details::ProblemDetails::new()
                .with_title("GitHub API Error")
                .with_status(source.status_code)
                .with_detail(source.message),

            _ => create_internal_server_err_details(),
        }
    }

    fn from_calc_err(err: crate::langs_calculator::LangCalcError) -> Self {
        match err {
            crate::langs_calculator::LangCalcError::OctocrabError(err) => {
                Self::from_octocrab_err(err)
            }

            _ => create_internal_server_err_details(),
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

pub fn create_internal_server_err_details() -> ProblemDetails {
    problem_details::ProblemDetails::from_status_code(StatusCode::INTERNAL_SERVER_ERROR)
        .with_detail("An Internal Server Error has occurred")
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
