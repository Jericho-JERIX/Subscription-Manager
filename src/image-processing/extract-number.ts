import Tesseract from "tesseract.js";

export async function containWord(image: string, word: string): Promise<boolean> {
    try {
        const { data } = await Tesseract.recognize(image, "tha")
        return data.text.split("\n").join(" ").split(" ").some((w) => w === word)
    } catch (error) {
        return false;
    }
}