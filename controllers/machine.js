exports.getMachines = (req, res) => {
    res.render('account/machines', {
      title: 'Laundry Machines',
      active: { machines: true },
      machines: [
          {
              name: "Downstairs Washer",
              session: {
                  user: '5df0b098c852be6a02be7138',
                  reserved: false,
                  reservedAt: new Date(),
                  timerStartedAt: new Date()
              }
          }
      ]
    });
  };

exports.getMachine = (req, res) => {
    res.render('account/machine', {
        title: "Machine Name"
    })
}