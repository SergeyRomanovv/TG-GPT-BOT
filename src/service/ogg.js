import installer from "@ffmpeg-installer/ffmpeg";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import { createWriteStream } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirName = dirname(fileURLToPath(import.meta.url));

class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  }

  toMp3(input, output) {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      return new Promise((resolve, reject) => {
        ffmpeg(input)
          .inputOptions("-t 30")
          .output(outputPath)
          .on("end", () => resolve(outputPath))
          .on("error", (error) => reject(error.message))
          .run();
      });
    } catch (error) {
      console.log("ERROR while creating mp3", error.message);
    }
  }

  async create(url, fileName) {
    try {
      const oggPath = resolve(__dirName, "../voices", `${fileName}.ogg`);
      const response = await axios.get(url, { responseType: "stream" });
      return new Promise((resolve) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on("finish", () => resolve(oggPath));
      });
    } catch (error) {
      console.log("ERROR while creating ogg", e.message);
    }
  }
}

export const ogg = new OggConverter();
