var figurecontainer = document.getElementById("figurecontainer"),
    data = [],
    cols = [0, 1, 2],
    ldata = [],
    lIniData = [],
    ranges = [],
    swapped = false,
    newCol = [0, 0, 0],
    curCol = false;
    zCols = []
const Plotly = require('plotly.js-gl3d-dist');
const fs = require("fs");
const {ipcRenderer, remote,shell } = require('electron');
const path = require('path');
const { dialog } = remote;



var trace={
    type: 'surface',
    hoverinfo: "x+y+z",
    colorscale: "Portland",
    opacity: 1,
    name : 'fewfui',
    hoverlabel: {
        bgcolor: "#2ca02c"
    },
    z: [
        [1]
    ],
    x: [
        [1]
    ],
    y: [
        [1]
    ],
    showscale: false,
    cmin: 0,
    cmax: 0,
    cauto:true,
    colorbar:{
        thickness:30,
        dtick:0,
        tickfont:{
            family:"Times New Roman",
            size : 20
        },
    },
    contours:{
        x:{
            show: false,
            start: 0,
            end : 0,
            size: 1,
            color: '#000',
            usecolormap: false,
            width : 1
        },
        y:{
            show: false,
            start: 0,
            end : 0,
            size: 1,
            color: '#000',
            usecolormap: false,
            width : 1
        },
        z:{
            show: false,
            start: 0,
            end : 0,
            size: 0,
            color: '#000',
            usecolormap: false,
            width : 1
        }
    }
}

var layout = {
    height: window.innerHeight + 68,
    width: window.innerWidth - 17,
    margin: {
        t: 0,
        r: 50,
        b: 0,
        l: 25,
        pad: 0
    },
    autorange: true,
    spikesides: false,
    showlegend: true,
    scene: {
        aspectmode:"manual",
        aspectratio:{
            x: 1,
            y: 1,
            z: 1
        },
        zaxis: {
            range:['',''],
            autorange: true,
            spikesides: true,
            showgrid: true,
            zeroline: true,
            showline: true,
            title: "",
            titlefont:{
                family:"Times New Roman",
                size : 10
            },
            dtick:0,
            tickfont:{
                family:"Times New Roman",
                size : 15
            },
            tickformat:'',
            ticks: "outside"
        },
        yaxis: {
            range:[],
            autorange: true,
            spikesides: true,
            showgrid: true,
            zeroline: true,
            showline: true,
            automargin:true,
            title: "",
            titlefont:{
                family:"Times New Roman",
                size : 10
            },
            dtick:0,
            tickfont:{
                family:"Times New Roman",
                size : 15
            },
            ticks: "outside",
            tickformat:'',
            // tickprefix:"   "
        },
        xaxis: {
            range:[],
            autorange: true,
            spikesides: true,
            showgrid: true,
            zeroline: true,
            showline: true,
            title: "",
            titlefont:{
                family:"Times New Roman",
                size : 10
            },
            dtick:0,
            tickfont:{
                family:"Times New Roman",
                size : 15
            },
            ticks: "outside",
            tickformat:''
        }
    },
}

var mode={
    displaylogo:false,
    modeBarButtonsToRemove : ["toImage","sendDataToCloud"],
    modeBarButtonsToAdd    : [
        [
            {
                name: 'Save the image',
                icon: Plotly.Icons.camera,
                click: function(){$('#download').show();}
            }
        ]
    ]
}


//plotting a dummy surface plot and adding the updateJSON funtion to it
Plotly.newPlot(figurecontainer, [trace], layout, mode);
figurecontainer.on("plotly_relayout", updateJSON);



function getIndex(){
    var ind = document.getElementById('trace').selectedIndex;
}



function transpose(m) {
    return m[0].map((_, i) => m.map(x => x[i]));
};


//this array contains all the data, for later now
// var fullData = []

function addNewTrace(){

}


// loads file from the dialog box
function fileLoader() {
    const fname = dialog.showOpenDialog({ properties: ['openFile'] })[0];
    var dirname = path.dirname(fname);
    var filename = path.basename(fname)
    var strDps = fs.readFileSync(fname, "utf8");
    strDps = strDps.trim().split(/\t\t\t\t\t|\n\n/);
    col = strDps[0].trim().split("\n")[0].trim().split(/[\s\t]+/).length;
    data = [...Array(col)].map(_ => Array());
    for (var i = 0; i < strDps.length; i++) {
        blocks = strDps[i].trim().split("\n");
        for (var j = 0; j < blocks.length; j++) {
            blocks[j] = blocks[j].trim().split(/[\s\t]+/);
        };
        blocks = transpose(blocks);
        for (var k = 0; k < col; k++) {
            data[k].push(blocks[k]);
        };
    };

    //update the select boxes
    var op = "";
    for (var i = 1; i <= col; i++) {
        op += '<option>' + i + '</option>';
    };
    var tmp = $("#colSel select");
    for (var i = 0; i < tmp.length; i++) {
        tmp[i].innerHTML = op;
        tmp[i].selectedIndex = i;
    };


    for (var i = 0; i < col; ++i) {
        let flat_dat = [].concat(...data[i]);
        ranges.push([Math.min(...flat_dat), Math.max(...flat_dat)]);
    };
    updatePlot(0);
    $("#file_name1").html(filename);
}


//adds new plot with colz as new z column
function addNewPlot(){
    var thisInd = figurecontainer.data.length
    var op = "";
    for(let i=1;i<=thisInd+1;i++){
        op += '<option>' + i + '</option>';
    }
    document.getElementById('trace').innerHTML = op
    document.getElementById('trace').selectedIndex = thisInd
    Plotly.addTraces(figurecontainer,trace)
    updatePlot(thisInd)
}


function selUpdate() {

};


function colUpdate(){

}

function updateThisPlot(){
    var ind = document.getElementById('trace').selectedIndex;
    updatePlot(ind)
}

//only surface plots
function updatePlot(thisInd) {
    // var thisInd = figurecontainer.data.length
    // thisInd = 0
    cols = [];
    for (let a of $("#colSel select")) {
        cols.push(a.selectedIndex)
    };
        Plotly.restyle(figurecontainer, { "x": [data[cols[0]]], "y": [data[cols[1]]], "z": [data[cols[2]]] },thisInd);
};



function getRange(lim, range, coln) {
    var min, max;
    lim = lim.split(",").map(x => parseFloat(x));

    if (range) {
        [min, max] = range;
    } else {
        //ranges are already calculated
        var flat_dat = data[coln].flat();
        max = Math.max(...flat_dat);
        min = Math.min(...flat_dat);
    };

    if (isNaN(lim[0])) {
        lim[0] = min;
    };
    if (isNaN(lim[1])) {
        lim[1] = max;
    };
    cmin = Math.max(lim[0], min);
    cmax = Math.min(lim[1], max);
    return [lim, [cmin, cmax]];
};


//fix these range false business
function setXRange(lim, range = false) {
    if (lim == "") {
        Plotly.relayout(figurecontainer, {
            "scene.xaxis.autorange": true
        });
        return;
    };
    [lim, _] = getRange(lim, range, cols[0]);
    Plotly.relayout(figurecontainer, {
        "scene.xaxis.range": lim
    });
};


function setYRange(lim, range = false) {
    if (lim == "") {
        Plotly.relayout(figurecontainer, {
            "scene.yaxis.autorange": true
        });
        return;
    };
    [lim, _] = getRange(lim, range, cols[1]);
    Plotly.relayout(figurecontainer, {
        "scene.yaxis.range": lim
    });
};


function setZRange(lim, range = false) {
    if (lim == "") {
        Plotly.relayout(figurecontainer, {
            "scene.zaxis.autorange": true
        });
        return;
    };
    [lim, [cmin, cmax]] = getRange(lim, range, cols[2]);
    // Plotly.update(figurecontainer, {
    //     "cmin": cmin,
    //     "cmax": cmax
    // }, {
    //     "scene.zaxis.range": lim
    //     });
    Plotly.relayout(figurecontainer, {
        'scene.zaxis.range': lim,
    })
    Plotly.restyle(figurecontainer, {
        "cmin": cmin,
        "cmax": cmax
    })
};





// Plotly.restyle(figurecontainer,{
//     [
//         {colorscale: "Earth"},
//         {colorscale: "Portland"}
//     ]
// })
//downloads the image
function downloadImage(){
    var fileName = $('#dfileName').val()
    var type = $('#fileFormat').val().toLocaleLowerCase()
    var res = $('#imRes').val().split("x")
    Plotly.downloadImage(figurecontainer, {filename: fileName, format: type, width: res[1], height: res[0]});
    $('#download').hide();
}

//called from the modebar triggers the download window
// function triggerDownload(){
//     $('#download').show();
// }






var minWidth = window.innerWidth / 3

$('#split-bar').mousedown(function (e) {
    e.preventDefault();
    $(document).mousemove(function (e) {
        e.preventDefault();
        var x = e.pageX - $('#sidebar').offset().left;
        if (x > minWidth / 5.0 && x < window.innerWidth / 2.5) {
            $('#sidebar').css("width", x - 2);
            $('#full').css("margin-left", x);
            minWidth = x;
            // resizePlot()
        }
    })
});


$('#split-bar2').mousedown(function (e) {
    e.preventDefault();
    $(document).mousemove(function (e) {
        e.preventDefault();
        var x = e.pageX - $('#sidebar2').offset().left;
        if (x > minWidth / 5.0 && x < window.innerWidth / 2.5) {
            $('#sidebar2').css("width", x - 2);
            $('#full').css("margin-left", x);
            $('#jsoneditor').css("width", x - 7);
            minWidth = x;
            // resizePlot()
        }
    })
});


$(document).mouseup(function (e) {
    $(document).unbind('mousemove');
});

var minWidth = window.innerWidth / 4.5
function openNav() {
    $('#split-bar2').css("width", 5);
    $('#sidebar2').css("width", minWidth);
    $('#jsoneditor').css("width", minWidth - 5);
    $('.floatdiv').css("margin-left", minWidth + 15);
    $('.basediv').css("margin-left", minWidth + 6);
    $('.ham').toggle()
// resizePlot()
}


function closeNav() {
    $('#split-bar2').css("width", 0);
    $('#sidebar2').css("width", 0);
    $('.floatdiv').css("margin-left", 10);
    $('.basediv').css("margin-left", 0);
    $('#jsoneditor').css("width", 195);
    $('.ham').toggle()
// resizePlot()
}



$('#split-bar2').mousedown(function (e) {
    e.preventDefault();
    $(document).mousemove(function (e) {
        e.preventDefault();
        var x = e.pageX - $('#sidebar2').offset().left;
        if (x > minWidth / 5.0 && x < window.innerWidth / 2.5) {
            $('#sidebar2').css("width", x - 2);
            // $('#full').css("margin-left", x);
            $('.floatdiv').css("margin-left", x+10);
            $('.basediv').css("margin-left", x);
            $('#jsoneditor').css("width", x - 7);
            minWidth = x;
            // resizePlot()
        }
    })
});



$(document).mouseup(function (e) {
$(document).unbind('mousemove');
});



var typeList = ["Arial", "Balto", "Courier New", "Droid Sans",, "Droid Serif", "Droid Sans Mono", "Gravitas One", "Old Standard TT", "Open Sans", "Overpass", "PT Sans Narrow", "Raleway", "Times New Roman"]
var symList =["circle","circle-open","circle-dot","circle-open-dot","square","square-open","square-dot","square-open-dot","diamond","diamond-open","diamond-dot","diamond-open-dot","cross","cross-open","cross-dot","cross-open-dot","x","x-open","x-dot","x-open-dot","triangle-up","triangle-up-open","triangle-up-dot","triangle-up-open-dot","triangle-down","triangle-down-open","triangle-down-dot","triangle-down-open-dot","triangle-left","triangle-left-open","triangle-left-dot","triangle-left-open-dot","triangle-right","triangle-right-open","triangle-right-dot","triangle-right-open-dot","triangle-ne","triangle-ne-open","triangle-ne-dot","triangle-ne-open-dot","triangle-se","triangle-se-open","triangle-se-dot","triangle-se-open-dot","triangle-sw","triangle-sw-open","triangle-sw-dot","triangle-sw-open-dot","triangle-nw","triangle-nw-open","triangle-nw-dot","triangle-nw-open-dot","pentagon","pentagon-open","pentagon-dot","pentagon-open-dot","hexagon","hexagon-open","hexagon-dot","hexagon-open-dot","hexagon2","hexagon2-open","hexagon2-dot","hexagon2-open-dot","octagon","octagon-open","octagon-dot","octagon-open-dot","star","star-open","star-dot","star-open-dot","hexagram","hexagram-open","hexagram-dot","hexagram-open-dot","star-triangle-up","star-triangle-up-open","star-triangle-up-dot","star-triangle-up-open-dot","star-triangle-down","star-triangle-down-open","star-triangle-down-dot","star-triangle-down-open-dot","star-square","star-square-open","star-square-dot","star-square-open-dot","star-diamond","star-diamond-open","star-diamond-dot","star-diamond-open-dot","diamond-tall","diamond-tall-open","diamond-tall-dot","diamond-tall-open-dot","diamond-wide","diamond-wide-open","diamond-wide-dot","diamond-wide-open-dot","hourglass","hourglass-open","bowtie","bowtie-open","circle-cross","circle-cross-open","circle-x","circle-x-open","square-cross","square-cross-open","square-x","square-x-open","diamond-cross","diamond-cross-open","diamond-x","diamond-x-open","cross-thin","cross-thin-open","x-thin","x-thin-open","asterisk","asterisk-open","hash","hash-open","hash-dot","hash-open-dot","y-up","y-up-open","y-down","y-down-open","y-left","y-left-open","y-right","y-right-open","line-ew","line-ew-open","line-ns","line-ns-open","line-ne","line-ne-open","line-nw","line-nw-open"]
var colorPallete = ['Greys','YlGnBu','Greens','YlOrRd','Bluered','RdBu','Reds','Blues','Picnic','Rainbow','Portland','Jet','Hot','Blackbody','Earth','Electric','Viridis','Cividis']

var schema ={
    "properties":{
        "Traces":{
            "items":{
                "properties":{
                    "colorscale":{
                        "enum":colorPallete
                    },
                    "opacity":{
                        "type":"number"
                    }
                }
            }
        },
        "Layout":{
            "properties":{
                "height":{
                    "type":"number"
                }
            }
        }
    }
}


var options = {
    onChangeJSON: function (json) {
        var upTrace = {
            hoverinfo: [],
            colorscale: [],
            autocolorscale:[],
            opacity: [],
            name : [],
            hoverlabel:[],
            showscale: [],
            cmin: [],
            cmax: [],
            cauto:[],
            colorbar:[],
            contours:[]
        }

        for(let item of json.Traces){
            for (let key of Object.keys(upTrace)){
                upTrace[key].push(item[key])
                console.log(item[key])
            }
        }
        // Plotly.relayout(figurecontainer, json.layout)
        Plotly.update(figurecontainer, upTrace, json.Layout)
        // makeRows();
    },
    onColorPicker: function (parent, color, onChange) {
        new JSONEditor.VanillaPicker({
            parent: parent,
            color: color,
            popup: 'bottom',
            onChange: function (color) {
                var alpha = color.rgba[3]
                var hex = (alpha === 1) ?
                    color.hex.substr(0, 7) :
                    color.hex
                onChange(hex)
            },
            //   onDone: function (color) {
            //     console.log('onDone', color)
            //   },
            //   onClose: function (color) {
            //     console.log('onClose', color)
            //   }
        }).show();
    },
    mode: 'form',
    schema: schema
};

var jsoneditor = document.getElementById('jsoneditor')
var editor = new JSONEditor(
jsoneditor,
options, {
"Traces": '',
"Layout": ''
});
$('#jsoneditor').height(window.innerHeight - jsoneditor.offsetTop)



function updateJSON() {
    var Traces=[]
    for (let trace of figurecontainer.data) {
        let tmp = JSON.parse(JSON.stringify(trace))
        delete tmp.type 
        delete tmp.x 
        delete tmp.y 
        delete tmp.z
        Traces.push(tmp)
    }

    Layout = figurecontainer.layout
    editor.update({
        Traces,
        Layout
    })
}



function hotKeys(e) {
    if (document.activeElement.type == "text") {
        return;
    };
    if(e.key=="b" && e.ctrlKey){
        if ($('#sidebar2').width()) {
            closeNav();
        } else {
            openNav();
        }
    }
}
$(window).keydown(hotKeys);