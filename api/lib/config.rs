use std::env;

use secrecy::SecretString;

const TOKEN_ENV_VAR: &str = "GITHUB_API_TOKEN";

pub struct Config {
    pub github_token: SecretString,
}

impl Config {
    pub fn from_env() -> Result<Self, std::env::VarError> {
        let env_var_value = env::var(TOKEN_ENV_VAR)?;
        let secret_string = SecretString::from(env_var_value);

        let config = Self {
            github_token: secret_string,
        };

        Ok(config)
    }
}
