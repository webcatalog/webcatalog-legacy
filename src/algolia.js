import algoliasearch from 'algoliasearch';

export const client = algoliasearch('4TX8Z3FKMI', '57f6e815e97deb2cdf74f49c852bc232');
export const appsIndex = client.initIndex('apps_v2');
