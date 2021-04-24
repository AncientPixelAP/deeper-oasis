let INPUTS = {
    stickLeft: {
        name: "stickLeft",
        horizontal: 0,
        vertical: 0
    }, stickRight: {
        name: "stickRight",
        horizontal: 0,
        vertical: 0
    },
    btnA: createMyKey("btnA"),
    btnB: createMyKey("btnB"),
    btnX: createMyKey("btnX"),
    btnY: createMyKey("btnY"),
    btnStart: createMyKey("btnStart"),
    btnPause: createMyKey("btnPause"),
    btnShoulderLeft: createMyKey("btnShoulderLeft"),
    btnShoulderRight: createMyKey("btnShoulderRight"),
    btnTriggerLeft: createMyKey("btnTriggerLeft"),
    btnTriggerRight: createMyKey("btnTriggerRight"),
    btnUp: createMyKey("btnUp"),
    btnDown: createMyKey("btnDown"),
    btnLeft: createMyKey("btnLeft"),
    btnRight: createMyKey("btnRight"),
}

function createMyKey(_name){
    return {
        name: _name,
        pressed: false,
        justPressed: false,
        justReleased: false,
        pressedTime: 0,
        value: 0
    }
}