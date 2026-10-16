// Select the form element from the HTML using its ID
const form = document.querySelector("#dog-form");

// Select the HTML element where the dog results will appear
const dogList = document.querySelector("#dog-list");

// Listen for the user submitting the form
// When the form is submitted, call the onFormSubmit function
form.addEventListener("submit", onFormSubmit);

// Create a function to handle the form submission
// event contains information about the submit event
function onFormSubmit(event) {
	// Prevent the browser from refreshing the page when the form is submitted
	event.preventDefault();

	// Collect the information entered or selected in the form
	const formData = new FormData(event.target);

	// Convert the form information into a regular JavaScript object
	const dataObject = Object.fromEntries(formData.entries());

	// Get the breed name, remove extra spaces, and convert it to lowercase
	const breed = dataObject.breedName.trim().toLowerCase();

	// Get the temperament selection and convert it to lowercase
	const temperament = dataObject.temperament.toLowerCase();

	// This console.log is commented out, so it will not run
	// console.log(dataObject);

	// Clear the results from the previous search
	dogList.textContent = "";

	// Call getDogData and pass in the user's breed and temperament choices
	getDogData(breed, temperament);
}

function getDogData(breed, temperament) {
	// Store your regenerated Dog API key here
	const apiKey =
		"live_gmZ4Ut3SxRUMtA4JI6kQ5tDR2Fv3EngjbZiB1yYnQ2CAbpBTd0gTXrllwX2KPJzr";

	// Request dog breed information from the API
	fetch("https://api.thedogapi.com/v1/breeds", {
		// Include the API key in the request headers
		headers: {
			"x-api-key": apiKey
		}
	})
		// Convert the server response into JavaScript data
		.then((response) => response.json())

		// Work with the dog data returned by the API
		.then((data) => {
			// Display the returned dog data in the Console
			console.log("Dog data:", data);

			// Filter the dogs based on the user's choices
			const matchingDogs = data.filter((dog) => {
				// Get the dog's name and temperament in lowercase
				const dogName = dog.name.toLowerCase();
				const dogTemperament = (dog.temperament || "").toLowerCase();

				// Start by assuming the dog matches both searches
				let matchesBreed = true;
				let matchesTemperament = true;

				// Check the breed if the search field has text
				if (breed === "") {
					matchesBreed = true;
				} else if (dogName.includes(breed.toLowerCase()) === false) {
					matchesBreed = false;
				}

				// Check the temperament if a selection was made
				if (temperament === "") {
					matchesTemperament = true;
				} else if (dogTemperament.includes(temperament.toLowerCase()) === false) {
					matchesTemperament = false;
				}

				// Keep dogs that match both conditions
				return matchesBreed && matchesTemperament;
			});

			// Display the matching dogs
			displayDogs(matchingDogs);
		})

		// Handle errors that occur during the request or processing
		.catch((error) => {
			// Display the error details in the Console
			console.error("Error:", error);

		// Show an error message on the webpage
			dogList.textContent = "Something went wrong. Please try again.";
		});
}

// Create a function that displays the matching dogs on the webpage
function displayDogs(dogs) {
	// Check whether the filtered array contains zero dogs
	if (dogs.length === 0) {
		// Display a message when no dogs match the search
		dogList.textContent = "No dogs found. Please try a different search.";

		// Exit this function because there are no dog cards to create
		return;
	}

	// Loop through the array, handling one dog at a time
	for (let dog of dogs) {
		// Get the current dog's breed name
		const name = dog.name;

		// Get the dog's life span, or use "Unknown" if it is missing
		const lifeSpan = dog.life_span || "Unknown";

		// Get the dog's temperament, or use "Unknown" if it is missing
		const temperament = dog.temperament || "Unknown";

		// Set a default image in case the dog has no picture
		let imageUrl = "https://placehold.co/300x200?text=No+Image";

		// Check whether the dog has an image
		if (dog.image) {
			// Use the dog's image URL if one exists
			imageUrl = dog.image.url;
		}
		// Create a new div element to hold the dog's information
		const card = document.createElement("div");

		// Add the dog-card class so the CSS can style the card
		card.classList.add("dog-card");

		// Create an image element for the dog's picture
		const image = document.createElement("img");

		// Set the image source to the URL chosen above
		image.src = imageUrl;

		// Set alternative text for accessibility
		image.alt = name;

		// Create a heading element for the breed name
		const heading = document.createElement("h3");

		// Put the dog's name inside the heading
		heading.textContent = name;

		// Create a paragraph element for the life span
		const lifeSpanText = document.createElement("p");

		// Add the life span label and value to the paragraph
		// Template literals allow a variable to be inserted using ${}
		lifeSpanText.textContent = `Life Span: ${lifeSpan}`;

		// Create a paragraph element for the temperament
		const temperamentText = document.createElement("p");

		// Add the temperament label and value to the paragraph
		temperamentText.textContent = `Temperament: ${temperament}`;

		// Add the image to the dog card
		card.appendChild(image);

		// Add the breed heading to the dog card
		card.appendChild(heading);

		// Add the life span paragraph to the dog card
		card.appendChild(lifeSpanText);

		// Add the temperament paragraph to the dog card
		card.appendChild(temperamentText);

		// Add the completed card to the results section on the webpage
		dogList.appendChild(card);
	}
}
