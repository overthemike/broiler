var broiler = require('broiler');

broiler.save('react-redux', 'git@github.com:davezuko/react-redux-starter-kit.git')
.then(function(){
  broiler.install('react-redux', 'example');
}).catch(function(err){
  console.error(err);
});
