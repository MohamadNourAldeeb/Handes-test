import { ArabicString } from "arabic-utils";
let removeDiacritics = (value) => {
    let removedDiacritics = ArabicString(value).removeDiacritics();

    //! remove normalize Alef
    // let normalizedAlef = ArabicString(removedDiacritics).normalizeAlef();

    //! remove normalize teh
    // const normalizedTeh = normalizeTeh(removedDiacritics);

    return removedDiacritics;
};
export { removeDiacritics };

/*
function detectfrequens(text) {
    const words = text.split(" ");
    const uniqueWords = words.map((word) =>
        Array.from(new Set(word.split("")))
    );
    const uniqueWordsString = uniqueWords.map((word) => word.join(""));
    const uniqueWordsText = uniqueWordsString.join(" ");
    const cleanedWord = uniqueWordsText.replace(
        /[.!@#$%^&*()~{}_0-9+\-\[\]]/g,
        ""
    );

    console.log({ cleanedWord });
    if (detectLanguage(uniqueWordsText) == "Arabic") {
        if (arabicfilter.check(cleanedWord)) {
            return cleanedWord;
        } else {
            return text;
        }
    } else if (detectLanguage(uniqueWordsText) == "English") {
        if (engfilter.check(cleanedWord)) {
            return cleanedWord;
        } else {
            return text;
        }
    }
}

// console.log(detectfrequens(ar));

*/
