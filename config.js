// This is where all the configuration for the project should happen. The ideal
// arrangement would keep you out of the gulpfile entirely.

var config = {};

config.deploy = {
  bucket: 'moose.texastribune.org',
  key: 'top10',
  profile: 'newsapps'
};

config.dataFolder = './data';
config.templateFolder = './app/templates';

config.data = {
  docs: [
    {
      fileid: '1ehh3ISrwq5lHNQS-eEs_i30Wi7UAF9txWgYTo56NFBI',
      name: 'test'
    },
    {
      fileid: '1K8lpUd7bbprtR1It89CGEphItUiw8HMuaStxkvTCHNw',
      name: 'story_two'
    },
    {
      fileid: '1pvIa8mFx0z1wqSjrtCo1ZUwSHs7KFIjDYiElkiRWVwo',
      name: 'story_three'
    }
  ],
  sheets: [
    {
      fileid: '1fED8tkWrmr-BbjjEDiP6ZqIb49vTck73Q_nGo6wTMmE',
      name: 'meta',
      copytext: {
        basetype: 'keyvalue'
      }
    }
  ]
};

module.exports = config;
