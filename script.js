const apiKey = "YOUR_API_KEY_HERE"; // Placeholder - Netlify will replace this during deployment
const apiUrl = "https://api.openai.com/v1/engines/text-davinci-003/completions"; // Use the appropriate endpoint

const form = document.createElement('form');
form.id = 'emailForm';

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

form.appendChild(companyLabel);
form.appendChild(companyInput);
form.appendChild(productLabel);
form.appendChild(productInput);
form.appendChild(toneLabel);
form.appendChild(toneSelect);
form.appendChild(submitButton);

document.body.appendChild(form);

const resultDiv = document.createElement('div');
resultDiv.id = 'result';
document.body.appendChild(resultDiv);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const company = document.getElementById('company').value;
  const product = document.getElementById('product').value;
  const tone = document.getElementById('tone').value;

  const prompt = `Write a cold email to ${company} introducing ${product}. The tone should be ${tone}.`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Uses the apiKey variable
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 200,
        n: 1,
        stop: null,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        const emailContent = data.choices[0].text;
        document.getElementById('result').textContent = emailContent;
      } else {
        document.getElementById('result').textContent = "No email generated. Please check your input or API key.";
      }
    } catch (error) {
    console.error('Error:', error);
    document.getElementById('result').textContent = "An error occurred. Please try again later.";
  }
});