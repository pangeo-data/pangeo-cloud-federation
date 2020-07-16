# Auth0

Pangeo JupyterHubs use [Auth0](https://auth0.com) to manage user authentication and metadata (name, email, login location, github organizations, github teams). 

## Setup
In brief, under the Auth0 Pangeo Account we have one 'Regular Web Application' per JupyterHub, and a single 'Machine to Machine' management app needed to modify Auth0 user metadata. Auth0 'Rules' are javascript functions that run when a user logs in to a Pangeo JupyterHub. Currently we use them to check the GitHub Organizations and GitHub Teams that a user belongs to, and grant access based on membership. The order that Rules run in matters. Environment variables must be set under both 'Rules' and per 'Application' (under 'advanced settings')


### Regular Web Application 
Under 'Settings' tab:
- Name: `us-central1-b.gcp.pangeo.io` 
- Allowed Callback URLs: `https://us-central1-b.gcp.pangeo.io/hub/oauth_callback`
- record ID and SECRET to use in JupyterHub config

Optionally restrict access to specific GitHub Orgs and Teams **If these values are not set, any github user can log in**

- Under 'Application Settings', 'Show Advanced Settings', 'Application Metadata':
REQUIRED_GITHUB_ORGS=pangeo-data
REQUIRED_GITHUB_TEAMS=pangeo-data/us-central1-b-gcp


### Connect to GitHub
https://auth0.com/docs/connections/social/github 
- Under Auth0 'Connections' 'Create Connection' --> 'GitHub'
- Settings: bes sure to check `read:org` scope for Rules


### Machine to Machine ('Management Client')
You have to create an Management API Application with proper scope to allow Rules to modify Auth0 metadata. 

- Go to Applications, create new application
- Name: Auth0 Management API
- Type: Machine to Machine App
- Select API: Auth0 Management API
- Go to Application settings, you'll find your ID and SECRET (to use as Rules Environment Variables)

## Rules
The javascript code for each Rule code is stored in this sufolder. In addition under Auth0 'Rules' 'Settings' add the following
- AUTH0_DOMAIN_NAME=pangeo.auth0.com
- MANAGEMENT_CLIENT_ID=xxxxxxxxx
- MANAGEMENT_CLIENT_SECRET=xxxxxxxxxx


