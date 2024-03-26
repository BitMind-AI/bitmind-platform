# Supabase Docs

## Auth Hooks (Beta)

Create a function to add custom claims to the JWT token:

- Name: `custom_access_token_hook`
- Schema: `public`
- Return type: `jsonb`
- Arguments: `event` (jsonb)
- Security: `Invoker`
- Definition:

```sql
DECLARE
    claims jsonb;
    api_key text;
BEGIN
    -- Retrieve the coder_api_key from the profiles table
    SELECT coder_api_key
    INTO api_key
    FROM public.profiles
    WHERE id = (event->>'user_id')::uuid;

    -- Proceed only if api_key is not null
    IF api_key IS NOT NULL THEN
        -- Retrieve existing claims from the event
        claims := event->'claims';

        -- Check if 'app_metadata' exists in claims
        IF jsonb_typeof(claims->'app_metadata') IS NULL THEN
            -- If 'app_metadata' does not exist, create an empty object
            claims := jsonb_set(claims, '{app_metadata}', '{}');
        END IF;

        -- Set a claim of 'api_key'
        claims := jsonb_set(claims, '{app_metadata, api_key}', to_jsonb(api_key));

        -- Update the 'claims' object in the original event
        event := jsonb_set(event, '{claims}', claims);
    END IF;

    -- Return the modified or original event
    RETURN event;
END;
```

Then, add a hook for `Customize Access Token (JWT) Claims` in the Supabase dashboard:

- Schema: `public`
- Function: `custom_access_token_hook`
- Enable hook: `true`

Create a new policy that allows the `supabase_auth_admin` role to access the `profiles` table:

```sql
CREATE POLICY profiles_rls_policy
ON public.profiles
FOR ALL
TO supabase_auth_admin
USING (true);
```
