import Filter from "bad-word-ar";
import { removeDiacritics } from "./removeDiacritics.js";

//! All Filters
const filterAr = new Filter("ar");
const filterEn = new Filter("en");
const filterCs = new Filter("cs");
const filterDa = new Filter("da");
const filterDe = new Filter("de");
const filterEo = new Filter("eo");
const filterEs = new Filter("es");
const filterFa = new Filter("fa");
const filterFi = new Filter("fi");
const filterFil = new Filter("fil");
const filterFr = new Filter("fr");
const filterHi = new Filter("hi");
const filterHu = new Filter("hu");
const filterIt = new Filter("it");
const filterJa = new Filter("ja");
const filterKab = new Filter("kab");
const filterKo = new Filter("ko");
const filterNl = new Filter("nl");
const filterNo = new Filter("no");
const filterPl = new Filter("pl");
const filterPt = new Filter("pt");

let removeFrequency = (text) => {
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
    return cleanedWord;
};
let detectedBad = (text) => {
    let cleanText = removeFrequency(text);
    if (
        filterAr.check(cleanText) ||
        filterEn.check(cleanText) ||
        filterCs.check(cleanText) ||
        filterDa.check(cleanText) ||
        filterDe.check(cleanText) ||
        filterEo.check(cleanText) ||
        filterEs.check(cleanText) ||
        filterFa.check(cleanText) ||
        filterFi.check(cleanText) ||
        filterFil.check(cleanText) ||
        filterFr.check(cleanText) ||
        filterHi.check(cleanText) ||
        filterHu.check(cleanText) ||
        filterIt.check(cleanText) ||
        filterJa.check(cleanText) ||
        filterKab.check(cleanText) ||
        filterKo.check(cleanText) ||
        filterNl.check(cleanText) ||
        filterNo.check(cleanText) ||
        filterPt.check(cleanText) ||
        filterPl.check(cleanText) ||
        // raw text
        filterAr.check(text) ||
        filterEn.check(text) ||
        filterCs.check(text) ||
        filterDa.check(text) ||
        filterDe.check(text) ||
        filterEo.check(text) ||
        filterEs.check(text) ||
        filterFa.check(text) ||
        filterFi.check(text) ||
        filterFil.check(text) ||
        filterFr.check(text) ||
        filterHi.check(text) ||
        filterHu.check(text) ||
        filterIt.check(text) ||
        filterJa.check(text) ||
        filterKab.check(text) ||
        filterKo.check(text) ||
        filterNl.check(text) ||
        filterNo.check(text) ||
        filterPt.check(text) ||
        filterPl.check(text)
    ) {
        return "bad word error";
    }

    return removeDiacritics(text);
};

export default detectedBad;
