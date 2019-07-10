import Parse from 'parse';

const InstallAppMixin = {
  installApp(id) {
    const url = 'https://www.getwebstore.io/web-app/' + id;
    OpenUrlExt.open(url, () => {
  		Parse.Cloud.run('increaseInstallCount', { id });
  	});
	}
};
export default InstallAppMixin;
