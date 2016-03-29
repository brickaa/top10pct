// This is where all the configuration for the project should happen. The ideal
// arrangement would keep you out of the gulpfile entirely.

var config = {};

config.deploy = {
  bucket: 'apps.texastribune.org',
  key: 'price-of-admission',
  profile: 'newsapps'
};

config.dataFolder = './data';
config.templateFolder = './app/templates';

config.data = {
  docs: [
    {
      fileid: '1ehh3ISrwq5lHNQS-eEs_i30Wi7UAF9txWgYTo56NFBI',
      name: 'story_one'
    },
    {
      fileid: '1K8lpUd7bbprtR1It89CGEphItUiw8HMuaStxkvTCHNw',
      name: 'story_two'
    },
    {
      fileid: '1pvIa8mFx0z1wqSjrtCo1ZUwSHs7KFIjDYiElkiRWVwo',
      name: 'story_three'
    },
    {
      fileid: '1FlyWDzlnqPeQmh5M9cHwcCMvr85zfqdNwOIwiU1EoMQ',
      name: 'interactive'
    },
    {
      fileid: '1N6-HpWvwgLrDaLsMsmf9gC-0J4zS9NbDASqGdlqs9M8',
      name: 'podcast'
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
