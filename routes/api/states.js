const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const createController = require('../../controllers/createController');


router.route('/')
    .get(statesController.getAllStates)
    .delete(statesController.deleteState);

router.route('/:state')
    .get(statesController.getState);

router.route('/:state/funfact')
    .post(createController.handleStatePost)
    .get(statesController.getStateProperty)
    .patch(statesController.updateFact)
    .delete(statesController.deleteState);

router.route('/:state/capital')
    .get(statesController.getStateProperty);

    router.route('/:state/nickname')
    .get(statesController.getStateProperty);

router.route('/:state/population')
    .get(statesController.getStateProperty);

router.route('/:state/admission')
    .get(statesController.getStateProperty);

router.route('/contig')
    .get(statesController.testCall);



module.exports = router;