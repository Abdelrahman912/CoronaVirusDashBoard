(function (global) {
    let reqUrl = "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/2/query";
    let reqOptions = {
        reposneType: "json",
        query: {
            where: "1=1",
            outFields: ["Country_Region,Confirmed,Deaths,Recovered,Long_,Lat"],
            f: "json"
        }
    }
    let corona = {
        features: [],
        totalConfirmed: 0,
        totalDeaths: 0,
        totalRecovered: 0
    }

    let getTotals = () => {
        let sumConfirmed = 0;
        let sumDeaths = 0;
        let sumRecovered = 0;
        for (const feature of corona.features) {
            sumConfirmed += feature.attributes.Confirmed;
            sumDeaths += feature.attributes.Deaths;
            sumRecovered += feature.attributes.Recovered;
        }
        corona.totalConfirmed = sumConfirmed;
        corona.totalDeaths = sumDeaths;
        corona.totalRecovered = sumRecovered;
    }

    let fillDropDown = (ddl, arr) => {
        for (const item of arr) {
            let opt = document.createElement("option");
            opt.value = item.attributes.Country_Region;
            opt.textContent = item.attributes.Country_Region;
            ddl.appendChild(opt);
        }

    }

    require(["esri/request"], (esriRequest) => {

        let queryLayer = async (reqUrl, reqOptions) => {
            console.log("update");
            let response = await esriRequest(reqUrl, reqOptions);
            let data = response.data;
            corona.features = data.features;
            getTotals();
        }



        global.queryLayer = queryLayer;

    });
    global.fillDropDown = fillDropDown;
    global.reqUrl = reqUrl;
    global.reqOptions = reqOptions;
    global.corona = corona;
}(this));