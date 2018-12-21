const electron = require('electron');
const path = require('path');
const url = require('url');

var mainWindow,win;
process.env.NODE_ENV = 'production';

const {app, BrowserWindow, Menu, ipcMain} = electron;

ipcMain.on("nameMsg",function(e,d){
    win = new BrowserWindow({});
    console.log(d)
      win.loadURL(url.format({
        pathname: d,
        protocol: 'file:',
        slashes:true
      }));
})



app.on('ready', function(){

    mainWindow = new BrowserWindow({show:false});
    mainWindow.maximize();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes:true
    }));

      mainWindow.on('closed', function(){
        app.quit();
      })

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.show()
});

const mainMenuTemplate =  [
        {
        label: 'File',
        submenu:[
        {
            label : "Save",
            accelerator:process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
            click(){
                mainWindow.webContents.send("data","save");
            }
        },
        {
            label : "Save As",
            accelerator:process.platform =='darwin' ? 'Command+Ctrl+S' : 'Shift+Ctrl+S',
            click(){
                mainWindow.webContents.send("data","saveas");
            }
        },
        {type:'separator'},
        {
            label:'Go Home',
            accelerator:process.platform == 'darwin' ? 'Command+H' : 'Ctrl+H',
            click(){
                mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes:true
                }));
            }
        },
            {
                role: "reload"
            },
            {type:'separator'},
            {
                role:"close",
            }
        ]
    },
    {
        label: "Edit",
        submenu:[
        {
            label: "CS somoothing",
            accelerator:process.platform =='darwin' ? 'D' : 'D',
            click(){
                mainWindow.webContents.send("data","saveas");
            }
        },
        {
            label: "MA Smoothing",
            accelerator:process.platform =='darwin' ? 'M' : 'M',
            click(){
                mainWindow.webContents.send("data","saveas");
            }
        },
        {
            label: "Change Sign",
            accelerator:process.platform =='darwin' ? 'C' : 'C',
            click(){
                mainWindow.webContents.send("data","saveas");
            }
        },
        {
            label: "Undo/Redo",
            accelerator:process.platform =='darwin' ? 'Command+Z' : 'Ctrl+Z',
            click(){
                mainWindow.webContents.send("data","saveas");
            }
        }
        ]
    },
    {
        label : "Help",
        submenu:[
        {
            label: "Help",
            click(){
                var childWindow = new BrowserWindow({icon: path.join(__dirname, 'icons/charts.ico')});
                childWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'help.html'),
                protocol: 'file:',
                slashes:true
                }));
                childWindow.setMenu(null);
                }
        },
        {
            label: "About",
            click(){
                var childWindow = new BrowserWindow({width:500,height:500});
                childWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'about.html'),
                protocol: 'file:',
                slashes:true
                }));
                childWindow.setMenu(null);
                }
        },
        ]
    }
];
