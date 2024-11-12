export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let randomSeed = getRandomInt(1000000);
//console.log(randomSeed);


export async function createCompletionsChat(prompt, systemPrompt = '') {


    const res = { value: '' }; // Response object to hold API result
    try {
      //console.log("Sent: " + prompt, systemPrompt)
      // Set up the messages for the OpenAI API
      const userMessages = systemPrompt
        ? [
            { role: 'user', content: prompt },
            { role: "system", content: systemPrompt }
          ]
        : [
            { role: 'user', content: prompt } // For subsequent calls, only user messages
          ];

      //console.log(userMessages);
  
      const requestData = JSON.stringify({
        model: 'gpt-4o-mini',
        messages: userMessages
      });
  
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
        },
        body: requestData,
      };
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', fetchOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
  
      const { choices } = await response.json();
  
      // Check if choices is valid
      if (choices && choices.length > 0) {
        res.value = choices[0].message.content;
      } else {
        throw new Error('No choices returned from API');
      }
    } catch (error) {
      console.error('Error in createCompletionsChat:', error);
      res.value = error.message;
    }
    
    //console.log(res);
    return res; // Return the response object
  }









  export async function createImagePrompt(prompt, systemPrompt) {
    //console.log(systemPrompt);

    const res = { value: '' }; // Response object to hold API result
    try {
      //console.log("Sent: " + prompt, systemPrompt)
      // Set up the messages for the OpenAI API
      const userMessages = systemPrompt
        ? [
            { role: 'user', content: prompt },
            { role: "system", content: systemPrompt }
          ]
        : [
            { role: 'user', content: prompt } // For subsequent calls, only user messages
          ];

      //console.log(userMessages);
  
      const requestData = JSON.stringify({
        model: 'gpt-4o',
        messages: userMessages
      });
  
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
        },
        body: requestData,
      };
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', fetchOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
  
      const { choices } = await response.json();
  
      // Check if choices is valid
      if (choices && choices.length > 0) {
        res.value = choices[0].message.content;
      } else {
        throw new Error('No choices returned from API');
      }
    } catch (error) {
      console.error('Error in createCompletionsChat:', error);
      res.value = error.message;
    }
    
    return res; // Return the response object
  }

















  export async function createInitialCompletionsChat(prompt, systemPrompt = '') {
    const res = { value: '' }; // Response object to hold API result
    try {
      //console.log("Sent: " + prompt, systemPrompt)
      // Set up the messages for the OpenAI API
      const userMessages = systemPrompt
        ? [
            { role: 'user', content: prompt },
            { role: "system", content: systemPrompt }
          ]
        : [
            { role: 'user', content: prompt } // For subsequent calls, only user messages
          ];
  
      const requestData = JSON.stringify({
        model: 'gpt-4o-mini',
        messages: userMessages,
        temperature: 1.9,
        seed: randomSeed
      });
  
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
        },
        body: requestData,
      };
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', fetchOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
  
      const { choices } = await response.json();
  
      // Check if choices is valid
      if (choices && choices.length > 0) {
        res.value = choices[0].message.content;
      } else {
        throw new Error('No choices returned from API');
      }
    } catch (error) {
      console.error('Error in createCompletionsChat:', error);
      res.value = error.message;
    }
    
    return res; // Return the response object
  }
  


  

