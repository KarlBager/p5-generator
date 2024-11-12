<script setup>
import { createCompletionsChat } from './text.js';
import { getRandomInt } from './text.js';


const content = ref('');
const chatHistory = ref([]);
const persona = ref(''); // To store the selected persona
const systemPrompt = `You are a skilled creative coder that gets a keyword or sentence and has to come up with some P5-code for a sketch, that relates to the keyword or sentence. This is the existing code, and you have to fill in the draw function as shown: 

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(500, 700);
  };

  p.draw = () => {
    
   //THIS IS WHERE YOUR CODE WILL GO

  };
};


You have the option to include some variables that can be controlled by the user. They are 'variable1.value, variable2.value and variable3.value'. You must answer with only the code to be filled in`;




import { ref, onMounted, onUnmounted } from 'vue';
import p5 from 'p5';

// Define a ref for the container
const p5Container = ref(null);
let p5Instance = null;






function generateSketch(sketchCode){

console.log(sketchCode);

sketchCode = sketchCode.value.replace(/^\s*```javascript\s*|```$/g, '').trim();


// Define the p5 sketch function
const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(500, 700);
  };

  p.draw = () => {

    p.randomSeed(0);
  
   
    eval(sketchCode);
    console.log(sketchCode);
    sketchCodeGlobal.value = sketchCode;
    sketchCodeNR = sketchCode;


  };
};

p5Instance = new p5(sketch, p5Container.value);

// Remove the "hidden" class by setting isHidden to false
isHidden.value = false;
}



function reGenerateSketch(sketchCode){




// Define the p5 sketch function
const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(500, 700);
  };

  p.draw = () => {

    p.randomSeed(0);
  
   
    eval(sketchCode);
    console.log(sketchCode);
    sketchCodeGlobal.value = sketchCode;
    sketchCodeNR = sketchCode;


  };
};

p5Instance = new p5(sketch, p5Container.value);
clearP5();

// Remove the "hidden" class by setting isHidden to false
isHidden.value = false;
}




function updateSketchCode(){

  sketchCodeNR = document.getElementById('code-field').value;
  console.log(document.getElementById('code-field').value);

}





// Destroy the p5 instance when the component unmounts
onUnmounted(() => {
  if (p5Instance) {
    p5Instance.remove();
  }
});




function clearP5(){
  if (p5Instance) {
    p5Instance.remove();
  }
}



function copyCode(){

 // Get the text field
 var copyText = String(sketchCodeGlobal.value);

 //console.log(copyText);

// Select the text field
copyText.select();
copyText.setSelectionRange(0, 99999); // For mobile devices

 // Copy the text inside the text field
navigator.clipboard.writeText(copyText.value);

// Alert the copied text
alert("Copied the text: " + copyText.value);

}



// Function to handle user input
async function handleUserInput() {
  const userInput = content.value.trim();
  
  if (!userInput) {
    alert("Please enter a prompt.");
    return;
  }

  // Add user message to chat history
  chatHistory.value.push({ role: 'user', content: userInput });

  // Construct the full prompt including the persona and chat history
  const promptMessages = chatHistory.value
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const fullPrompt = `${persona.value}:\n${promptMessages}\nAssistant:`;

  try {
    const response = await createCompletionsChat(fullPrompt, systemPrompt); // Send the prompt to the model
    //chatHistory.value.push({ role: 'assistant', content: response.value }); // Add assistant response to chat history
    content.value = ''; // Clear input field

    clearP5();
    generateSketch(response);

  } catch (error) {
    console.error("Error fetching AI response:", error);
    chatHistory.value.push({ role: 'assistant', content: 'Sorry, an error occurred!' });
  }
}

let frameRate = ref(10);

let variable1 = ref('');
let variable2 = ref('');
let variable3 = ref('');

variable1.value = 10;
variable2.value = 10;
variable3.value = 10;

const isHidden = ref(true);

let sketchCodeGlobal = ref('');
let sketchCodeNR;

const activeTab = ref('io');

</script>

<template>

     <div class="container">
    <h1>Generate a <strong>P5 sketch</strong></h1>

    <div class="chat-window">

      <div v-for="(message, index) in chatHistory" :key="index" :class="message.role">
        <p>{{ message.content }}</p>
      </div>
      
    </div>

    

    

    <input
      type="text"
      id="prompt-field"
      class="input"
      placeholder="What are your thoughts? ..."
      v-model="content"
      autofocus
      @keyup.enter="handleUserInput"
    />

  </div>

<div class="io-container" :class="{ hidden: isHidden }">
  <div>
    <!-- Tab Navigation -->
    <div>
      <button @click="activeTab = 'io'" :class="{ active: activeTab === 'io' }">IO Controls</button>
      <button @click="activeTab = 'code-editor'" :class="{ active: activeTab === 'code-editor' }">Code Editor</button>
    </div>

    <!-- Tab Content -->
    <div>
      <div id="io" v-show="activeTab === 'io'">
        <label for="variable1-slider">{{ variable1 }}</label>
        <input
          type="range"
          :min="0"
          :max="100"
          :step="1"
          v-model="variable1"
        />

        <label for="variable2-slider">{{ variable2 }}</label>
        <input
          type="range"
          :min="0"
          :max="100"
          :step="1"
          v-model="variable2"
        />

        <label for="variable3-slider">{{ variable3 }}</label>
        <input
          type="range"
          :min="0"
          :max="100"
          :step="1"
          v-model="variable3"
        />
        <br>
      </div>

      <div class="code-editor" v-show="activeTab === 'code-editor'">
        <textarea id="code-field" @input="updateSketchCode" v-model="sketchCodeNR"></textarea>
        
        <br>

        <button v-show="activeTab === 'code-editor'" @click="copyCode()">Copy</button>
        <button v-show="activeTab === 'code-editor'" @click="reGenerateSketch(sketchCodeNR)">Rerender</button>
      </div>

      
    </div>
  </div>
</div>

</template>




<style>

/* Optional styles to indicate active tabs */
button.active {
  font-weight: bold;
  border-bottom: 2px solid #000;
}

div.code-editor textarea{
  width: 500px;
  max-width: 500px;
  min-width: 500px;
}


#prompt-field{
  margin-bottom: 2rem;
}

.hidden {
  display: none !important;
}

#io{
  display: flex;
  justify-content: space-between;
  width: 500px;
}


body{
background-color: slategray;
}

h1{
  text-align: center;
  font-weight: 200;
  font-size: 2rem;
}

h1 strong{
  font-weight: 800;
}

.input{
background-color: rgba(0,0,0,0);
color: white;
border: none;
width: 30vw;
margin: 0 auto;
height: 2rem;
}

.input::placeholder{
color: #d0cece;
}

.container{
  margin: 0 auto;
  text-align: center;
  padding-top: 3rem;
}


.chat-window {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 100vh;
  overflow-y: auto;
  margin-bottom: 20px;
}

.user {
  font-weight: 300;
}

.assistant {
  font-weight: 800;
}


button {
  height: 2rem;
  background: none;
  border: 1px solid #f4f4f4;
  color: #f4f4f4;
}

p, h1{
color: #f4f4f4;
}

.hintImage{
  max-width: 30rem;

}

main{
display: flex;
justify-content: center;
}


.io-container{
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

</style>
