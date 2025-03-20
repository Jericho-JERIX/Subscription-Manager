import { containWord } from "../image-processing/extract-number";

export default class ImageProcessingService {
    static async containWord(image: string, word: string) {
        return containWord(image, word);
    }
}