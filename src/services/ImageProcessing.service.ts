import { readdirSync, unlinkSync } from "fs";
import path from "path";
import { containWord } from "../image-processing/extract-number";

export default class ImageProcessingService {
    static async containWord(image: string, word: string) {
        return containWord(image, word);
    }

    static async clearDumpedImages() {
        const files = readdirSync(path.join(process.cwd(), "dumps"));
        for (const file of files) {
            if (file.endsWith(".gitkeep")) {
                continue;
            }
            unlinkSync(path.join(process.cwd(), "dumps", file));
        }
    }
}