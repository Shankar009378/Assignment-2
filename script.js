// (() => {
//     'use strict'

//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     const forms = document.querySelectorAll('.needs-validation')

//     // Loop over them and prevent submission
//     Array.from(forms).forEach(form => {
//         form.addEventListener('submit', event => {
//             if (!form.checkValidity()) {
//                 event.preventDefault()
//                 event.stopPropagation()
//             }

//             form.classList.add('was-validated')
//         }, false)
//     })
// })();

// setTheme(getStoredTheme());

// // Add event listener for theme switches
// document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
//     element.addEventListener('click', function(event) {
//         const theme = event.target.getAttribute('data-bs-theme-value');
//         setTheme(theme);
//     });
// });

// // Function to get stored theme
// function getStoredTheme() {
//     const storedTheme = localStorage.getItem('theme');
//     return storedTheme || 'auto';
// }

// // Function to set theme
// function setTheme(theme) {
//     const body = document.body;
//     body.classList.remove('theme-light', 'theme-dark');

//     if (theme === 'auto') {
//         if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//             document.documentElement.setAttribute('data-bs-theme', 'dark')
//         } else {
//             document.documentElement.setAttribute('data-bs-theme', theme)
//         }
//     } else {
//         document.documentElement.setAttribute('data-bs-theme', theme)
//     }

//     localStorage.setItem('theme', theme);
// }
// Theme Switcher
// document.addEventListener('DOMContentLoaded', function () {
//     const themeButtons = document.querySelectorAll('.theme-button');
    
//     themeButtons.forEach(button => {
//         button.addEventListener('click', function () {
//             themeButtons.forEach(btn => btn.classList.remove('active'));
//             button.classList.add('active');
//             const selectedTheme = button.getAttribute('data-theme');
//             document.documentElement.setAttribute('data-bs-theme', selectedTheme);
//         });
//     });
// });

document.addEventListener('DOMContentLoaded', function () {
    const themeButtons = document.querySelectorAll('.dropdown-item[data-bs-theme-value]');
    
    // Set the initial theme based on stored preference or auto
    const storedTheme = getStoredTheme();
    document.documentElement.setAttribute('data-bs-theme', storedTheme);
    markSelectedTheme(storedTheme);
    
    // Add event listener for theme switches
    themeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const selectedTheme = button.getAttribute('data-bs-theme-value');
            setTheme(selectedTheme);
            markSelectedTheme(selectedTheme);
        });
    });
});

// Function to get stored theme
function getStoredTheme() {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'auto';
}

// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
}

// Mark the selected theme in the dropdown
function markSelectedTheme(selectedTheme) {
    const themeButtons = document.querySelectorAll('.dropdown-item[data-bs-theme-value]');
    themeButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-bs-theme-value') === selectedTheme) {
            button.classList.add('active');
        }
    });
}


// Form Validation
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.needs-validation');
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const yearSpan = document.querySelector('.current-year');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
});

// Form Submission Handling
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.needs-validation');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        if (!form.checkValidity()) {
            event.stopPropagation();
        } else {
            const formData = new FormData(form);
            const userInputs = {
                relationship: formData.get('relationship'),
                age: formData.get('age'),
                occasion: formData.get('occasion'),
                interests: formData.get('interests'),
                budget: formData.get('budget')
            };
            
            // Send userInputs to your backend API to fetch AI-generated suggestions
            const suggestions = await fetchSuggestionsFromAPI(userInputs);
            
            // Display the suggestions on the website
            displaySuggestions(suggestions);
        }
        
        form.classList.add('was-validated');
    });
});

async function fetchSuggestionsFromAPI(userInputs) {
    // Send userInputs to your backend API
    // Make an API request to GPT-3 using your API key
    // Parse the response to get the AI-generated suggestions
    // Return the suggestions
    // Example: you might use the 'axios' library to make API requests
    const response = await axios.post('/get-suggestions', userInputs);
    return response.data.suggestions;
}

function displaySuggestions(suggestions) {
    const suggestionsContainer = document.querySelector('.suggestions');
    suggestionsContainer.innerHTML = '';
    
    for (const suggestion of suggestions) {
        const suggestionItem = document.createElement('p');
        suggestionItem.textContent = suggestion;
        suggestionsContainer.appendChild(suggestionItem);
    }
}

// Assuming you have a function to submit form data to the backend
async function submitForm(formData) {
    try {
        const response = await fetch('/get-recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        // Display personalized recommendations to the user
        displayRecommendations(data.recommendations);
    } catch (error) {
        console.error(error);
    }
}
// Assuming you have a function to send a message to the chatbot and receive a response
async function sendMessageToChatbot(message) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        // Display the chatbot's response to the user
        displayChatbotResponse(data.response);
    } catch (error) {
        console.error(error);
    }
}
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Endpoint to get personalized recommendations
app.post('/get-recommendations', async (req, res) => {
    try {
        const userInputs = req.body;
        const recommendations = await generateRecommendations(userInputs);
        
        res.json({ recommendations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching recommendations.' });
    }
});

// Endpoint to interact with the chatbot
app.post('/chat', async (req, res) => {
    try {
        const message = req.body.message;
        const response = await generateChatbotResponse(message);
        
        res.json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while interacting with the chatbot.' });
    }
});

// GPT-3 API functions
async function generateRecommendations(userInputs) {
    // Use GPT-3 to generate personalized recommendations based on userInputs
    // Return the recommendations
}

async function generateChatbotResponse(message) {
    // Use GPT-3 to generate a chatbot response based on the user's message
    // Return the chatbot response
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Simulate chatbot typing
async function sendMessageToChatbot(message) {
    // Show typing animation
    displayChatbotTyping();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        // Display the chatbot response after a short delay
        setTimeout(() => {
            displayChatbotResponse(data.response);
        }, 1000); // Adjust the delay as needed
    } catch (error) {
        console.error(error);
    }
}
// Apply the fade-in class to elements when they become visible in the viewport
document.addEventListener('DOMContentLoaded', function () {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

