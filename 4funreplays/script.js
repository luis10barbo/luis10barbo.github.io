window.onload = () => {
    // Set Inputs to Default
    setInputToDefault(1)

    // Save Function Stuff
    createSaveElements()
    document.getElementById("save-cancel-button").addEventListener("click", () => {saveFunction(0)});
    document.getElementById("save-confirm-button").addEventListener("click", () => {saveButtonFunction()});
    // Skin preview size
    skinPreviewResize()
    window.onresize = () => {skinPreviewResize()}
    /* DARK MODE RELATED STUFF */
    let defaultLightMode = localStorage.getItem("defaultLightMode")
    if(defaultLightMode !== null){
        switchDarkMode(defaultLightMode)
    }
    else{
        if(window.matchMedia("(prefers-color-scheme: dark)").matches){
            switchDarkMode(true)
        }
        else{
            switchDarkMode(false)
        }
    }
    /* END */

    /* ADVANCED OPTIONS DROPDOWN SCRIPT */ 
    document.getElementById("advanced-options-button").addEventListener("click", () => {advancedOptionsFunction()});
    /* END */

    /* INPUT 4 DROPDOWN / SKIN FILTER */ 
    var input4 = document.getElementById("input-4")
    input4.addEventListener("focus", () => {input4Function(0)});
    input4.addEventListener("blur", (event) => {if(!event.currentTarget.contains(event.relatedTarget)){input4Function(1);checkSkinInput(document.getElementById('input-4').value)}});
    input4.addEventListener("input", () => {addSkins(filter=input4.value)});
    addSkins();
    // END
    
    /* Sliders */
    document.getElementById("cursor-size-slider").addEventListener("input", () => {syncRangeText("cursor-size")})
    document.getElementById("background-dim-slider").addEventListener("input", () => {syncRangeText("background-dim")})

    // END BUTTONS
    document.getElementById("reset-button").addEventListener("click", () => {setInputToDefault()})
    document.getElementById("save-button").addEventListener("click", () => {saveFunction()})
    document.getElementById("send-button").addEventListener("click", () => {setInputToDefault()})
    
};

var advancedOptionsAction = undefined;
var objectExpandLock = 0;
var changeSkinLock = 0;
var input4Action = undefined;

var discordIdErrors = [];
var beatmapDomainErrors = [];
var profileDomainErrors = [];
var skinErrors = [];
saveableInputs = {
    "input-1": "ID DO DISCORD",
    "input-2": "LINK DO PERFIL NO OSU!",
    "input-4": "SKIN",
    "beatmap-hitsound-check": "USAR HITSOUNDS DO BEATMAP",
    "hit-lightning-check": "USAR ILUMINAÇÃO DE HIT",
    "beatmap-colors-check": "USAR CORES DE COMBO DO MAPA",
    "dynamic-cursor-size-check": "DESENHAR FOLLOW POINTS",
    "storyboards-check": "USAR SLIDERS ANIMADOS",
    "followpoints-check": "USAR TAMANHO DE CURSOR DINAMICO",
    "animated-sliders-check": "ATIVAR STORYBOARDS",
    "cursor-size-slider": "TAMANHO DO CURSOR",
    "background-dim-slider": "ESCURECER FUNDO"
}
let saveableInput = {
    "input-1": "ID DO DISCORD",
    "input-2": "LINK DO PERFIL NO OSU!",
    "input-4": "SKIN",
 } ;
let saveableCheckbox = {
    "beatmap-hitsound-check": "USAR HITSOUNDS DO BEATMAP",
    "hit-lightning-check": "USAR ILUMINAÇÃO DE HIT",
    "beatmap-colors-check": "USAR CORES DE COMBO DO MAPA",
    "dynamic-cursor-size-check": "DESENHAR FOLLOW POINTS",
    "storyboards-check": "USAR SLIDERS ANIMADOS",
    "followpoints-check": "USAR TAMANHO DE CURSOR DINAMICO",
    "animated-sliders-check": "ATIVAR STORYBOARDS",
};
let saveableRadius = {
    "cursor-size-slider": "TAMANHO DO CURSOR",
    "background-dim-slider": "ESCURECER FUNDO"
};
function skinPreviewResize(){
    var root = document.querySelector(":root");
    root.style.setProperty("--skin-preview-width", getComputedStyle(document.body).getPropertyValue("width"));
}
async function enableError(inputId="", value=1){
    if (value == 1){
        
        makeElementError(inputId + "-box", 1);
        makeElementActive(inputId + "-error-box", 1);
        makeElementActive(inputId + "-error-box", 1, "relative");
        return;
    }
    makeElementError(inputId + "-box", 0);
    makeElementActive(inputId + "-error-box", 0);
    await sleep(400)
    makeElementActive(inputId + "-error-box", 0, "relative");
}
function createCheckbox(inputId="", inputText=""){
    let item = document.createElement("div");
    item.className = "item";

    let label = document.createElement("label");
    label.className = "checkbox-container";
    let labelInput = document.createElement("input");
    labelInput.id = inputId;
    labelInput.type = "checkbox"
    let labelSpan = document.createElement("span");
    labelSpan.className = "checkmark";

    let span = document.createElement("span");
    span.textContent = inputText;

    label.append(labelInput);
    label.append(labelSpan);

    item.appendChild(label);
    item.appendChild(span);

    return item;
}
function createSaveElements(){

    {let i = 0
    let content1 = document.getElementById("boggers1");
    let content2 = document.getElementById("boggers2");
    let saveableLength = Object.keys(saveableInputs).length/2
        for(let name in saveableInputs){
            if(i<saveableLength){
                content1.appendChild(createCheckbox("save-"+name,saveableInputs[name]));
            }
            else if(i>=saveableLength){
                content2.appendChild(createCheckbox("save-"+name,saveableInputs[name]));
            }
            i++
        }       
    }
}
function saveButtonFunction(){
    for(let name in saveableInput){
        let element = (document.getElementById("save-"+name))
        if(element.checked == 1){
            console.log(document.getElementById(name).value)
            localStorage.setItem(name, document.getElementById(name).value)
        }
    }
    for(let name in saveableCheckbox){
        let element = (document.getElementById("save-"+name))
        if(element.checked == 1){
            console.log(document.getElementById(name).checked)
            localStorage.setItem(name, document.getElementById(name).checked)
            console.log(localStorage.getItem(name))
            console.log(name)
        }
    }
    for(let name in saveableRadius){
        let element = (document.getElementById("save-"+name))
        if(element.checked == 1){
            console.log(document.getElementById(name).value)
            localStorage.setItem(name, document.getElementById(name).value)
        }
    }
    saveFunction(0)

}
async function saveFunction(value=1){
    await sleep(150)
    if(value === 1){
        let check = ((discordIdErrors.length === 0) && (beatmapDomainErrors.length === 0) && (profileDomainErrors.length === 0) && (skinErrors.length===0))
        if (check){
            makeElementActive("save-wrapper", 1);
            makeElementActive("body", 1, "unfocused");
            return;
        }
    }
    makeElementActive("save-wrapper", 0);
    makeElementActive("body", 0, "unfocused");
    
}
async function setInputToDefault(value=0){
    await sleep(150)
    let inputReset = [
        "input-1",
        "input-2",
        "input-3",
        "input-4"
    ] ;
    let checkboxInputsDisable = [
        "beatmap-hitsound-check",
        "hit-lightning-check",
        "beatmap-colors-check",
        "dynamic-cursor-size-check",
        "storyboards-check"
    ];
    let checkboxInputsEnable = [
        "followpoints-check",
        "animated-sliders-check",
    ];
    discordIdErrors = []
    beatmapDomainErrors = []
    profileDomainErrors = []
    skinErrors = []
    for(let i in inputReset){
        let element = inputReset[i];
        let storageItem = localStorage.getItem(element)
        if(storageItem !== null && value == 1){
            document.getElementById(element).value = storageItem
        }
        else{
            document.getElementById(element).value = "";
        }
        makeElementError(element+"-box", 0);
        enableError(element, 0)
    }
    addSkins()
    for(let i in checkboxInputsEnable){
        let element = checkboxInputsEnable[i];
        let storedItem = localStorage.getItem(element);
        if(!storedItem !== null && value == 1){
            console.log(element + " > " + storedItem)
            changeCheckbox(element, storedItem);
        }
        else{
            changeCheckbox(element, 1);
        }
    }
    for(let i in checkboxInputsDisable){
        let element = checkboxInputsDisable[i];
        let storedItem = localStorage.getItem(element);
        if(storedItem !== null && value == 1){
            console.log(storedItem)
            console.log(element + " > > " + storedItem)
            changeCheckbox(element, storedItem);
        }
        else{
            changeCheckbox(element, 0);
        }
    }
    {
        let storedItem = localStorage.getItem("cursor-size-slider")
        if(storedItem !== null && value == 1){
            changeRange("cursor-size", storedItem)
        }
        else{
            changeRange("cursor-size", 100)
        }
    }
    {
        let storedItem = localStorage.getItem("background-dim-slider")
        if(storedItem !== null && value == 1){
            changeRange("background-dim", storedItem)
        }
        else{
            changeRange("background-dim", 90)
        }
    }
    function changeCheckbox(element="", enable=0){
        if(enable == 0){
            document.getElementById(element).checked = false;
            return;
        }
        document.getElementById(element).checked = true;
    }
    function changeRange(element, defaultValue=100){
        let storedElement = localStorage.getItem(element)
        if(storedElement === null ){
            document.getElementById(element+"-slider").value = defaultValue;
            syncRangeText(element)
        }
        else{
            document.getElementById(element+"-slider").value = storedElement;
            syncRangeText(element)
        }
    }
}

function syncRangeText(element=""){
    let range = document.getElementById(element+"-slider")
    let value = range.value
    switch(element){
        case "cursor-size":
            if (value < 10){
                range.value = 10
                value = 10
            }
            document.getElementById(element+"-span").textContent = (value / 100).toString() + "x"
            break;
        case "background-dim":
            document.getElementById(element+"-span").textContent = (value).toString() + "%"
            break;
            
    } 
}
async function checkDiscordId(id=""){
    let discordIdInput = document.getElementById("input-1");
    let split = discordIdInput.value.split("#");
    discordIdErrors = [];
    
    // Checar Se Formato E string#int
    if (!(discordIdInput.value.indexOf("#") > -1)){
        discordIdErrors.push("ID INVÁLIDO! FORMATO CORRETO (luis10barbo#3251)");
    }
    else if(isNaN(split[1])){
        discordIdErrors.push("FINAL DO ID NÃO E NÚMERO! FORMATO CORRETO (#3251)"); 
    }
    else if(split[1].length > 4 || split[1].length < 4){
        discordIdErrors.push("ID CONTEM MAIS/MENOS QUE 4 DÍGITOS! FORMATO CORRETO (#1234)");
    }
    let span = document.getElementById("input-1-error-span");
    var string = "";
    if (discordIdErrors.length > 0){
        enableError("input-1", 1)
        for(let error in discordIdErrors){
            string = string + discordIdErrors[error] + "\n"
        }
        span.textContent = string;
    }
    else{
        enableError("input-1", 0)
    }

}
async function checkBeatmapDomain(){
    let beatmapDomainInput = document.getElementById("input-3").value
    profileDomainErrors = [];
    if(beatmapDomainInput.length === 0){
        console.error("No value specified!");
    }
    if(!(beatmapDomainInput.startsWith("https://"))){
        profileDomainErrors.push("LINK SEM 'https://' NO COMEÇO!");
    }
    else if(!(beatmapDomainInput.includes("osu.ppy.sh/beatmapsets/"))){
        profileDomainErrors.push("LINK NÃO É UM BEATMAP NO BANCHO! FORMATO CORRETO 'https://osu.ppy.sh/beatmapsets/'");
    }
    else if(!(beatmapDomainInput.includes("#osu"))){
        profileDomainErrors.push("BEATMAP NÃO É DO OSU!STANDARD! CERTIFIQUE-SE DE TER '#osu' NO LINK");
    }
    let span = document.getElementById("input-3-error-box");
    var string = "";
    if (profileDomainErrors.length > 0){
        enableError("input-3", 1)
        for(let error in profileDomainErrors){
            string = string + profileDomainErrors[error] + "\n"
        };
        span.textContent = string;
    }
    else{
        enableError("input-3", 0)
    }
}

async function checkProfileDomain(){
    let domainBeatmapInput = document.getElementById("input-2").value;
    beatmapDomainErrors = [];
    var domainSplit = domainBeatmapInput.split("/");
    if(domainBeatmapInput.length === 0){
        console.error("No value specified!");
    }
    if(!(domainBeatmapInput.startsWith("https://"))){
        beatmapDomainErrors.push("LINK SEM 'https://' NO COMEÇO!");
    }
    else if(!(domainBeatmapInput.includes("osu.ppy.sh/users/"))){
        beatmapDomainErrors.push("LINK NÃO É UM PERFIL NO BANCHO! FORMATO CORRETO 'https://osu.ppy.sh/users/'");
    }
    else if((isNaN(domainSplit[domainSplit.length - 1])) || domainSplit[domainSplit.length - 1].length == 0 ){
        beatmapDomainErrors.push("FINAL DO LINK NÃO É UM NÚMERO. FORMATO CORRETO 'users/*numeros do id*'");
    }
    let span = document.getElementById("input-2-error-box");
    var string = ""
    if (beatmapDomainErrors.length > 0){
        enableError("input-2", 1)
        for(let error in beatmapDomainErrors){
            string = string + beatmapDomainErrors[error] + "\n"
        }
        span.textContent = string;
    }
    else{
        enableError("input-2", 0)
    }
}
async function checkSkinInput(){
    await sleep(100)
    var input = document.getElementById("input-4");
    skin = input.value
    openSkinJson()
    function checkInput(json=""){
        let span = document.getElementById("input-4-error-box")
        let existsAtList = 0
        let value = ""
        for(i in json){
            let element = (json[i])
            if (element["skin"].toLowerCase() == skin.toLowerCase()) {
                existsAtList = 1
                value = element["skin"]
                break;
            }
        }
        if (existsAtList == 0){
            skinErrors = ["SKIN INVALIDA"]
            var string = ""
            for(let i in skinErrors){
                string += skinErrors[i]
            }
            span.textContent = string
            enableError("input-4", 1)
            return true;
        }
        input.value = value
        skinErrors = []
        changeSkinLock = 0
        enableError("input-4", 0)
    }
    function openSkinJson(){
        data = fetch("skins\\skins.json")
            .then(
                function(response){
                    return (response.json());
                }
            )
            .then(
                function(data){
                    checkInput(data);
                }
            )
    }
}
function setValue(id="", value=""){
    document.getElementById(id).value = value;
}
function addSkins(filter=""){
    changeSkinLock = 1;
    abrirJsonSkins();
    function addSkinsFunction(data){
        var key, count = 0;
        var containerElement = document.getElementById("skin-selector");
        containerElement.innerHTML = '';
        for(key in data){
            if (filter != ""){
                    filter = filter.toLowerCase();
                    var nomeSkin = data[key]["skin"].toLowerCase();
                    var matches = nomeSkin.indexOf(filter);
                    if (matches == -1){
                        continue; 
                    }
                }
            var selection = document.createElement("div");
            selection.setAttribute("class", "selection");
            selection.setAttribute("onclick", "setValue('input-4' ,'" + data[key]["skin"] + "');addSkins('"+ data[key]["skin"] + "');makeElementError('input-4-box', 0)")
            
            
            var nameBox = document.createElement("div");
            nameBox.setAttribute("class", "name-box");
            

            var wrapper = document.createElement("div");
            wrapper.setAttribute("class", "wrapper");
            var text = document.createElement("span");
            var string = document.createTextNode(data[key]["skin"]);
            text.appendChild(string);
            wrapper.appendChild(text);

            nameBox.appendChild(wrapper)
            selection.appendChild(nameBox)

            var node = document.createElement("div");

            
            var image = document.createElement("img");
            image.setAttribute("src", "skins/pictures/" + data[key]["skin"].replace("#", "") + ".jpg");
            selection.appendChild(image);
            containerElement.appendChild(selection);
            count += 1
        };
    };
    function abrirJsonSkins(){
        data = fetch("skins\\skins.json")
            .then(
                function(response){
                    return (response.json());
                }
            )
            .then(
                function(data){
                    addSkinsFunction(data);
                }
            )
    }
}

function convertPXVH(value, option="PX"){
    if(option=="PX"){
        return value * (100/window.innerHeight)
    }
    return document.documentElement.clientHeight * (100/value)
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
function makeElementError(id="", value=1){
    if(id.length === 0){
        console.error("No id specified at makeElementActive Function.");
        return false;
    }
    const element = document.getElementById(id);
    if(value == 1 && !(element.className.includes("error"))){
        element.className += " error";
        return true;
    }
    else if(value == 0 && (element.className.includes("error"))){
        element.className = element.className.replace(" error", "");
    }
}
function makeElementActive(id="", value=1 , customClass="active"){
    if(id.length === 0){
        console.error("No id specified at makeElementActive Function.");
        return false;
    }
    const element = document.getElementById(id);
    if(value == 1 && !(element.className.includes(" " + customClass))){
        element.className += " " + customClass;
        return true;
    }
    else if(value == 0 && (element.className.includes(" " + customClass))){
        element.className = element.className.replace(" " + customClass, "");
    }
}

function switchDarkMode(mode=1){
    // Dark mode -> mode=1
    // Light mode -> mode=0
    
    function changeWebsiteColors(mainColor, mainTextColor, secondColor, secondTextColor, thirdColor, forthColor, fifthColor, blackbgColor){
        root.style.setProperty("--main-color", mainColor);
        root.style.setProperty("--main-text-color", mainTextColor)
        root.style.setProperty("--second-color", secondColor);
        root.style.setProperty("--second-text-color", secondTextColor);
        root.style.setProperty("--third-color", thirdColor);
        root.style.setProperty("--forth-color", forthColor);
        root.style.setProperty("--fifth-color", fifthColor);
        root.style.setProperty("--blackbg-color", blackbgColor);
    };
    function changeButton(nightModeValue, lightModeValue){
        nightModePng.style.setProperty("scale",nightModeValue);
        lightModePng.style.setProperty("scale",lightModeValue);
        nightModePng.style.setProperty("opacity",nightModeValue);
        lightModePng.style.setProperty("opacity",lightModeValue);
    };
    const darkModeButton = document.getElementById("dark-light-button");
    const lightModePng = document.getElementById("light-mode-png");
    const nightModePng = document.getElementById("night-mode-png");

    var root = document.querySelector(":root");
    var rootStyle = getComputedStyle(root);
    if(mode == 0){
        // Light mode
        changeWebsiteColors("#eee", "black","rgb(208, 208, 208)", "black", "#959595", "#C4C4C4", "#bbb7b7", "#eee");
        //         changeWebsiteColors("#ebebeb", "rgb(255, 255, 255)", "black", "#b0b0b0", "#C6C6C6", "#9b9b9b");

        changeButton(1, 0);
        darkModeButton.setAttribute("onClick", "switchDarkMode(1)");
        
        localStorage.setItem("defaultLightMode", 0)
        return true;
    }
    // Dark mode
    changeWebsiteColors("#131313", "#FFFFFF","#2C2C2C", "#FFFFFF", "#525252", "#585858", "#3e3e3e", "#353535");
    changeButton(0, 1);
    
    localStorage.setItem("defaultLightMode", 1)
    darkModeButton.setAttribute("onClick", "switchDarkMode(0)");

    return true;
};
function getElementByIdFunc(id=""){
    if(id===""){
        console.error("No ID specified at getElementById");
        return true;
    }
    return document.getElementById(id);
};

function advancedOptionsFunction(){
    if(objectExpandLock == 1){
        return true;
    };
    if(advancedOptionsAction == undefined){
        advancedOptionsAction = advancedOptionsAction1;
    };
    var bodyElement = document.querySelector("body");
    var rootElement = document.querySelector(":root");
    
    
    
    advancedOptionsAction();    
    async function advancedOptionsAction1(){
        objectExpandLock = 1
        makeElementActive("advanced-options-button", 1);
        makeElementActive("advanced-options-arrow", 1);
        await sleep(130);
        


        var newHeight = String(convertPXVH(Number(getComputedStyle(bodyElement).getPropertyValue("min-height").replace("px", "")) + 600)) + "vh";
        rootElement.style.setProperty("--page-height", newHeight);

        makeElementActive('advanced-options-dropdown', 1);
        advancedOptionsAction = advancedOptionsAction2;
        await sleep (300);
        objectExpandLock = 0
    };
    async function advancedOptionsAction2(){
        objectExpandLock = 1
        makeElementActive('advanced-options-dropdown', 0); 

        
        var newHeight = String(convertPXVH(Number(getComputedStyle(bodyElement).getPropertyValue("min-height").replace("px", "")) - 600)) + "vh";
        rootElement.style.setProperty("--page-height", newHeight);
        makeElementActive("advanced-options-arrow", 0);
        await sleep(300);
        makeElementActive('advanced-options-button', 0);
        advancedOptionsAction = advancedOptionsAction1;
        objectExpandLock = 0
    };
};

function input4Function(value=0){
    if(objectExpandLock == 1){
        document.activeElement.blur()
        return true;
    };
    if (input4Action == undefined){
        input4Action = input4Action1
    }
    var bodyElement = document.querySelector("body");
    var rootElement = document.querySelector(":root");
    // var dropdownElement = document.querySelector()
    if (value==0){
        input4Action1()
    }
    if (value==1){
        input4Action0()
    }
    // input4Action();    

    async function input4Action1(){
        objectExpandLock = 1
        makeElementActive("input-4-box", 1);
        await sleep(190);
        
        var newHeight = String(convertPXVH(Number(getComputedStyle(bodyElement).getPropertyValue("min-height").replace("px", "")) + 281)) + "vh";
        rootElement.style.setProperty("--page-height", newHeight);
        makeElementActive('input-4-dropdown', 1);
        await sleep (300);
        objectExpandLock = 0
    };

    async function input4Action0(){
        objectExpandLock = 1
        makeElementActive('input-4-dropdown', 0); 

        var newHeight = String(convertPXVH(Number(getComputedStyle(bodyElement).getPropertyValue("min-height").replace("px", "")) - 281)) + "vh";
        rootElement.style.setProperty("--page-height", newHeight);
        await sleep(170);
        makeElementActive('input-4-box', 0);
        await sleep (300);
        objectExpandLock = 0
    };
};