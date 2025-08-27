import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Person Class Hierarchy with Student and Teacher Subclasses
 * ---------------------------------------------------------
 * - Demonstrates classical inheritance with ES6 classes in a React UI
 * - Showcases polymorphism via an overridden describe() method
 * - Encapsulation with private-ish fields (convention) and getters
 * - Static members (auto-incrementing ids)
 * - Simple UI to add Students/Teachers and filter/sort them
 */

// ====== Domain Model (Classes) ======
class Person {
  static #nextId = 1;
  static resetIds() { Person.#nextId = 1; }

  #id; // internal id
  #name;
  #age;

  constructor(name, age) {
    this.#id = Person.#nextId++;
    this.#name = name;
    this.#age = Number(age);
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  set name(v) { this.#name = String(v); }

  get age() { return this.#age; }
  set age(v) { const n = Number(v); if (!Number.isNaN(n) && n >= 0) this.#age = n; }

  get role() { return "Person"; }

  describe() {
    return `${this.role} #${this.id}: ${this.name}, ${this.age} years old.`;
  }

  toJSON() { // helpful if you ever need to serialize
    return { id: this.id, name: this.name, age: this.age, role: this.role };
  }
}

class Student extends Person {
  #major;
  #grades;

  constructor(name, age, major = "Undeclared", grades = []) {
    super(name, age);
    this.#major = major;
    this.#grades = Array.isArray(grades) ? grades.map(Number) : [];
  }

  get role() { return "Student"; }
  get major() { return this.#major; }
  set major(v) { this.#major = String(v); }

  get grades() { return [...this.#grades]; }

  addGrade(g) {
    const n = Number(g);
    if (!Number.isNaN(n) && n >= 0 && n <= 100) this.#grades.push(n);
  }

  get gpa() {
    if (this.#grades.length === 0) return 0;
    const avg = this.#grades.reduce((a, b) => a + b, 0) / this.#grades.length;
    return Math.round(((avg / 25) * 1e2)) / 1e2;
  }

  describe() {
    return `${super.describe()} Majoring in ${this.major}. GPA: ${this.gpa.toFixed(2)}`;
  }
}

class Teacher extends Person {
  #subject;
  #salary; // yearly

  constructor(name, age, subject = "General", salary = 0) {
    super(name, age);
    this.#subject = subject;
    this.#salary = Number(salary);
  }

  get role() { return "Teacher"; }
  get subject() { return this.#subject; }
  set subject(v) { this.#subject = String(v); }

  get salary() { return this.#salary; }
  set salary(v) { const n = Number(v); if (!Number.isNaN(n) && n >= 0) this.#salary = n; }

  describe() {
    return `${super.describe()} Teaches ${this.subject}. Salary: ₹${this.salary.toLocaleString()}`;
  }
}

// ====== React UI ======
export default function PersonHierarchyDemo() {
  const [people, setPeople] = useState(() => {
    Person.resetIds();
    const s1 = new Student("Aisha", 20, "Computer Science", [92, 88, 95]);
    const s2 = new Student("Ravi", 22, "Mechanical Engg", [75, 81, 79, 84]);
    const t1 = new Teacher("Meera", 34, "Mathematics", 1200000);
    const t2 = new Teacher("Karan", 41, "Physics", 1800000);
    return [s1, t1, s2, t2];
  });

  const [filterRole, setFilterRole] = useState("ALL");
  const [sortKey, setSortKey] = useState("id");
  const [form, setForm] = useState({
    role: "Student",
    name: "",
    age: "",
    major: "",
    grade: "",
    subject: "",
    salary: "",
  });

  const visible = useMemo(() => {
    let list = people;
    if (filterRole !== "ALL") list = list.filter(p => p.role === filterRole);
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "name": return a.name.localeCompare(b.name);
        case "age": return a.age - b.age;
        case "role": return a.role.localeCompare(b.role);
        default: return a.id - b.id;
      }
    });
    return list;
  }, [people, filterRole, sortKey]);

  function handleAdd(e) {
    e.preventDefault();
    const name = form.name?.trim();
    const age = Number(form.age);
    if (!name || Number.isNaN(age) || age < 0) return;

    if (form.role === "Student") {
      const s = new Student(name, age, form.major || "Undeclared");
      if (form.grade) s.addGrade(form.grade);
      setPeople(p => [...p, s]);
    } else {
      const salary = Number(form.salary) || 0;
      const t = new Teacher(name, age, form.subject || "General", salary);
      setPeople(p => [...p, t]);
    }

    setForm(f => ({ ...f, name: "", age: "", major: "", grade: "", subject: "", salary: "" }));
  }

  function addRandomGrade(id) {
    setPeople(prev => prev.map(p => {
      if (p instanceof Student && p.id === id) {
        p.addGrade(Math.floor(60 + Math.random() * 41));
      }
      return p;
    }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 text-slate-800 p-6">
      <header className="max-w-5xl mx-auto mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text">Person Class Hierarchy</h1>
        <p className="mt-2 text-slate-700">ES6 classes in React with <span className="font-semibold">Person</span> → <span className="font-semibold">Student</span>/<span className="font-semibold">Teacher</span>, showing polymorphism and encapsulation.</p>
      </header>

      {/* Controls */}
      <section className="max-w-5xl mx-auto grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow p-4">
          <label className="text-sm font-medium">Filter by Role</label>
          <select className="w-full mt-1 rounded-xl border p-2" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="ALL">All</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl shadow p-4">
          <label className="text-sm font-medium">Sort by</label>
          <select className="w-full mt-1 rounded-xl border p-2" value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
            <option value="role">Role</option>
          </select>
        </div>

        <form onSubmit={handleAdd} className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl shadow p-4">
          <div className="flex gap-2">
            <select className="rounded-xl border p-2" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option>Student</option>
              <option>Teacher</option>
            </select>
            <input className="flex-1 rounded-xl border p-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="w-28 rounded-xl border p-2" placeholder="Age" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
          </div>
          {form.role === "Student" ? (
            <div className="mt-2 flex gap-2">
              <input className="flex-1 rounded-xl border p-2" placeholder="Major" value={form.major} onChange={e => setForm({ ...form, major: e.target.value })} />
              <input className="w-40 rounded-xl border p-2" placeholder="First Grade (0-100)" type="number" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
            </div>
          ) : (
            <div className="mt-2 flex gap-2">
              <input className="flex-1 rounded-xl border p-2" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              <input className="w-44 rounded-xl border p-2" placeholder="Salary (₹/yr)" type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
            </div>
          )}
          <button className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 hover:opacity-90 transition" type="submit">Add {form.role}</button>
        </form>
      </section>

      {/* List */}
      <main className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {visible.map(person => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-2xl shadow p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-100 to-pink-100 px-2 py-1">
                  <strong className="tracking-tight">{person.role}</strong>
                  <span className="opacity-60">#{person.id}</span>
                </span>
                <span className="text-sm opacity-70">Age: {person.age}</span>
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 text-transparent bg-clip-text">{person.name}</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{person.describe()}</p>

              {person instanceof Student && (
                <div className="mt-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Major:</span>
                    <strong>{person.major}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Grades:</span>
                    <span>{person.grades.join(", ") || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>GPA:</span>
                    <strong>{person.gpa.toFixed(2)}</strong>
                  </div>
                  <button onClick={() => addRandomGrade(person.id)} className="mt-2 w-full rounded-xl border py-1.5 bg-gradient-to-r from-green-100 to-teal-100 hover:from-green-200 hover:to-teal-200 transition">
                    Add Random Grade
                  </button>
                </div>
              )}

              {person instanceof Teacher && (
                <div className="mt-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Subject:</span>
                    <strong>{person.subject}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Salary:</span>
                    <strong>₹{person.salary.toLocaleString()}</strong>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      <footer className="max-w-5xl mx-auto mt-10 text-center text-xs text-slate-600">
        <p>
          Tip: The cards call <code>person.describe()</code>. Because <code>Student</code> and <code>Teacher</code> override it, you see polymorphic behavior.
        </p>
      </footer>
    </div>
  );
}
