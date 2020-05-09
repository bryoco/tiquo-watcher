# TDReader

Use [AWS SAM CLI](https://aws.amazon.com/serverless/sam/):

* `sam build`
  * Builds Lambda functions to generate artifacts that target their execution environment.
* `sam invoke local -e -`
  * This reads the `event` for `lambda_handler` from stdin, and it's expecting JSON with a key named "symbol". E.g. ```{"symbol": "X"}``` 
* `sam deploy --guided`
  * Reads from `samconfig.toml` to generate a CloudFormation stack defined in `template.yaml`  
