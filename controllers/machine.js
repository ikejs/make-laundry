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
    console.log(req.user.name);
    console.log('MACHINE:', req.body._id);
    console.log('TIMER:', req.body.cycleduration);
    console.log('STARTED AT:', Date.parse(new Date()));

    if(req.body.cycleduration) {
        Group.update ({ "_id": ObjectId("5e17dcea72d7dfb65f94a008") }, { '$set': {"sets.0.groups.0.machines.1.status.currentUser": req.user }}, function(err, result) {
            console.log(result);
        });
        Group.update ({ "_id": ObjectId("5e17dcea72d7dfb65f94a008") }, { '$set': {"sets.0.groups.0.machines.1.status.timerSeconds": parseInt(req.body.cycleduration*1000) }}, function(err, result) {
            console.log(result);
        });
        Group.update ({ "_id": ObjectId("5e17dcea72d7dfb65f94a008") }, { '$set': {"sets.0.groups.0.machines.1.status.timerStarted": Date.parse(new Date()) }}, function(err, result) {
            console.log(result);
        });
        res.redirect('/account/machine/'+req.params.machineID);
    } else {
        console.log('MARK VACANT')
    }
    Group.findOne({ "_id": ObjectId("5e17dcea72d7dfb65f94a008") }, function(err, data) {
        console.log(JSON.stringify(data));
    })
  };