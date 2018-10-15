let donations = require('../models/donations');

let express = require('express');
let router = express.Router();

let findById = (arr, id) => {
    let result  = arr.filter(function(o) { return o.id == id;} );
    return result ? result[0] : null; // or undefined
}

let getTotalVotes = (array) => {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.upvotes; });
    return totalVotes;
}

router.home = (req, res) => {
    res.sendFile('../public/index.ejs');
};

router.findAll = (req, res) => {
    res.json(donations);
};

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let donation = findById(donations, req.params.id  ) ; 
    donation ? 
        res.json( donation ) :
        res.json({ message: 'Donation NOT Found!' } );
}

router.editDonation = (req, res) => {
    let donation =  findById(donations, req.params.id ) ;
    if (!donation)
        res.json({ message: 'Donation NOT Found!'} );
    else {
        donation.paymenttype = req.body.paymenttype;
        donation.amount = req.body.amount;
        donation.upvotes = req.body.upvotes;
        res.json({ message: 'Donation Successfully UpDated!', data: donation });
    }
};

router.addDonation = (req, res) => {
    let id = Math.floor((Math.random() * 1000000) + 1);
    donations.push({id : id, paymenttype: req.body.paymenttype, 
        amount: req.body.amount, upvotes: 0});
    res.json({ message: 'Donation Added!'});
};
 
router.deleteDonation = (req, res) => {
    let donation = findById(donations,req.params.id);
    if (!donation)
       res.json({ message: 'Donation NOT DELETED!'} );
    else {  
       let index = donations.indexOf(donation);
       donations.splice(index, 1);  
       res.json({ message: 'Donation Successfully Deleted!', data: donation});
    }
};

router.incrementUpvotes = (req, res) => {
    let donation = findById(donations,req.params.id);
    if (donation) {
        donation.upvotes += 1;
        res.json({ message: 'Donation Successfully Upvoted!', data: donation });
    } else {
        res.status(404);   // NEW
        res.json({ message: 'Invalid Donation Id!'});
    }
};

router.findTotalVotes = (req, res) => {
    res.json({ totalvotes : getTotalVotes(donations) });
}

module.exports = router;
