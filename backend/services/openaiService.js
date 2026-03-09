import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// let temp = null      // Just for development, for home economics...

const promptInput = [
  {
    role: "system",
    content: `You are an assistant for recommending country-specific values for a configuration parameter
  of a mobile application. Take its default value as a basis while suggesting value for a new country.

  Two prompt messages will be provided by the user: first one is with an instruction phrase to select 
  countries for which you generate values, and second is with an object of parameter name and default value
  
  I want to have suggestions as a JSON object in the answer right after with all keys of three-letter 
  country codes and suggested values are string typed. Nothing must be included in the answer other
  than JSON object to convert into code easily.`,
  },
  {
    role: "user",
    content: "Top ten countries with most daily LLM usage rates per person",
  },
];

export const askSuggestion = async (parameterKey, defaultValue) => {
  try {
    // if (temp) {
    //   return temp
    // }

    const promptMessage = {
      role: "user",
      content: `{${parameterKey} : ${defaultValue}}`,
    };
    promptInput.push(promptMessage);

    console.log("Asking for suggestion...");
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: promptInput,
    });
    console.log("Response arrived.");
    
    // temp = JSON.parse(response.output_text);
    return JSON.parse(response.output_text);
  } catch (err) {    
    throw new Error(err.message);
  }
};

export { openai };
