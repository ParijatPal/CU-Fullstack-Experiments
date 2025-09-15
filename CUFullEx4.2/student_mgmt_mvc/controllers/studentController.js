const Student = require('../models/Student');

// List all students
exports.index = async (req, res) => {
  try {
    const students = await Student.find().sort({createdAt: -1});
    res.render('index', { students });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Render add form
exports.renderAdd = (req, res) => {
  res.render('add');
};

// Create student
exports.create = async (req, res) => {
  try {
    const { name, roll, age, course } = req.body;
    await Student.create({ name, roll, age, course });
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error creating student: ' + err.message);
  }
};

// Render edit form
exports.renderEdit = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.redirect('/');
    res.render('edit', { student });
  } catch (err) {
    res.redirect('/');
  }
};

// Update student
exports.update = async (req, res) => {
  try {
    const { name, roll, age, course } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { name, roll, age, course }, { runValidators: true });
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error updating student: ' + err.message);
  }
};

// Delete student
exports.delete = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting student');
  }
};
