#!/usr/bin/env python3
'''
Add Users to Pangeo-data/TEAMs for JupyterHub Access

Usage: python3 update_membership.py aws-uswest2

GitHub Team --> JupyterHub Access:
us-central1-b-gcp: us-central1-b.gcp.pangeo.io
aws-uswest2:       aws-uswest2.pangeo.io

http://pangeo.io/cloud.html

'''

import os
import requests
import pandas as pd
import gspread
import sys

apiurl = 'https://api.github.com'
username = 'pangeobot'
# pangeo-data org secret https://github.com/organizations/pangeo-data/settings/secrets
token = os.environ['PANGEOBOT_TOKEN']

# Eventually try out SOPS to encrypt pangeo-gdrive-service-account.json and store in REPO
# For now, follow https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#limits-for-secrets

def get_registered_members(cluster='aws-uswest2.pangeo.io'):
    ''' Read Google Sheet containing cluster access requests '''

    # Authentication handled with SOPS
    gc = gspread.service_account(filename='./pangeo-gdrive-service-account.json')

    key = '1tNgwLt4mUmxgXJWiQQ0HLKDgLHXouAsCePJCisHW0tE' # Google Sheet ID
    sh = gc.open_by_key(key)
    worksheet = sh.get_worksheet(0)
    df = pd.DataFrame(worksheet.get_all_records())
    df = df[df['Clusters'].str.contains(cluster)]
    registered_members = df['GitHub Username'].to_list()
    registered_members.sort()

    return registered_members


def get_current_members(team='aws-uswest2'):
    ''' Use GitHub API for current team membership '''

    endpoint = f'orgs/pangeo-data/teams/{team}/members'
    url = f'{apiurl}/{endpoint}'
    params = dict(per_page=100)
    response = requests.get(url, params=params, auth=(username,token))
    result = response.json()

    # Iterate over paginated response
    while 'next' in response.links.keys():
        response = requests.get(response.links['next']['url'], params=params, auth=(username,token))
        result.extend(response.json())

    current_members = [user['login'] for user in result]
    current_members.sort()

    return current_members


def add_new_members(new_members, team='aws-uswest2'):
    ''' Use GitHub API to add new users to team'''

    for user in new_members:
        endpoint = f'orgs/pangeo-data/teams/{team}/memberships/{user}'
        url = f'{apiurl}/{endpoint}'
        result = requests.put(url, auth=(username,token))
        print(result.json())


def main():
    team = sys.argv[1]
    mapping = {'us-central1-b-gcp': 'us-central1-b.gcp.pangeo.io',
                    'aws-uswest2': 'aws-uswest2.pangeo.io'}
    cluster = mapping[team]

    registered_members = get_registered_members(cluster)
    current_members = get_current_members(team)

    new_members = set(registered_members) - set(current_members)

    #print(f'{len(registered_members)} registered_members:',registered_members,'\n')
    #print(f'{len(current_members)} current_members:',current_members,'\n')
    print(f'{len(new_members)} new_members:', new_members,'\n')
    add_new_members(new_members, team)



if __name__ == "__main__":
    main()
