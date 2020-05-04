//Load file (txt)
export function loadFileTXT(filepath: string) {
    let req = new XMLHttpRequest();

    req.open("GET", filepath, false);
    req.send();

    if (req.status == 200) return req.responseText;
}

//Load file (json)
export function loadFileJSON(filepath: string) {
    let result: any[] = [];
    fetch(filepath).then(response => response.json()).then(json => {
        for (const e of json)
            result.push(e);
    });

    console.log(`Loaded file ${filepath}`);
    return result;
}