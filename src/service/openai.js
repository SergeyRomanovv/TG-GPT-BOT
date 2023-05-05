import config from "config";
import { createReadStream } from "fs";
import { Configuration, OpenAIApi } from "openai";

class OpenAI {
  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  chat() {}

  async transcription(filePath) {
    try {
      console.log("filePath=========================>", filePath);
      const response = await this.openai.createTranscription(
        createReadStream(filePath),
        "wisper-1"
      );
      return response.data.text;
    } catch (error) {
      console.log("ERROR while transcription", error.message);
    }
  }
}

export const openai = new OpenAI(config.get("OPENAI_KEY"));
