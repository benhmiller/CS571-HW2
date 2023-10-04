// Global Student Array
students = []

/**
 * Given an array of students, generates HTML for all students
 * using {@link buildStudentHtml}.
 * 
 * @param {*} studs array of students
 * @returns html containing all students
 */
function buildStudentsHtml(studs) {
	return studs.map(stud => buildStudentHtml(stud)).join("\n");
}

/**
 * Given a student object, generates HTML. Use innerHtml to insert this
 * into the DOM, we will talk about security considerations soon!
 * 
 * @param {*} stud 
 * @returns 
 */
function buildStudentHtml(stud) {
	let html = `<div class="col-xs-1 col-sm-2 col-md-3 col-lg-4 col-xl-6">`;
	html += `<h2>${stud.name.first} ${stud.name.last}</h2>`;
	html += `<h5>${stud.major} </h5>`;
	let fromWisco = "";
	if(stud.fromWisconsin) {
		fromWisco += "is from Wisconsin";
	} else {
		fromWisco += "is not from Wisconsin";
	}
	html += `<p>${stud.name.first} is enrolled in ${stud.numCredits} credits this semester and ${fromWisco}</p>`;
	html += `<p>${stud.name.first}'s ${stud.interests.length} interests include: </p><ul>`;
	stud.interests.forEach(interest => {
		html += `<li>` + interest + `</li>`
	})
	html += `<ul>`
	html += `</div>`
	return html;
}


function handleSearch(e) {
	e.preventDefault();

	// Obtain the User Search Values (Convert to Lower Case)
	let nameSearched = document.getElementById("search-name").value.trim().toLowerCase();
	let majorSearched = document.getElementById("search-major").value.trim().toLowerCase();
	let interestSearched = document.getElementById("search-interest").value.trim().toLowerCase();

	// Build Search Results
	let searchResult = students.filter(student => {
		const fullName = `${student.name.first} ${student.name.last}`.toLowerCase();
		if(nameSearched.length > 0 && fullName.includes(nameSearched)) {
			return true;
		}
		if(majorSearched.length > 0 && student.major.toLowerCase().includes(majorSearched)) {
			return true;
		}
		if(interestSearched.length > 0 && student.interests.join('').toLowerCase().includes(interestSearched)) {
			return true;
		}
	})

	// Clear Previous Students Displayed
	document.getElementById("students").innerHTML  = '';

	// Display Search Results
	searchResult.forEach(student => {
		const studentName = buildStudentHtml(student);
		document.getElementById("students").innerHTML += studentName;
	})

	// Update Number of Results
	document.getElementById("num-results").innerHTML  = searchResult.length;
}

function fetchStudentData() {
	fetch("https://cs571.org/api/f23/hw2/students", {
		headers: {
			"X-CS571-ID": CS571.getBadgerId()
		}
	})
	.then(res => {
		return res.json()
	})
	.then(data => {
		console.log(data);
		document.getElementById("num-results").innerHTML = data.length;
		students = data;
		students.forEach(student => {
			const studentName = buildStudentHtml(student);
			document.getElementById("students").innerHTML += studentName;
		})
	})
	.catch(error => console.error('Error fetching data:', error));
}
fetchStudentData();

document.getElementById("search-btn").addEventListener("click", handleSearch);
