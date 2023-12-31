// load the initial data to the local stotrage
function loadInitialData() { 
    if (!localStorage.getItem('students') && !localStorage.getItem('courses')) {
  // check if there is an info about students and courses
        fetch('http://localhost:8000/data.json')
        .then(response => response.json())
        .then(data => {
        // load the courses and students info to the local storage
            localStorage.setItem('students', JSON.stringify(data.students));
            localStorage.setItem('courses', JSON.stringify(data.courses));

            performOtherTasks();
        })
      .catch(error => console.error('Error loading initial data:', error));
    }else{
        performOtherTasks();
    }
}

// get the initial data from local storage
function getInitialData() {
  const students = JSON.parse(localStorage.getItem('students'));
  const courses = JSON.parse(localStorage.getItem('courses'));
  return { students, courses };
}

function performOtherTasks() {
  const { students, courses } = getInitialData();

  if (students && courses) {

    console.log('Students:', students);
    console.log('Courses:', courses);
  }
}

loadInitialData();

function getInitialData() {
  const storedData = localStorage.getItem('initialData');
  return storedData ? JSON.parse(storedData) : null;
}

function performOtherTasks() {
  const students = JSON.parse(localStorage.getItem('students'));
  const courses = JSON.parse(localStorage.getItem('courses'));

  if (students && courses) {
    console.log('Students:', students);
    console.log('Courses:', courses);
  }
}

loadInitialData();

function getInitialData() {
  const storedData = localStorage.getItem('students') && localStorage.getItem('courses');
  return storedData ? JSON.parse(storedData) : null;
}

function performOtherTasks() {
  const students = JSON.parse(localStorage.getItem('students'));
  const courses = JSON.parse(localStorage.getItem('courses'));

  if (students && courses) {
    console.log('Students:', students);
    console.log('Courses:', courses);
  }
}

loadInitialData();

// course class to keep course info
class Course { 
    constructor(courseId, courseName, gradingScale, credits) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.gradingScale = gradingScale;
        this.credits = credits; 
        this.students = [];
    }
    calculateLetterGrade(midtermScore, finalScore) {
        const totalScore = 0.4 * midtermScore + 0.6 * finalScore;

        // calculate the letter grade
        let letterGrade;
        if (this.gradingScale === 10) {
            letterGrade = this.calculateLetterGradeForScale10(totalScore);
        } else if (this.gradingScale === 7) {
            letterGrade = this.calculateLetterGradeForScale7(totalScore);
        } else {
            console.error('Invalid grading scale.');
            return null;
        }

        return letterGrade;
    }

    calculateLetterGradeForScale10(totalScore) {
        if (totalScore >= 90) {
            return 'A';
        } else if (totalScore >= 80) {
            return 'B';
        } else if (totalScore >= 70) {
            return 'C';
        } else if (totalScore >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    }

    calculateLetterGradeForScale7(totalScore) {
        if (totalScore >= 93) {
            return 'A';
        } else if (totalScore >= 85) {
            return 'B';
        } else if (totalScore >= 77) {
            return 'C';
        } else if (totalScore >= 70) {
            return 'D';
        } else {
            return 'F';
        }
    }
}

// Course management class to arrange course actions
class CourseManagement { 
    constructor() {
        this.courses = JSON.parse(localStorage.getItem('courses')) || [];
        this.eventDispatcher = document.createElement('div');
    }

    addCourse(courseId, courseName, gradingScale, credits) {
        const newCourse = new Course(courseId, courseName, gradingScale, credits);
        this.courses.push(newCourse);
        localStorage.setItem('courses', JSON.stringify(this.courses));

        this.eventDispatcher.dispatchEvent(new CustomEvent('courseAdded', { detail: { course: newCourse } }));

        return newCourse;
    }

    getCourseById(courseId) {
        const course = this.courses.find(course => course.courseId === courseId);

        if (course) {
            // fix the prototype chain
            Object.setPrototypeOf(course, Course.prototype);

            if (course instanceof Course) {
                console.log('Found Course:', course);
            } else {
                console.error('Not an instance of Course.');
            }
        } else {
            console.error(`Course with ID ${courseId} not found.`);
        }

        return course;
    }

}
// student class to keep student info
class Student {
    constructor(studentId, studentName, studentSurname) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentSurname = studentSurname;
        this.courses = {}; // includes course info (courseId: { midtermScore, finalScore })
        this.gpa = 0;
    }
    calculateGPA() {
    console.log("Calculate GPA Function Started");
    let totalCredits = 0;
    let totalGradePoints = 0;

    // check students grade for every course student enrolled
    for (const courseId in this.courses) {
        const courseInfo = this.courses[courseId];
        const course = coursesManager.getCourseById(courseId);

        console.log("Course ID:", courseId); 
        console.log("Course:", course); 

        if (course && courseInfo && !isNaN(courseInfo.midtermScore) && !isNaN(courseInfo.finalScore)) {
            const letterGrade = course.calculateLetterGrade(courseInfo.midtermScore, courseInfo.finalScore);
            console.log("Letter Grade:", letterGrade); 
            const gradePoints = this.calculateGradePoints(letterGrade);
            console.log("Grade Points:", gradePoints); 
            const credits = course.credits;

            // calculating general GPA
            totalGradePoints += gradePoints * credits;
            totalCredits += credits;
        }
    }

    // calculation of GPA
    console.log("Total Grade Points:", totalGradePoints);
    console.log("Total Credits:", totalCredits); 

    if (totalCredits > 0) {
        this.gpa = totalGradePoints / totalCredits;
    } else {
        this.gpa = 0;
    }

    console.log("Calculated GPA:", this.gpa);
    return this.gpa;
}



    calculateGradePoints(letterGrade) {
        // change letter grade to point for calculating GPA
        switch (letterGrade) {
            case 'A':
                return 4.0;
            case 'B':
                return 3.0;
            case 'C':
                return 2.0;
            case 'D':
                return 1.0;
            default:
                return 0.0;
        }
    }

}
// Student management class to arrange student actions 
class StudentManagement {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.eventDispatcher = document.createElement('div');
        this.coursesManager = new CourseManagement();
    }
    calculateClassMeanScore(courseId) {
        const course = this.coursesManager.getCourseById(courseId);

        if (!course) {
            console.error('Course not found.');
            return;
        }

        const studentScores = this.getStudentScores(courseId);

        if (studentScores.length === 0) {
            alert('No student scores available for the selected course.');
            return;
        }

        const totalScore = studentScores.reduce((sum, student) => sum + student.midtermScore + student.finalScore, 0);
        const meanScore = totalScore / (studentScores.length * 2);

        return meanScore;
    }

    getStudentScores(courseId) {
        const course = this.coursesManager.getCourseById(courseId);

        if (course) {
            // make the actions if course is not null or undefined
            console.log(course.constructor.name); 
            console.log(course.calculateLetterGrade);
            console.log(course.courseName); 
            console.log(course instanceof Course);
        } else {
            console.error('Course not found.');
        }

        const studentScores = [];
        if (!Array.isArray(course.students)) {
            console.error('course.students is not an array:', course.students);
            return;
        }

        for (const student of course.students) {
            const { midtermScore, finalScore } = student.courses[courseId];

            // check if there is any mistake
            if (course.calculateLetterGrade) {
                const letterGrade = course.calculateLetterGrade(midtermScore, finalScore);

                studentScores.push({
                    studentId: student.studentId,
                    studentName: student.studentName,
                    studentSurname: student.studentSurname,
                    midtermScore,
                    finalScore,
                    letterGrade,
                });
            } else {
                console.error('calculateLetterGrade function is not available in the course object.');
            }
        }
        return studentScores;
    }

    addStudent(studentId, studentName, studentSurname) {

        console.log("Before adding -Students Array:", this.students);

        const existingStudent = this.getStudentById(studentId);
        console.log("Existing Student:", existingStudent);

        if (existingStudent) {
            console.log("This student already exists.");
            return existingStudent;
        }
        const newStudent = new Student(studentId, studentName, studentSurname);
        this.students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(this.students));

        console.log("After adding student - Students Array:", this.students);

        this.eventDispatcher.dispatchEvent(new CustomEvent('studentAdded', { detail: { student: newStudent } }));

        return newStudent;
    }
    getStudentById(studentId) {
        const foundStudent = this.students.find(student => student.studentId === studentId);

        if (foundStudent) {
            // fix the prototype chain
            Object.setPrototypeOf(foundStudent, Student.prototype);

            if (foundStudent instanceof Student) {
                console.log('Found Student:', foundStudent);
            } else {
                console.error('Not an instance of Student.');
            }
        } else {
            console.error(`Student with ID ${studentId} not found.`);
        }

        return foundStudent;
    }

    addStudentAndScores(studentId, courseId, midtermScore, finalScore) {
        const student = this.getStudentById(studentId);
        if (!student) {
            console.error('Student not found.');
            return;
        }

        // check if student is enrolled the course before
        if (student.courses.hasOwnProperty(courseId)) {
            alert("Student is already enrolled in this course.");
            return;
        }

        // enroll the student to the course
        student.courses[courseId] = { midtermScore, finalScore };
        localStorage.setItem('students', JSON.stringify(this.students));

        this.eventDispatcher.dispatchEvent(new CustomEvent('studentEnrolled', { detail: { studentId, courseId } }));
        
        student.calculateGPA();
    }
}
const studentsManager = new StudentManagement();
function calculateClassMeanScore() {

    try {
        const selectedCourseDropdown = document.getElementById('selectedCourse');
        const selectedCourseId = selectedCourseDropdown.value.split(" - ")[0];

        if (!selectedCourseId) {
            alert("Please select a course.");
            return;
        }

        // Calculate and display the class mean score
        const meanScore = studentsManager.calculateClassMeanScore(selectedCourseId);
        alert(`Class Mean Score for Course ${selectedCourseId}: ${meanScore.toFixed(2)}`);
    } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred. Check the console for details.');
    }
}


function addStudentAndScores() {
    const studentIdInput = document.getElementById("studentId");
    const studentNameInput = document.getElementById("studentName");
    const studentSurnameInput = document.getElementById("studentSurname");
    const midtermScoreInput = document.getElementById("midtermScore");
    const finalScoreInput = document.getElementById("finalScore");
    const existingCoursesSelect = document.getElementById("existingCourses");

    // remove white spaces
    const studentId = studentIdInput.value.trim();
    const studentName = studentNameInput.value.trim();
    const studentSurname = studentSurnameInput.value.trim();
    const midtermScore = parseInt(midtermScoreInput.value);
    const finalScore = parseInt(finalScoreInput.value);


    if (studentId === "" || studentName === "" || studentSurname === "") {
        alert("Student ID, Name, and Surname cannot be empty. Please fill in all fields.");
        return;
    }

    if (isNaN(midtermScore) || isNaN(finalScore)) {
        alert("Midterm Score and Final Score must be numeric values.");
        return;
    }

    const selectedCourse = existingCoursesSelect.value;
    const courseId = selectedCourse.split(" - ")[0];

    // find the student or add the new student
    let student = studentsManager.students.find(s => s.studentId === studentId);
    if (!student) {
        // if not found, add new student
        student = studentsManager.addStudent(studentId, studentName, studentSurname);
    }

    // update students course info
    studentsManager.addStudentAndScores(studentId, courseId, midtermScore, finalScore);

    const course = coursesManager.getCourseById(courseId);
    if (course) {
    // check if student is already enrolled to the course
        if (!course.students.some(existingStudent => existingStudent.studentId === student.studentId)) {
            // if student is not enrolled, add the student
            course.students.push(student);
            localStorage.setItem('courses', JSON.stringify(coursesManager.courses));
        } else {
            console.log("Student is already enrolled in this course.");
        }
        // update course info

        const updatedCourse = {
            courseId: course.courseId,
            courseName: course.courseName,
            gradingScale: course.gradingScale,
            students: course.students,
            credits: course.credits,  
        };

        const courseIndex = coursesManager.courses.findIndex(c => c.courseId === course.courseId);
        if (courseIndex !== -1) {
            coursesManager.courses[courseIndex] = updatedCourse;
            localStorage.setItem('courses', JSON.stringify(coursesManager.courses));
        }
    }

    alert("Student added successfully!");

    displayAllCourses();
    displayStudentScores(courseId);   

}
function displayAllCoursesDropdown() {
    const selectedCourseDropdown = document.getElementById('selectedCourse');

    if (selectedCourseDropdown) {
        selectedCourseDropdown.innerHTML = "";

        for (const course of coursesManager.courses) {
            const option = document.createElement('option');
            option.value = `${course.courseId} - ${course.courseName}`;
            option.text = `${course.courseId} - ${course.courseName}`;
            selectedCourseDropdown.add(option);
        }
    } else {
        console.error('Element with ID "selectedCourse" not found.');
    }
}

function displaySelectedCourseStudents() {
    const selectedCourseDropdown = document.getElementById('selectedCourse');
    const selectedCourseId = selectedCourseDropdown.value.split(" - ")[0];

    if (!selectedCourseId) {
        alert("Please select a course.");
        return;
    }

    // show students for selected course
    displayStudentScores(selectedCourseId);
}
// display student by chosen status (failed/passed) 
function displaySelectedStatusStudents() {
    try {
        const selectedStatusDropdown = document.getElementById('viewStatus');
        const selectedStatus = selectedStatusDropdown.value;
        const selectedCourseDropdown = document.getElementById('selectedCourse');
        const selectedCourseId = selectedCourseDropdown.value.split(" - ")[0];

        
        const studentScores = studentsManager.getStudentScores(selectedCourseId);
        const filteredStudents = selectedStatus === "failed"
            ? studentScores.filter(student => student.letterGrade === 'F')
            : studentScores.filter(student => student.letterGrade !== 'F');

        const tableBody = document.getElementById('studentScoresTableBody');
        tableBody.innerHTML = '';

        filteredStudents.forEach(student => {
            const row = tableBody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            const cell6 = row.insertCell(5);

            cell1.textContent = student.studentId;
            cell2.textContent = student.studentName;
            cell3.textContent = student.studentSurname;
            cell4.textContent = student.midtermScore;
            cell5.textContent = student.finalScore;
            cell6.textContent = student.letterGrade;
        });
    } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred. Check the console for details.');
    }
}

function displayStudentScores(courseId) {
    const studentScores = studentsManager.getStudentScores(courseId);
    console.log('Student Scores:', studentScores);
    const tableBody = document.getElementById('studentScoresTableBody');
    // Clear existing rows
    tableBody.innerHTML = '';

    // Populate the table with student scores
    studentScores.forEach(student => {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6); 
        const cell8 = row.insertCell(7);

        cell1.textContent = student.studentId;
        cell2.textContent = student.studentName;
        cell3.textContent = student.studentSurname;
        cell4.textContent = student.midtermScore;
        cell5.textContent = student.finalScore;
        cell6.textContent = student.letterGrade;

        // Add Remove Student from Course button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove Student from Course';
        removeButton.onclick = () => removeStudentFromCourse(student.studentId, courseId);
        cell7.appendChild(removeButton);

        // add update button
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.type = 'button';
        updateButton.onclick = () => updateStudent(student.studentId, courseId); // call the function for updating
        cell8.appendChild(updateButton);
    });
}
function viewStudentGPA() {
    const studentIdInput = document.getElementById("viewStudentGPA");
    const studentId = studentIdInput.value.trim();

    if (studentId === "") {
        alert("Student ID cannot be empty. Please enter a Student ID.");
        return;
    }

    const student = studentsManager.getStudentById(studentId);
    student.calculateGPA();

    if (student) {
        const gpaMessage = `Öğrenci ID: ${student.studentId}, Adı: ${student.studentName}, Soyadı: ${student.studentSurname}, GPA: ${student.gpa.toFixed(2)}`;
        document.getElementById('viewGpaMessage').textContent = gpaMessage;
    } else {
        document.getElementById('viewGpaMessage').textContent = 'Student is not found';
    }
}



function updateStudent(studentId, courseId) {
    console.log('Updating student:', studentId);
    const student = studentsManager.getStudentById(studentId);

    console.log('Student:', student);
    console.log('Student Courses:', student.courses);

    if (!student) {
        console.error('Student not found.');
        return;
    }

    const courseInfo = student.courses[courseId];
    console.log('Course Info for Course ID', courseId, ':', courseInfo);

    if (courseInfo !== undefined && student.courses.hasOwnProperty(courseId)) {
        console.log('Course Info for Course ID', courseId, ':', courseInfo);
    } else {
        console.error('Course information not found for the student.');
        return;
    }

    const updatedName = prompt('Enter updated name:', student.studentName);

    if (updatedName === null) {
        console.log('Update canceled by the user.');
        return;
    }

    const updatedSurname = prompt('Enter updated surname:', student.studentSurname);

    console.log('Updated Name:', updatedName);
    console.log('Updated Surname:', updatedSurname);

    // update student info
    student.studentName = updatedName;
    student.studentSurname = updatedSurname;

    // update student enrolled course info
    const updatedMidtermScore = parseInt(prompt('Enter updated midterm score:', courseInfo.midtermScore));
    const updatedFinalScore = parseInt(prompt('Enter updated final score:', courseInfo.finalScore));

    // check the updated scores and update the scores
    if (!isNaN(updatedMidtermScore)) {
        courseInfo.midtermScore = updatedMidtermScore;
    }

    if (!isNaN(updatedFinalScore)) {
        courseInfo.finalScore = updatedFinalScore;
    }

    // submit updated info to the local storage
    localStorage.setItem('students', JSON.stringify(studentsManager.students));
    console.log('Updated student in localStorage:', studentsManager.students);

    // update course ınfo
    const course = coursesManager.getCourseById(courseId);
    if(course) {
        // Öğrenci bilgilerini güncelle
        const studentInCourse = course.students.find(s => s.studentId === studentId);

        if (studentInCourse) {
            studentInCourse.studentName = updatedName;
            studentInCourse.studentSurname = updatedSurname;
            studentInCourse.courses[courseId].midtermScore = updatedMidtermScore;
            studentInCourse.courses[courseId].finalScore = updatedFinalScore;
        }

        const updatedCourse = {
            courseId: course.courseId,
            courseName: course.courseName,
            gradingScale: course.gradingScale,
            students: course.students,
            credits: course.credits,
        };

        const courseIndex = coursesManager.courses.findIndex(c => c.courseId === course.courseId);
        if (courseIndex !== -1) {
            coursesManager.courses[courseIndex] = updatedCourse;
        }
        console.log('Updated course:', course);
        console.log('Updated coursesManager:', coursesManager.courses);
    }
    for (const course of coursesManager.courses) {
        const studentInCourse = course.students.find(s => s.studentId === studentId);

            if (studentInCourse) {
                studentInCourse.studentName = updatedName;
                studentInCourse.studentSurname = updatedSurname;
            }
        
    }

    localStorage.setItem('courses', JSON.stringify(coursesManager.courses));

    // Refresh the table to reflect the changes
    displayAllCourses();
    displayStudentScores(courseId);
}


function removeStudentFromCourse(studentId, courseId) {
    // Remove the student from the course
    const course = coursesManager.getCourseById(courseId);
    if (course) {
        const studentIndexInCourse = course.students.findIndex(student => student.studentId === studentId);
        if (studentIndexInCourse !== -1) {
            course.students.splice(studentIndexInCourse, 1);
             // update the course
            const updatedCourse = {
                courseId: course.courseId,
                courseName: course.courseName,
                gradingScale: course.gradingScale,
                students: course.students,
                credits: course.credits,
            };
            const courseIndex = coursesManager.courses.findIndex(c => c.courseId === course.courseId);
            if (courseIndex !== -1) {
                coursesManager.courses[courseIndex] = updatedCourse;
                localStorage.setItem('courses', JSON.stringify(coursesManager.courses));
            }
        }
    }
    const student = studentsManager.getStudentById(studentId);
    if (student && student.courses.hasOwnProperty(courseId)) {
        delete student.courses[courseId];
        localStorage.setItem('students', JSON.stringify(studentsManager.students));
    }

    // Refresh the table
    displayAllCourses();
    displayStudentScores(courseId);
}
function searchStudents() {
    const searchInput = document.getElementById('searchStudent').value.trim().toLowerCase();

    // search for students
    const filteredStudents = studentsManager.students.filter(student =>
        student.studentName.toLowerCase().includes(searchInput) || student.studentSurname.toLowerCase().includes(searchInput)
    );

    // show filtered student info
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = '';

    if (filteredStudents.length === 0) {
        searchResultsDiv.innerHTML = 'No matching students found.';
    } else {
        filteredStudents.forEach(student => {
            const studentInfo = document.createElement('div');
            studentInfo.innerHTML = `
                <p>Student ID: ${student.studentId}</p>
                <p>Name: ${student.studentName}</p>
                <p>Surname: ${student.studentSurname}</p>
                <p>Courses and Scores:</p>
            `;

            // check students enrolled courses and grades
            Object.keys(student.courses).forEach(courseId => {
                const courseInfo = student.courses[courseId];
                const course = coursesManager.getCourseById(courseId);

                if (course) {
                    const letterGrade = course.calculateLetterGrade(courseInfo.midtermScore, courseInfo.finalScore);

                    studentInfo.innerHTML += `
                        <p>Course ID: ${courseId}</p>
                        <p>Course Name: ${course.courseName}</p>
                        <p>Midterm Score: ${courseInfo.midtermScore}</p>
                        <p>Final Score: ${courseInfo.finalScore}</p>
                        <p>Letter Grade: ${letterGrade}</p>
                        <hr>
                    `;
                }
            });

            searchResultsDiv.appendChild(studentInfo);
        });
    }
}



const addedCourseInfoDiv = document.getElementById('addedCourseInfo');
const coursesManager = new CourseManagement();

const existingCoursesSelect = document.getElementById('existingCourses');

function clearLocalStorage() {
    localStorage.clear();
    coursesManager.courses = [];
    console.log('localStorage and courses cleared.');
}


function addCourseFromForm() {
    const courseIdInput = document.getElementById("courseId");
    const courseNameInput = document.getElementById("courseName");
    const gradingScaleSelect = document.getElementById("gradingScale");
    const creditsInput = document.getElementById("credits");

    const courseId = courseIdInput.value.trim();
    const courseName = courseNameInput.value.trim();
    const gradingScale = parseInt(gradingScaleSelect.value);
    const credits = parseInt(creditsInput.value);


    // make specific controls
    if (courseId === "" || courseName === "") {
        alert("Course ID and Course Name cannot be empty. Please fill in both fields.");
        return;
    }

    if (!isCourseIdUnique(courseId)) {
        alert("A course with the same ID already exists. Please use a unique ID.");
        return;
    }

    if (isNaN(gradingScale) || ![10, 7].includes(gradingScale)) {
        alert("Please select a valid grading scale (10 or 7).");
        return;
    }
    if (isNaN(credits) || credits <= 0) {
        alert("Please enter a valid positive number for credits.");
        return;
    }

    const addedCourse = coursesManager.addCourse(courseId, courseName, gradingScale, credits);

    addedCourseInfoDiv.innerHTML = `Added Course: ${addedCourse.courseName} (ID: ${addedCourse.courseId}, Grading Scale: ${addedCourse.gradingScale}, Credits: ${addedCourse.credits})`;

    displayAllCourses();
}

function isCourseIdUnique(courseId) {
    return !coursesManager.courses.some(course => course.courseId === courseId);
}

function displayAllCourses() {
    let existingCoursesSelect = document.getElementById('existingCourses');
    existingCoursesSelect.innerHTML = "";

    for (const course of coursesManager.courses) {
        // add existing courses to the dropdown menu
        const option = document.createElement('option');
        option.value = `${course.courseId} - ${course.courseName}`;
        option.text = `${course.courseId} - ${course.courseName}`;
        existingCoursesSelect.add(option);
    }
    console.log('Courses displayed:', coursesManager.courses);
    displayAllCoursesDropdown();
}


// when page loaded show existing courses
displayAllCourses();
coursesManager.eventDispatcher.addEventListener('courseAdded', function (event) {
    const addedCourse = event.detail.course;
    addedCourseInfoDiv.innerHTML = `Added Course: ${addedCourse.courseName} (ID: ${addedCourse.courseId}, Grading Scale: ${addedCourse.gradingScale}, Credits: ${addedCourse.credits} )`;
    displayAllCourses();
});

document.addEventListener('DOMContentLoaded', function () {
    const viewGpaButton = document.getElementById('viewGpaButton');

    if (viewGpaButton) {
        viewGpaButton.addEventListener('click', viewStudentGPA);
    }
});