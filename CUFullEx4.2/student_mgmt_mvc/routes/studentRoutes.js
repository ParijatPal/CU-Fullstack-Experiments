const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.index);
router.get('/students/add', studentController.renderAdd);
router.post('/students', studentController.create);
router.get('/students/:id/edit', studentController.renderEdit);
router.put('/students/:id', studentController.update);
router.delete('/students/:id', studentController.delete);

module.exports = router;
