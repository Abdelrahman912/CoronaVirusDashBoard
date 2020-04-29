(function (global) {
    let data = [0, 0, 0];
    let selectedPoint = {
        type: "point",
        longitude: 0,
        latitude: 0
    }
    let chartLabel = `COVID-19 Statistics For All Countries`
    let countriesDDl = document.getElementById("countriesddl");
    let initData = async () => {
        await queryLayer(reqUrl, reqOptions);
        fillDropDown(countriesDDl, corona.features);
        showWorld();
    }
    initData();
    setInterval(queryLayer, 3.6e+6, reqUrl, reqOptions);
    const barChartDOM = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barChartDOM, {
        type: 'bar',
        data: {
            labels: ['Confirmed', 'Deaths', 'Recovered'],
            datasets: [{
                label: chartLabel,
                data: data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(75, 192, 192, 0.2)',

                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',

                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    const pieChartDOM = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieChartDOM, {
        type: "pie",
        data: {
            labels: ['Confirmed', 'Deaths', 'Recovered'],
            datasets: [{
                label: chartLabel,
                data: data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(75, 192, 192, 0.2)',

                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',

                ],
                borderWidth: 1
            }]
        },
    });
    countriesDDl.addEventListener("change", () => {
        let country = countriesDDl.value;
        console.log(country === "0");
        country === "0" ? showWorld() : showCountry(country);

    });
    let showWorld = () => {
        updateData([corona.totalConfirmed, corona.totalDeaths, corona.totalRecovered], "All Countries");
        updateChart(barChart);
        updateChart(pieChart);
        updateExtent(0, 0, false);
    }
    let showCountry = (country) => {
        let feature = corona.features.find(f => f.attributes.Country_Region == country);
        updateData([feature.attributes.Confirmed, feature.attributes.Deaths, feature.attributes.Recovered], country);
        updateChart(barChart);
        updateChart(pieChart);
        updateExtent(feature.attributes.Long_, feature.attributes.Lat);
        console.log(view)
    }
    let updateExtent = (long, lat, flag) => {
        selectedPoint.longitude = long;
        selectedPoint.latitude = lat;
        view.goTo({
                center: [long, lat]
            }, {
                animate: true,
                duration: 3000
            })
            .then(() => updateGraphics(selectedPoint, flag));
    }
    let updateData = (arr, label) => {
        data[0] = arr[0];
        data[1] = arr[1];
        data[2] = arr[2];
        chartLabel = `COVID-19 Statistics For ${label}`
    }
    let updateChart = (chart) => {
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].label = chartLabel;
        chart.update();
    }





}(this))