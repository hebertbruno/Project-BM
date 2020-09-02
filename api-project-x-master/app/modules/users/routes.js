const express = require('express');
const validate = require('celebrate');
const validation = require('./validation');
const User = require('./model');


const router = express.Router();

// GET /users listing.
router.get('/', function(req, res, next) {
    User.find(function(err, users) {
        if (err) return next(err);
        return res.json(users);
    });
});

// POST /users
router.post('/', validate(validation.insert), function(req, res, next) {
    User.create(req.body, function(err, post) {
        if (err) return next(err);
        return res.json(post);
    });
});

// GET /users/:id
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function(err, post) {
        if (err) return next(err);
        return res.json(post);
    });
});

// PUT /users/:id
router.put('/:id', validate(validation.insert), function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        return res.json(post);
    });
});

// DELETE /users/:id
router.delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        return res.json(post);
    });
});

module.exports = router;
