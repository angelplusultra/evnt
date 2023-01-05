const controller = {
  GetEvents: (req, res) => {
    res.send('Get Events');
  },
  GetActivity: (req, res) => {
    res.send('Get Activity');
  },
  FollowUser: (req, res) => {
    res.send('Follow User');
  },
  CreateEvent: (req, res) => {
    res.send('Create Event');
  },

};

export default controller;
