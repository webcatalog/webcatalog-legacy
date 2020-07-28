import * as Comlink from 'comlink';

async function filterApps(apps, sortedAppIds, query) {
  const processedQuery = query.trim().toLowerCase();
  return sortedAppIds.filter((id) => {
    const app = apps[id];
    return (
      app.name.toLowerCase().includes(processedQuery)
      || app.url.toLowerCase().includes(processedQuery)
    );
  });
}

Comlink.expose(filterApps);
