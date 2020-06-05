/* export function generateResults() {
    const kanji = loadFile.loadFileJSON(kFilename);
    const hiragana = loadFile.loadFileJSON(hFilename);

    //Generate JSON to pass to results page
    let JSON: any = {
        //"Filenames": [kFilename, hFilename],
        "Correct": [],
        "Incorrect": []
    };

    //Add correct words to JSON
    wordDef.getArray(true).forEach(e => {
        const wordObj: any = kanji[e];

        if (wordObj.HiraganaIndex == null)
            JSON.Correct.push({"kanji": wordObj, "hiragana": null})
        else if (wordObj.HiraganaIndex != null)
            JSON.Correct.push({"kanji": wordObj, "hiragana": hiragana[wordObj.HiraganaIndex]});
    });

    //Incorrect
    wordDef.getArray(false).forEach(e => {
        const wordObj: any = kanji[e];

        if (wordObj.HiraganaIndex == null)
            JSON.Inorrect.push({"kanji": wordObj, "hiragana": null})
        else if (wordObj.HiraganaIndex != null)
            JSON.Inorrect.push({"kanji": wordObj, "hiragana": hiragana[wordObj.HiraganaIndex]});
    });

    const JSONString = JSON.stringify(JSON);
    let hexJSON = hexEncode(JSONString);

    console.log(JSONString);
    console.log(hexJSON);
    
    window.location.replace(`results.html#${hexJSON}`);
} */