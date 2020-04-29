(function (global) {
    let myMap;
    let view;
    let coronaLayer;
    let legend;
    let graphic;
    let popupTemp = {
        title: `{Country_Region}`,
        content: [{
            type: "fields",
            fieldInfos: [{
                    fieldName: "Lat",
                    label: "Latitude"
                },
                {
                    fieldName: "Long_",
                    label: "Longitude"
                },
                {
                    fieldName: "Confirmed",
                    label: "Confirmed Cases"
                },
                {
                    fieldName: "Deaths",
                    label: "Deaths"
                },
                {
                    fieldName: "Recovered",
                    label: "Recovered"
                }

            ]
        }]
    }
    class Symbol {
        constructor(size, color, type) {
            this.color = color === undefined ? "maroon" : color;
            this.type = type === undefined ? "simple-marker" : type;
            this.size = size === undefined ? "8px" : size;
            this.style = "circle"
            this.outline = {
                color: "yellow",
                width: "0px"
            }
        }
    }


    let classBreakInfos = [{
        minValue: 0,
        maxValue: 100,
        label: "0-100",
        symbol: new Symbol(`8px`),

    }, {
        minValue: 101,
        maxValue: 500,
        label: "> 100 – 500",
        symbol: new Symbol(`10px`)
    }, {
        minValue: 501,
        maxValue: 1000,
        label: "> 500 – 1,000",
        symbol: new Symbol(`12px`)
    }, {
        minValue: 1001,
        maxValue: 2000,
        label: "> 1,000 – 2,000",
        symbol: new Symbol(`14px`)
    }, {
        minValue: 2001,
        maxValue: 4000,
        label: "> 2,000 – 4,000",
        symbol: new Symbol(`16px`)
    }, {
        minValue: 4001,
        maxValue: 8000,
        label: "> 4,000 – 8,000",
        symbol: new Symbol(`18px`)
    }, {
        minValue: 8001,
        maxValue: 16000,
        label: "> 8,000 – 16,000",
        symbol: new Symbol(`20px`)
    }, {
        minValue: 16001,
        maxValue: 50000,
        label: "> 16,000 – 50,000",
        symbol: new Symbol(`22px`)
    }, {
        minValue: 50001,
        maxValue: 100000,
        label: "> 50,000 – 100,000",
        symbol: new Symbol(`24px`)
    }, {
        minValue: 100001,
        maxValue: 2500000,
        label: "> 100,000 ",
        symbol: new Symbol(`26px`),

    }];
    let classBreakRenderer = {
        type: "class-breaks",
        field: "Confirmed",
        classBreakInfos: classBreakInfos
    }


    require(["esri/Map", "esri/views/MapView", "esri/widgets/Fullscreen", "esri/layers/GeoJSONLayer", "esri/widgets/Legend", "esri/Graphic", "esri/Color"],
        function (Map, MapView, Fullscreen, GeoJSON, Legend, Graphic, Color) {
            coronaLayer = new GeoJSON({
                url: "https://opendata.arcgis.com/datasets/bbb2e4f589ba40d692fab712ae37b9ac_2.geojson",
                popupTemplate: popupTemp,
                renderer: classBreakRenderer
            })

            myMap = new Map({
                basemap: "dark-gray",
                layers: [coronaLayer],

            });
            view = new MapView({
                map: myMap,
                container: "map",
                center: [0, 0],
                zoom: 4
            });
            console.log("first")
            legend = new Legend({
                view: view,
                layerInfos: [{
                    layer: coronaLayer,
                    title: "Cumulative Confirmed Cases"
                }]
            });
            view.ui.add(legend, "bottom-right");
            let fullscreen = new Fullscreen({
                view: view
            });
            view.ui.add(fullscreen, "top-right");
            view.on("click", (event) => {
                console.log(event);
                console.log(event.mapPoint);
                graphic = new Graphic({
                    geometry: event.mapPoint,
                    symbol: {
                        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                        color: "blue",
                        size: 8,
                        outline: { // autocasts as new SimpleLineSymbol()
                            width: 0.5,
                            color: "darkblue"
                        }
                    }
                });
            });
            let updateGraphics = (point, flag) => {
                view.graphics.remove(graphic);
                flag = flag === undefined ? true : flag;
                flag === true && createGraphics(point);

            }
            let createGraphics = (point) => {
                graphic = new Graphic({
                    geometry: point,
                    symbol: {
                        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                        color: new Color({
                            r: 255,
                            g: 0,
                            b: 139,
                            a: 0.5
                        }),
                        size: "50px",
                        outline: { // autocasts as new SimpleLineSymbol()
                            width: 0,
                            color: "darkblue"
                        }
                    }
                });
                view.graphics.add(graphic);
            }
            global.view = view;
            global.updateGraphics = updateGraphics;
        });




}(this));