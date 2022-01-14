$(function () {
    setInterval(function (){
        $.get("/get", function (data, status) {
            // alert("数据: " + data + "\n状态: " + status);
        });
    }, 1000);

    setInterval(function (){
        $.get("/get_sys", function (data, status) {
            const obj = jQuery.parseJSON(data);
            $(".cpu_box").text(obj["cpu"]+"%");
            $(".ram_box").text(obj["used_mem"]+"/"+obj["total_mem"]);
        });
    }, 3000);

    $(".topic_tag").on("click", function (){
        $(".topic_box").css("display", "block");
        $(".terminal_box").css("display", "none");
    });

    $(".terminal_tag").on("click", function (){
        $(".terminal_box").css("display", "block");
        $(".topic_box").css("display", "none");
    });
});

$(window).resize(function() {
    if($(".topic_tag").width()+$(".terminal_tag").width()>$(".topics").width()) {
        $(".topics").css("grid-template-columns", "30vh 30vh auto");
    }
});

// import * as echarts from 'js/echarts';
// const option = {
//         title: {
//             text: 'Speed'
//         },
//         tooltip: {},
//         legend: {
//             data:['销量']
//         },
//         xAxis: {
//             data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
//         },
//         yAxis: {},
//         series: [{
//             name: '销量',
//             type: 'gauge',
//             data: [5, 20, 36, 10, 10, 20]
//         }]
//     };
// const speed_chart = echarts.init(document.getElementById('speed')).setOption(option);