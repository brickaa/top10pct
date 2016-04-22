// This is where all the configuration for the project should happen. The ideal
// arrangement would keep you out of the gulpfile entirely.

var config = {};

config.deploy = {
  bucket: 'moose.texastribune.org',
  key: 'antlers',
  profile: 'newsapps'
};

config.dataFolder = './data';
config.templateFolder = './app/templates';

config.data = {
  docs: [
    {
      fileid: '1iSsqopd2QLhlQDx0gVX9rYoUp-akX1tdZMF6910BhaU',
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
      fileid: '1EAS1heGSlxEuq6Wf4y5VjaGLIp0LMH1xwnN0j8TVJIY',
      name: 'meta',
      copytext: {
        basetype: 'keyvalue'
      }
    }
  ]
};

module.exports = config;
