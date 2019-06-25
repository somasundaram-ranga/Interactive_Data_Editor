var figurecontainer = document.getElementById("figurecontainer"),
    data = [],
    cols = [0, 1, 2],
    ldata = [],
    lIniData = [],
    ranges = [],
    swapped = false,
    newCol = [0, 0, 0],
    curCol = false;
const {
    ipcRenderer
} = require('electron');
const Plotly = require('plotly.js-gl3d-dist');



ipcRenderer.on("sdata", function (e, d) {
    [data, swapped, newCol] = d;
    updatePlot();
    if (!curCol) curCol = newCol;
    if (newCol[0] !== curCol[0]) {
        curCol[0] = newCol[0];
        setXRange($("#xInp").val());
    } else if (newCol[1] !== curCol[1]) {
        curCol[1] = newCol[1];
        setYRange($("#yInp").val());
    } else if (newCol[2] !== curCol[2]) {
        curCol[2] = newCol[2];
        setZRange($("#zInp").val());

    }
})


function transpose(m) {
    return m[0].map((_, i) => m.map(x => x[i]));
};


function mark_clicked(mark) {
    if (mark.checked) {
        Plotly.restyle(figurecontainer, {
            'mode': "markers+lines"
        });
    } else {
        Plotly.restyle(figurecontainer, {
            'mode': "lines"
        });
    };
};


function getRange(lim, range, coln) {
    var min, max;
    lim = lim.split(",").map(x => parseFloat(x));

    if (range) {
        [min, max] = range;
    } else {
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






function makeRotation() {
    var issame = true,
        b = data[0][0].length;
    for (let a of data[0]) {
        if (a.length != b) {
            issame = false;
            break;
        };
    };

    if (issame) {
        xxx = transpose(data[0]);
        yyy = transpose(data[1]);
        zzz = transpose(data[2]);
        return;
    };

    var tmpData0 = [].concat(...data[0]).filter(x => x !== undefined),
        tmpData1 = [].concat(...data[1]).filter(x => x !== undefined),
        tmpData2 = [].concat(...data[2]).filter(x => x !== undefined);

    var tmp = [...new Set(tmpData1)].sort((a, b) => a - b);

    xxx = [], yyy = [], zzz = [];
    for (let x of tmp) {
        var tmp0 = [],
            tmp1 = [],
            tmp2 = [];
        for (let i = 0; i < tmpData0.length; i++) {
            if (tmpData1[i] == x) {
                tmp0.push(tmpData0[i]);
                tmp1.push(tmpData1[i]);
                tmp2.push(tmpData2[i]);
            };
        };
        xxx.push(tmp0);
        yyy.push(tmp1);
        zzz.push(tmp2);
    };
};



function initData(length) {
    var pl_data = [];
    for (var i = 0; i < length; i++) {
        pl_data.push({
            type: 'scatter3d',
            mode: "lines",
            x: [1, 2],
            y: [1, 2],
            z: [1, 2],
            marker: {
                size: 1.7,
                color: "#1f77b4"
            },
            line: {
                color: '#ff7f0e'
            },
            hoverinfo: "x+y+z",
            hoverlabel: {
                bgcolor: "#2ca02c"
            },
        })
    };
    return pl_data
};

var sIniData = [{
    type: 'surface',
    hoverinfo: "x+y+z",
    colorscale: "Portland",
    showscale: false,
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
    ]
}];


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
    showlegend: false,
    scene: {
        aspectmode: "cube",
        zaxis: {
            autorange: true,
            spikesides: false,
        },
        yaxis: {
            spikesides: false,
        },
        xaxis: {
            spikesides: false,
        }
    },
};


Plotly.addTraces(figurecontainer,[{
    type: 'surface',
    hoverinfo: "x+y+z",
    colorscale: "Viridis",
    showscale:false,
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
    ]
}])

Plotly.restyle(figurecontainer, { 'x': [data[0]], 'y': [data[1]], 'z': [data[6]]},1);


Plotly.relayout(figurecontainer,{
    scene: {
        aspectmode:"manual",
        aspectratio:{
            x: 1,
            y : .8,
            z: .5
        },
        zaxis: {
            showgrid: false,
            zeroline: false,
            showline: true,
            title: "u (a.u.)",
            titlefont:{
                family:"Times New Roman",
                size : 40
            },
            // dtick:0.05,
            tickfont:{
                family:"Times New Roman",
                size : 20
            },
            ticks: "outside"
        },
        yaxis: {
            showgrid: false,
            zeroline: false,
            showline: true,
            automargin:true,
            title: "R (a.u.)",
            titlefont:{
                family:"Times New Roman",
                size : 40
            },
            dtick:1,
            tickfont:{
                family:"Times New Roman",
                size : 20
            },
            ticks: "outside",
            tickprefix:"   "
        },
        xaxis: {
            showgrid: false,
            zeroline: false,
            showline: true,
            title: "r (a.u.)",
            titlefont:{
                family:"Times New Roman",
                size : 40
            },
            dtick:1,
            tickfont:{
                family:"Times New Roman",
                size : 20
            },
            ticks: "outside"
        }
    },
})


// Plotly.relayout(figurecontainer,{
//     scene:{
//         yaxis:{
//             dtick:1,
//             tickfont:{
//                 family:"Times New Roman",
//                 size : 15
//             },
//         }
//     }
// })

// Plotly.downloadImage(figurecontainer, {format: 'svg', width: 2000, height: 1500});


var mode={
    modeBarButtonsToRemove : ["toImage"],
    modeBarButtonsToAdd    : [
        [
            {
                name: 'test',
                icon: Plotly.Icons.camera,
                click: function(){alert('dhqwduh2qu')}
            }
        ]
    ]
}

// // Plotly.restyle(figurecontainer, {opacity:.95})
Plotly.restyle(figurecontainer,{
    showscale:false,
    contours:{
        x:{
            show: false,
            start: 1,
            end : 10,
            size: .5,
            color: '#3a3a3a',
            // usecolormap: false,
            width : 1
        },
        y:{
            show: false,
            start: 0,
            end : 10,
            size: .5,
            color: '#3a3a3a',
            // usecolormap: true,
            width : 1
        }
    }
})
// // 03af0f
// // #ed2704
// 0211ea

// 
var trace={
    type: 'surface',
    hoverinfo: "x+y+z",
    colorscale: "Portland",
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
    cmin: cmin,
    cmax: cmax,
    cauto:false,
    colorbar:{
        thickness:30,
        dtick:5,
        tickfont:{
            family:"Times New Roman",
            size : 20
        },
    },
    contours:{
        x:{
            show: true,
            start: 1,
            end : 10,
            size: .5,
            color: '#000',
            usecolormap: false,
            width : 1
        },
        y:{
            show: true,
            start: 0,
            end : 10,
            size: .5,
            color: '#000',
            usecolormap: false,
            width : 1
        },
        z:{
            show: false,
            start: 0,
            end : 10,
            size: .5,
            color: '#000',
            usecolormap: false,
            width : 1
        }
    }
}

var newLayout = {
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
    showlegend: false,
    scene: {
        aspectmode:"manual",
        aspectratio:{
            x: 1,
            y : .8,
            z: .5
        },
        zaxis: {
            range:[],
            autorange: true,
            spikesides: false,
            showgrid: false,
            zeroline: false,
            showline: true,
            title: "u (a.u.)",
            titlefont:{
                family:"Times New Roman",
                size : 40
            },
            dtick:5,
            tickfont:{
                family:"Times New Roman",
                size : 20
            },
            tickformat:'',
            ticks: "outside"
        },
        yaxis: {
            range:[],
            autorange: true,
            spikesides: false,
            showgrid: false,
            zeroline: false,
            showline: true,
            automargin:true,
            title: "R (a.u.)",
            titlefont:{
                family:"Times New Roman",
                size : 40
            },
            dtick:2,
            tickfont:{
                family:"Times New Roman",
                size : 20
            },
            ticks: "outside",
            tickformat:'',
            // tickprefix:"   "
        },
        xaxis: {
            range:[],
            autorange: true,
            spikesides: false,
            showgrid: false,
            zeroline: false,
            showline: true,
            title: "r (a.u.)",
            titlefont:{
                family:"Times New Roman",
                size : 40
            },
            dtick:2,
            tickfont:{
                family:"Times New Roman",
                size : 20
            },
            ticks: "outside",
            tickformat:''
        }
    },
}
