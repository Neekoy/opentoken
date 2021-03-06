Self Discovery
==============

The entire API for OpenToken is self-describing because it is a Hypermedia (REST level 3) service. The starting point for all requests is the self-discovery endpoint. As is typical, our self-discovery endpoint is at the root. It returns link relations to other services available to the client.

Examples below are [simplified and formatted](example-formatting.md) for clarity. Link headers are discussed in depth [separately][Links].

Sample request:

    GET / HTTP/1.1
    Host: api.opentoken.io

Sample response:

    HTTP/1.1 204 No Content
    Link: </>; rel="up"; title="self-discovery"
    Link: </>; rel="self"
    Link: </account/{accountId}/login>; rel="service";
        profile="/schema/account/login-request.json";
        templated="true"; title="account-login"
    Link: </account/{accountId}/token{?public}>; rel="service";
        profile="/schema/account/token-create-request.json";
        templated="true"; title="account-token-create"
    Link: </healthCheck>; rel="service"; title="health-check"
    Link: </registration>; rel="service";
        profile="/schema/registration/register-request.json";
        title="registration-register"

There is no content at the root of the API, but there are links to all the services. As [mentioned elsewhere][Links], do not rely on the URIs in the API. Instead, always look up the URIs by following `Link` headers.

There are link headers to each of the following services:

* [`account-login`](account.md) - Allows the requester to authenticate themselves so API code pairs can be created.
* [`health-check`](health-check.md) - Returns a successful response when the service is running.
* [`registration-register`](registration.md) - Initiates the sign up process to create an account.

[Links]: links.md
