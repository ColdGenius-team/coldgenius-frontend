const apiKey = "YOUR_OPENAI_API_KEY_HERE"; // Placeholder - Netlify will replace this during deployment
const apiUrl = "https://api.openai.com/v1/chat/completions"; // Updated API endpoint

// Create the form element
const form = document.createElement('form');
form.id = 'emailForm';

// Create and append form fields
const companyLabel = document.createElement('label');
companyLabel.textContent = 'Company Name:';
const companyInput = document.createElement('input');
companyInput.type = 'text';
companyInput.id = 'company';
companyInput.name = 'company';
companyInput.required = true;

const productLabel = document.createElement('label');
productLabel.textContent = 'Product Description:';
const productInput = document.createElement('input');
productInput.type = 'text';
productInput.id = 'product';
productInput.name = 'product';
productInput.required = true;

const toneLabel = document.createElement('label');
toneLabel.textContent = 'Tone:';
const toneSelect = document.createElement('select');
toneSelect.id = 'tone';
toneSelect.name = 'tone';
const tones = ['Professional', 'Friendly', 'Persuasive', 'Enthusiastic'];
tones.forEach(tone => {
  const option = document.createElement('option');
  option.value = tone.toLowerCase();
  option.text = tone;
  toneSelect.appendChild(option);
});

const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Generate Email';

// Append elements to the form
form.appendChild(companyLabel);
form.appendChild(companyInput);
form.appendChild(productLabel);
form.appendChild(productInput);
form.appendChild(toneLabel);
form.appendChild(toneSelect);
form.appendChild(submitButton);

// Get the placeholder div by its ID and append the form
const formContainer = document.getElementById('emailFormContainer');
formContainer.appendChild(form);

// Get the result div by its ID
const resultDiv = document.getElementById('resultContainer');
const submitButton = document.querySelector('#emailForm button[type="submit"]'); // Get the button

// Add an event listener for form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Disable the button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Generating...';

    // ... (Get form values - code is correct) ...

    // Construct the prompt for the API
    const prompt = `Write a cold email to ${company} introducing ${product}. The tone should be ${tone}.`;

    // Prepare the message for the OpenAI API
    const messages = [
        {
            "role": "user",
            "content": prompt
        }
    ];

    try {
        // Make the API request to OpenAI
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o", // Correct model name
                messages: messages,
                max_tokens: 200,
                n: 1,
                stop: null,
                temperature: 0.7
            })
        });

        // Handle HTTP errors
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
        }

        // Process the response
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            const emailContent = data.choices[0].message.content;
            resultDiv.textContent = emailContent;
        } else {
            resultDiv.textContent = "No email generated. Please check your input.";
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.textContent = `An error occurred: ${error.message}`;
    } finally {
        // Re-enable the button and reset text
        submitButton.disabled = false;
        submitButton.textContent = 'Generate Email';
    }
});