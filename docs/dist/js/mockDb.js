/**
 * Mock Database Layer using localStorage
 * Simulates a MySQL database for the Hostel Management System static demo.
 */

const DB_KEY = "hms_mock_db";

const DEFAULT_DB = {
    users: [
        { loginId: "admin", userGroupId: "UG001", password: "password", name: "System Admin", userId: "U001" },
        { loginId: "rasel@gmail.com", userGroupId: "UG004", password: "password", name: "Md. Rasel", userId: "U008" },
        { loginId: "emp@gmail.com", userGroupId: "UG003", password: "password", name: "Employee Staff", userId: "U003" }
    ],
    students: [
        {
            serial: 8,
            userId: "U008",
            name: "Md. Rasel",
            studentId: "151-15-1155",
            cellNo: "+8801755000002",
            email: "rasel@gmail.com",
            nameOfInst: "DIU",
            program: "CSE",
            batchNo: "34",
            gender: "Male",
            dob: "1994-06-14",
            bloodGroup: "AB(+)",
            nationality: "Bangladeshi",
            fatherName: "Mr. Father",
            motherName: "Mst. Mother",
            presentAddress: "Dhanmondi, Dhaka-1207",
            parmanentAddress: "Dhanmondi, Dhaka-1207",
            admitDate: "2015-02-27",
            isActive: "Y",
            roomNo: "101"
        },
        {
            serial: 9,
            userId: "U009",
            name: "Md. Zahidul",
            studentId: "151-15-1122",
            cellNo: "+881722545660",
            email: "zahidul@gmail.com",
            nameOfInst: "DIU",
            program: "CSE",
            batchNo: "34",
            gender: "Male",
            dob: "2005-07-13",
            bloodGroup: "O(+)",
            nationality: "Bangladeshi",
            fatherName: "Mr. Father",
            motherName: "Mst Mother",
            presentAddress: "Dhanmondi, Dhaka-1207",
            parmanentAddress: "Dhanmondi, Dhaka-1207",
            admitDate: "2015-02-27",
            isActive: "Y",
            roomNo: "102"
        }
    ],
    employees: [
        { userId: "E001", name: "Md. Cook", cellNo: "+8801711223344", designation: "Chef", salary: 15000, isActive: "Y" },
        { userId: "E002", name: "Md. Cleaner", cellNo: "+8801711556677", designation: "Janitor", salary: 8000, isActive: "Y" }
    ],
    rooms: [
        { roomNo: "101", blockName: "Block A", seatCapacity: 4, bookedSeats: 1, isActive: "Y" },
        { roomNo: "102", blockName: "Block A", seatCapacity: 2, bookedSeats: 1, isActive: "Y" },
        { roomNo: "201", blockName: "Block B", seatCapacity: 3, bookedSeats: 0, isActive: "Y" }
    ],
    notices: [
        { serial: 101, title: "Hostel Fee Payment Deadline", description: "All students are requested to clear their monthly hostel accommodation fees by the 10th of this month.", date: "22nd June, 2026" },
        { serial: 102, title: "Meal Rate Re-calculation", description: "The daily meal rate has been revised to 45 BDT starting from next week. Please update your deposits accordingly.", date: "18th June, 2026" },
        { serial: 103, title: "Weekend Cleaning Drive", description: "A cleaning drive will be held in Block A on Saturday. Cooperation from all residents is requested.", date: "15th June, 2026" }
    ],
    meals: {
        todayCount: 45
    }
};

// Initialize Mock DB
function initDb() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DB));
    }
}

function getDb() {
    initDb();
    return JSON.parse(localStorage.getItem(DB_KEY));
}

function saveDb(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Auth Helper
function authenticateUser(username, password) {
    const db = getDb();
    const user = db.users.find(u => u.loginId.toLowerCase() === username.toLowerCase() && u.password === password);
    if (user) {
        localStorage.setItem("hms_session", JSON.stringify({
            loginId: user.loginId,
            userGroupId: user.userGroupId,
            name: user.name,
            userId: user.userId
        }));
        return user;
    }
    return null;
}

function getCurrentSession() {
    const sessionStr = localStorage.getItem("hms_session");
    return sessionStr ? JSON.parse(sessionStr) : null;
}

function clearSession() {
    localStorage.removeItem("hms_session");
}

// Database APIs
const mockDb = {
    getStats: () => {
        const db = getDb();
        return {
            studentsCount: db.students.filter(s => s.isActive === 'Y').length,
            employeesCount: db.employees.filter(e => e.isActive === 'Y').length,
            roomsCount: db.rooms.filter(r => r.isActive === 'Y').length,
            todayMeals: db.meals.todayCount
        };
    },
    getStudents: () => getDb().students,
    addStudent: (student) => {
        const db = getDb();
        student.serial = db.students.length > 0 ? Math.max(...db.students.map(s => s.serial)) + 1 : 1;
        student.userId = "U" + String(student.serial).padStart(3, '0');
        student.isActive = "Y";
        db.students.push(student);
        saveDb(db);
        return student;
    },
    deleteStudent: (serial) => {
        const db = getDb();
        db.students = db.students.filter(s => s.serial !== serial);
        saveDb(db);
    },
    getEmployees: () => getDb().employees,
    getRooms: () => getDb().rooms,
    addRoom: (room) => {
        const db = getDb();
        room.bookedSeats = 0;
        room.isActive = "Y";
        db.rooms.push(room);
        saveDb(db);
        return room;
    },
    getNotices: () => getDb().notices,
    addNotice: (notice) => {
        const db = getDb();
        notice.serial = db.notices.length > 0 ? Math.max(...db.notices.map(n => n.serial)) + 1 : 101;
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        notice.date = new Date().toLocaleDateString("en-US", options);
        db.notices.unshift(notice);
        saveDb(db);
        return notice;
    }
};

// Auto-run init
initDb();
