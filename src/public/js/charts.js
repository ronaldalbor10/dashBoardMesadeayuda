var sess = sessionStorage.getItem('x-access-token');
console.log(sess);
var myHeaders = new Headers();

myHeaders.append('x-access-token', sess);
console.log(myHeaders.get('x-access-token'));

function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }
  
var myLineChart;
var myPieChart;
var objectsCharts = {
    myPieChart: {
        type: 'doughnut',
        data: {
            labels: ["Direct", "Referral", "Social"],
            datasets: [{
                        data: [55, 30, 15],
                        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                      }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
            },
            legend: {
            display: false
            },
            cutoutPercentage: 80,
        },
    },
    myLineChart:{
        type: 'line',
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [{
            label: "Tickets",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
          }],
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 0
            }
          },
          scales: {
            xAxes: [{
              time: {
                unit: 'date'
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                maxTicksLimit: 7
              }
            }],
            yAxes: [{
              ticks: {
                maxTicksLimit: 5,
                padding: 10,
                // Include a dollar sign in the ticks
                callback: function(value, index, values) {
                  return '' + number_format(value);
                }
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2]
              }
            }],
          },
          legend: {
            display: false
          },
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10,
            callbacks: {
              label: function(tooltipItem, chart) {
                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
              }
            }
          }
        }
      },

};

   
function getPieChart(year='Todos'){

  $.ajax({
    url: '/ajax/getPieChart',
    method: 'POST',
    data: {
      year
    },
    success: function(response){

     
      if(response.status=="200"){
        console.log(response);
        $("#subPieChartIndex").html(response.year);
        
        objectsCharts.myPieChart.data.labels = response.labels;
        objectsCharts.myPieChart.data.datasets[0].data = response.data; 
        objectsCharts.myPieChart.data.datasets[0].backgroundColor = response.backgroundColor; 
        objectsCharts.myPieChart.data.datasets[0].hoverBackgroundColor = response.hoverBackgroundColor; 

        let labels ="";
        for (i in response.labels){
            labels = labels + `<span class="mr-2">
                               <i class="fas fa-circle" style="color:${response.backgroundColor[i]}"></i> ${response.labels[i]}
                               </span>`;
        }

        $("#labelsPie").html(labels);
        var ctx = document.getElementById("myPieChart");
        myPieChart = new Chart(ctx, objectsCharts.myPieChart);
      }else{
        //not found data
        $("#subPieChartIndex").html("");
        $("#labelsPie").html("!No se encontro información a graficar¡");
      }
    }
  }).fail(function( jqXHR, textStatus, errorThrown ) {
  console.log( jqXHR, textStatus, errorThrown);
  });
}

function getLineChart(){

  $.getJSON("/js/jsonDataAreaIndex.json", function(json) {
    console.log(json);
    objectsCharts.myLineChart.data.datasets[0].data = json.data;

        // Area Chart Example
    var ctx = document.getElementById("myLineChart");
    myLineChart = new Chart(ctx, objectsCharts.myLineChart);

    $("#subLineChartIndex").html(json.year);

  });
}

function getCounterTickets(){
  $.ajax({
    url: '/ajax/getCounterTickets',
    method: 'POST',
    data: {
        year:2022
    },
    success: function(response){
      if(response.status=="200"){
          console.log(response.data);
          $(".ticketsOpen").html(response.data[0].open[0].TotalStatusTicket);
          $(".ticketsOverdue").html(response.data[0].overdue[0].TotalStatusTicket);
          $(".ticketsResolved").html(response.data[0].resolved[0].TotalStatusTicket);
          $(".ticketsClosed").html(response.data[0].closed[0].TotalStatusTicket);

      }
    }
}).fail(function( jqXHR, textStatus, errorThrown ) {
console.log( jqXHR, textStatus, errorThrown);
});
}

function fiterYearLineChart(year=''){
  myLineChart.destroy();
  if(year==''){
    year = $("#subLineChartIndex").html();
  }else{
    $("#subLineChartIndex").html(year);
  }

  $.ajax({
        url: '/ajax/filterYearLineChartIndex',
        method: 'POST',
        data: {
            year 
        },
        success: function(response){
          if(response.status=="200"){

            getLineChart();

          }
        }
  }).fail(function( jqXHR, textStatus, errorThrown ) {
    console.log( jqXHR, textStatus, errorThrown);
  });
  
}

function fiterYearPieChart(year=''){

  myPieChart.destroy();
  
  if(year==''){
    year = $("#subPieChartIndex").html();
  }else{
    $("#subPieChartIndex").html(year);
  }
  getPieChart(year);
  /*$.ajax({
    
    url: '/ajax/getPieChart',
    method: 'POST',
    data: {
        year
    },
    success: function(response){
      if(response.status=="200"){
        console.log(response);
        $("#subPieChartIndex").html(response.year);
        
        objectsCharts.myPieChart.data.labels = response.labels;
        objectsCharts.myPieChart.data.datasets[0].data = response.data; 
        objectsCharts.myPieChart.data.datasets[0].backgroundColor = response.backgroundColor; 
        objectsCharts.myPieChart.data.datasets[0].hoverBackgroundColor = response.hoverBackgroundColor; 

        let labels ="";
        for (i in response.labels){
            labels = labels + `<span class="mr-2">
                               <i class="fas fa-circle" style="color:${response.backgroundColor[i]}"></i> ${response.labels[i]}
                               </span>`;
        }

        $("#labelsPie").html(labels);
        var ctx = document.getElementById("myPieChart");
        myPieChart = new Chart(ctx, objectsCharts.myPieChart);
      }else{
        
        $("#subPieChartIndex").html("");
        $("#labelsPie").html("!No se encontro información a graficar¡");
      }
    }
}).fail(function( jqXHR, textStatus, errorThrown ) {
console.log( jqXHR, textStatus, errorThrown);
});*/

  
}




// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
    