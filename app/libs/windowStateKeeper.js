const path=require('path'),electron=require('electron'),jsonfile=require('jsonfile'),mkdirp=require('mkdirp'),deepEqual=require('deep-equal');module.exports=(a)=>{function b(t){return!t.isMaximized()&&!t.isMinimized()&&!t.isFullScreen()}function c(){return n&&void 0!==n.x&&void 0!==n.y&&void 0!==n.width&&void 0!==n.height}function e(t){const u=t||o;if(u){const v=u.getBounds();b(u)&&(n.x=v.x,n.y=v.y,n.width=v.width,n.height=v.height),n.isMaximized=u.isMaximized(),n.isFullScreen=u.isFullScreen(),n.displayBounds=m.getDisplayMatching(v).bounds}}function f(t){t&&e(t);try{mkdirp.sync(path.dirname(s)),jsonfile.writeFileSync(s,n)}catch(u){}}function g(){clearTimeout(p),p=setTimeout(e,q)}function h(){e()}function i(){j(),f()}function j(){o&&(o.removeListener('resize',g),o.removeListener('move',g),clearTimeout(p),o.removeListener('close',h),o.removeListener('closed',i),o=null)}const{app:l,screen:m}=electron;let n,o,p;const q=100,r=Object.assign({file:`window-state-${a.id}.json`,path:l.getPath('userData'),maximize:!0,fullScreen:!0},a),s=path.join(r.path,r.file);try{n=jsonfile.readFileSync(s)}catch(t){}return function(){const t=n&&(c()||n.isMaximized||n.isFullScreen);if(!t)return void(n=null);if(c()&&n.displayBounds){const u=m.getDisplayMatching(n).bounds,v=deepEqual(n.displayBounds,u,{strict:!0});v||(u.width<n.displayBounds.width&&(n.x>u.width&&(n.x=0),n.width>u.width&&(n.width=u.width)),u.height<n.displayBounds.height&&(n.y>u.height&&(n.y=0),n.height>u.height&&(n.height=u.height)))}}(),n=Object.assign({width:r.defaultWidth||800,height:r.defaultHeight||600},n),{get x(){return n.x},get y(){return n.y},get width(){return n.width},get height(){return n.height},get isMaximized(){return n.isMaximized},get isFullScreen(){return n.isFullScreen},saveState:f,unmanage:j,manage:function(t){r.maximize&&n.isMaximized&&t.maximize(),r.fullScreen&&n.isFullScreen&&t.setFullScreen(!0),t.on('resize',g),t.on('move',g),t.on('close',h),t.on('closed',i),o=t}}};