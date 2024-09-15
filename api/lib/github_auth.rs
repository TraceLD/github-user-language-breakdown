use std::env;

use anyhow::{Context, Result};
use secrecy::SecretString;

const TOKEN_ENV_VAR: &str = "GITHUB_API_TOKEN";

pub fn get_gh_token() -> Result<SecretString> {
    let env_var_value = env::var(TOKEN_ENV_VAR)
        .with_context(|| format!("Failed to read environment variable {}", TOKEN_ENV_VAR))?;

    let secret_string = SecretString::try_from(env_var_value)
        .context("Failed to convert token string value into a secret string.")?;

    Ok(secret_string)
}
