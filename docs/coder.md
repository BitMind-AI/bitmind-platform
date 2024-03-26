# Coder Docs

[https://coder.com/docs/v2/latest](https://coder.com/docs/v2/latest)

## Coder API Key

The Coder API key is used to authenticate requests to the Coder server. The API key is stored in the `profiles` table in the `public` schema of the Supabase database. Every time a JWT token is generated, the API key is added to the `app_metadata` object in the `claims` field of the token:

```json
{
  "app_metadata": {
    "api_key": "<coder_api_key>"
  }
}
```

**NOTE:** The client side uses a custom `axios` instance to add the API key to the request headers as `Coder-Session-Token`. This gets passed along with every request to the Coder server.

## Create new user

[https://coder.com/docs/v2/latest/api/users#create-new-user](https://coder.com/docs/v2/latest/api/users#create-new-user)

A Coder user can be created using the `create-coder-user` Supabase edge function. The edge function uses an environment variable `CODER_OWNER_TOKEN` to authenticate as the Coder `owner`.

The edge function creates a user based on the authorization JWT passed in the request. The user is created with the following properties:

```json
{
  "disable_login": true,
  "login_type": "none",
  "username": "<userId>.split('-')[0]",
  "email": "<email>"
}
```

**NOTE:** When creating a Coder user's `username`, a `-` character is not allowed.

## Create token API key

[https://coder.com/docs/v2/latest/api/users#create-token-api-key](https://coder.com/docs/v2/latest/api/users#create-token-api-key)

A new session token is then generated for the user and stored in the `profiles` table in the `public` schema of the Supabase database. The session token is created using the following properties:

```json
{
  "lifetime": 0,
  "scope": "all",
  "token_name": "string"
}
```

**TODO**: Check when a `lifetime` of `0` expires.
