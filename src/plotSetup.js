var data = [],
    compdata = [],
    olddata = "",
    dpsx = [],
    dpsy = [],
    dpsy2 = [],
    index = [],
    del_dat = [],
    th_in = 0,
    refdat = 1,
    ma = 1,
    file, points,
    serve = 0,
    lockXc = 1,
    swapped = 0,
    swapper = false,
    ddd = false,
    col = {
        x: 0,
        y: 0,
        z: 0,
        s: 0
    },
    xName = "X",
    $slider = $("#slider"),
    xCol = document.getElementById("xCol"),
    yCol = document.getElementById("yCol"),
    zCol = document.getElementById("zCol"),
    sCol = document.getElementById("sCol"),
    xVal = document.getElementById("x_val"),
    figurecontainer = document.getElementById("figurecontainer"),
    $ch = $("#custom-handle")
    const Plotly = require('plotly.js-gl3d-dist');





var layout = {
    autosize: true,
    plot_bgcolor: "#fafafa",
    paper_bgcolor: '#fff',
    showlegend: false,
    hovermode: "closest",
    title: '',
    titlefont:{
        family:"Droid Sans",
        size:20,
        color:'#000000'
    },
    margin: {
        t: 25,
        r: 0,
        b: 19,
        l: 10,
        pad: 0
    },
    xaxis: {
        title: '',
        zeroline: false,
        showline: true,
        showgrid: true,
        automargin: true,
        // tick0:'',
        dtick:'',
        titlefont:{
            family:"Droid Sans",
            size:20,
            color:'#000000'
        }
        
    },
    yaxis: {
        title: '',
        automargin: true,
        zeroline: false,
        showline: true,
        tickformat: " ,.5g",
        // tick0:'',
        dtick:'',
        hoverformat: " ,.6g",
        showgrid: true,
        titlefont:{
            family:"Droid Sans",
            size:20,
            color:'#000000'
        }
    },
    font: {
        size: 14
    },
    showlegend: true,
    legend: {
        x: 0,
        y: 1
    }
};

var colorList = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]

var iniPointsD = {
    x: [1],
    y: [1],
    type: 'scatter',
    opacity: 1,
    mode: 'markers+lines',
    marker: {
        symbol: "circle-dot",
        color: '#b00',
        size: 6,
        opacity: 1
    },
    line: {
        width: 2,
        color: "#1e77b4",
        dash: 0,
        shape: 'linear'
    },
    hoverinfo: 'x+y',
};


var iniPointsC = {
    x: [1],
    y: [1],
    type: 'scatter',
    opacity: 1,
    mode: 'markers+lines',
    marker: {
        symbol: "circle-dot",
        color: '#b00',
        size: 6,
        opacity: 1
    },
    line: {
        width: 2,
        color: "#1e77b4",
        dash: 0,
        shape: 'linear'
    },
    hoverinfo: 'x+y',
};


function triggerDownload(){
    var div = document.createElement('div');
    div.id = 'download'
    div.innerHTML = `<div class='jjjj'><b> Save the image</b><br></div>
                    &ensp; File Name: <input type="text" id= "dfileName"><br>
                    &ensp; File Type:<select id="fileFormat">
                    <option>PDF</option>
                    <option>JPEG</option>
                            <option>PNG</option>
                            <option>SVG</option>
                            <option>WEBP</option>
                        </select><br>
                    &ensp; Image Resolution: <input type="text" id="imRes" value="1920x1080" list="resl" >
                    <datalist id="resl">
                    <option value="640×480">
                    <option value="800×600">
                    <option value="960×720">
                    <option value="1280×720">
                    <option value="1600×900">
                    <option value="1280×960">
                    <option value="1920×1080">
                    <option value="1440×1080">
                    <option value="1600×1200">
                    <option value="1856×1392">
                    <option value="1920×1440">
                    <option value="2560×1440">
                    <option value="2048×1536">
                    <option value="3840×2160">
                  </datalist>
                    <br>
                    <div  class='jjjj'>
                        <input type="submit" value="OK" onclick="downloadImage();$('#download').remove();">
                        <input type="submit" value="Cancel" onclick="$('#download').remove();">
                    </div>`.trim()
    document.body.appendChild(div)
}



var mode={
    displaylogo:false,
    editable: true,
    modeBarButtonsToRemove : ["toImage","sendDataToCloud"],
    modeBarButtonsToAdd    : [
        [
            {
                name: 'Save the image',
                icon: Plotly.Icons.camera,
                click: triggerDownload
            }
        ]
    ]
}
Plotly.newPlot(figurecontainer, [iniPointsD], layout, mode);

// pointscontainer = figurecontainer.querySelector(".scatterlayer .trace:first-of-type .points");
// points = figurecontainer.querySelector(".trace:first-of-type .points").getElementsByTagName("path");
points = figurecontainer.getElementsByClassName('points')[0].getElementsByTagName('path')


resizePlot();

$slider.slider({
    min: 0,
    max: 0,
    step: 1,
    slide: function (event, ui) {
        th_in = ui.value;
        sliderChanged();
    }
});



ipcRenderer.on("rf",  (e, d)=> fileReader(d))

ipcRenderer.on('checkClose', function (e, d) {
    if (!saved) var res = dialog.showMessageBoxSync({
        type: "warning",
        title: "Unsaved data found!!!",
        message: "Do you want to quit without saving the changes ?",
        buttons: ['Yes', "No"]
    });
    if (!res) ipcRenderer.send('checkClose', 'closeIt');
})


ipcRenderer.on("menuTrigger", (e, d) =>{
    if (show) console.log(e, d);
    if(d=="open") fileLoader()
});


// function firstWidth(){
//     let elem = $('#container')
//     let per = elem.width()*100/elem.parent().width()
//     // $('#filler').css({'width': per+'%'});
//     $('#filler').css({'width': $('#container').width()});
//     // $('#extendutils').css({'width': per+'%'});
// }
$('#filler').width($('#container').parent().width())
window.addEventListener('resize', () => $('#filler').width($('#container').parent().width()));