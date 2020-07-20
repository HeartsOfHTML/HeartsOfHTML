var gameName = localStorage.getItem("game_name")
var country = localStorage.getItem("country")

window.document.title = `${gameName} - Hearts of HTML`

const mainCanvasPercentage = 85
const uiCanvasPercentage = 15

var stage
var uiStage
var scrollLevel = 1
var worldMapBitmap
const scrollSpeed = 1.25

function init() {
    var canvas = document.getElementById("main-canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight * (mainCanvasPercentage / 100)

    canvas.addEventListener('wheel', scrollWheelMoved.bind(this));

    stage = new createjs.Stage(canvas)

    var worldMapImage = new Image()
    worldMapImage.src = "../images/BlankMap-World_1938.png"
    worldMapImage.onload = handleWorldMapImageLoad

    stage.addEventListener("stagemousedown", function(e) {
        var offset = { x: stage.x - e.stageX, y: stage.y - e.stageY };
        stage.addEventListener("stagemousemove", function(ev) {
            stage.x = ev.stageX + offset.x;
            stage.y = ev.stageY + offset.y;
            stage.update();
        });
        stage.addEventListener("stagemouseup", function() {
            stage.removeAllEventListeners("stagemousemove");
        });
    });
}

function handleWorldMapImageLoad(event) {
    var imageToShow = event.target
    worldMapBitmap = new createjs.Bitmap(imageToShow)

    var w = stage.canvas.width,
        h = stage.canvas.height

    var xratio = w / imageToShow.width,
        yratio = h / imageToShow.height,
        scale = true ? Math.min(xratio, yratio) : Math.max(xratio, yratio);

    worldMapBitmap.scaleX = worldMapBitmap.scaleY = scale;
    worldMapBitmap.x = (w - imageToShow.width * scale) / 2;
    worldMapBitmap.y = (h - imageToShow.height * scale) / 2;

    stage.addChild(worldMapBitmap)
    stage.update()

    document.getElementById("ui-canvas").width = window.innerWidth
    document.getElementById("ui-canvas").height = window.innerHeight * (uiCanvasPercentage / 100)
    uiStage = new createjs.Stage(document.getElementById("ui-canvas"))

    drawUiStage()

    stagesFullyLoaded()
}

function stagesFullyLoaded() {
    document.getElementById("loading-div").remove()
}

function updateMap() {
    stage.scaleX = scrollLevel
    stage.scaleY = scrollLevel
    var local = stage.globalToLocal(stage.mouseX, stage.mouseY);
    stage.regX = local.x;
    stage.regY = local.y;
    stage.x = stage.mouseX;
    stage.y = stage.mouseY;

    stage.update()
}

function scrollWheelMoved(action) {
    if (action.wheelDelta > 0 || action.detail > 0) {
        scrollLevel *= scrollSpeed
    }

    if (action.wheelDelta < 0 || action.detail < 0) {
        if (scrollLevel == 1) {
            stage.x = 0
            stage.y = 0
            stage.regX = 0
            stage.regY = 0

            updateMap()

            return
        }
        scrollLevel /= scrollSpeed
    }

    updateMap()
}

function drawUiStage() {
    var flagPlaceholder = new createjs.Shape()
    var flagHeight = document.getElementById("ui-canvas").height
    flagPlaceholder.graphics.beginFill("#000000").drawRect(0, 0, flagHeight * 2, flagHeight)

    uiStage.addChild(flagPlaceholder)

    var saveButton = new createjs.Shape()
    var saveButtonSize = { w: 100, h: 25 }
    var saveButtonPosition = { x: window.innerWidth - saveButtonSize.w - 10, y: 10 }
    saveButton.graphics.beginFill("#757575").drawRect(saveButtonPosition.x, saveButtonPosition.y, saveButtonSize.w, saveButtonSize.h)
    var saveButtonText = new createjs.Text("Save game", "15px Arial", "#ffffff")
    saveButtonText.x = saveButtonPosition.x + 10
    saveButtonText.y = saveButtonPosition.y + 5

    saveButton.addEventListener("click", (event) => {
        saveGame()
    })

    uiStage.addChild(saveButton)
    uiStage.addChild(saveButtonText)

    uiStage.update()
}

function saveGame() {
    console.log("Saving...")

    var jsonToSave = {
        game_name: gameName,
        country: country
    }
    var filename = `${gameName} - ${country}.json`

    var a = document.createElement("a")
    var file = new Blob([JSON.stringify(jsonToSave)], { type: "text/plain" })
    a.href = URL.createObjectURL(file)
    a.download = filename
    a.click()
}