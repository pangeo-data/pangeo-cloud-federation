# Auth0 configuration

This folder contains instructions on setting up Auth0 for pangeo user management. Auth0 'rules' are javascript functions that run when a user logs in to a pangeo hub. Currently we use them to check the GitHub Organizations and teams that a user belongs to, and grant access accordingly. The order that rules run in matters. Environment variables must be set under both 'Rules' and per 'Application' (under 'advanced settings')

## Setup
Comments in the rules describe necessary configuration. In brief, you need a 'Regular Web Application' per hub, and a single 'Machine to Machine' auth0 management app that rules use to modify user metadata.

## Environment Variables
Under 'Rules' in the Auth0 dashboard you'll need:
AUTH0_DOMAIN_NAME=xxx
MANAGEMENT_CLIENT_ID=xxx
MANAGEMENT_CLIENT_SECRET=xxx

Under Application Advanced Settings you'll optionally need the following. **If these values are not set, any github user can log in**:
(for example `us-central1-b.gcp.pangeo.io` application)
REQUIRED_GITHUB_ORGS=pangeo-data
REQUIRED_GITHUB_TEAMS=pangeo-data/us-central1-b-gcp
