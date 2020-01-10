const Group = require('../models/Group');
var ObjectId = require('mongodb').ObjectID;



exports.getMachines = (req, res) => {
    res.render('account/machines', {
      title: 'Machines',
      active: { machines: true }
    });
  };

exports.getMachine = (req, res) => {
Group.findOne({
    "sets.groups.machines._id": ObjectId(req.params.machineID)
}, {
"sets.groups.machines.$._id": 1
}, function(err, results) {
    if (err) {
    res.send(err);
    } else {
    if(req.params.machineID === '5e17f7ed72d7dfb65f94a012') {
    // floor 2 washer 1
    res.render('account/machine', {
        machine: results.toObject().sets[0].groups[0].machines[0],
        title: results.toObject().sets[0].groups[0].machines[0].name
    })
    }
    if(req.params.machineID === '5e17fa9172d7dfb65f94a018') {
    // floor 2 washer 2
    res.render('account/machine', {
        machine: results.toObject().sets[0].groups[0].machines[1],
        title: results.toObject().sets[0].groups[0].machines[1].name
    })
    }
    if(req.params.machineID === '5e17f83372d7dfb65f94a014') {
    // floor 2 dryer 1
    res.render('account/machine', {
        machine: results.toObject().sets[0].groups[1].machines[0],
        title: results.toObject().sets[0].groups[1].machines[0].name
    })
    }
    if(req.params.machineID === '5e17fb9872d7dfb65f94a019') {
    // floor 2 dryer 2
    res.render('account/machine', {
        machine: results.toObject().sets[0].groups[1].machines[1],
        title: results.toObject().sets[0].groups[1].machines[1].name
    })
    }
    if(req.params.machineID === '5e17f85d72d7dfb65f94a015') {
    // floor 1 washer 1
    res.render('account/machine', {
        machine: results.toObject().sets[0].groups[0].machines[0],
        title: results.toObject().sets[0].groups[0].machines[0].name
    })
    }
    if(req.params.machineID === '5e17f90b72d7dfb65f94a016') {
    // floor 1 dryer 1
    res.render('account/machine', {
        machine: results.toObject().sets[0].groups[1].machines[0],
        title: results.toObject().sets[0].groups[1].machines[0].name
    })
    }
    }
})
}


exports.postMachine = (req, res) => {
    // console.log(req.user.name);
    console.log('MACHINE:', req.body._id);
    console.log('TIMER:', req.body.cycleduration);
    console.log('STARTED AT:', Date.parse(new Date()));

    Group.updateOne({
        "sets.groups.machines._id": ObjectId(req.body._id)
    }, { '$set': { "sets.0.emails.0.email" : '2222' } });
  };