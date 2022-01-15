$(function () {
    setInterval(function (){
        $.get("/get_ros", function (data, status) {
            const obj = jQuery.parseJSON(data);
            if(obj["position"] === false){
                $(".speed_box").css("background-color", "red");
                $(".current_pose").css("background-color", "red");
            }else{
                $(".speed_box").css("background-color", "cadetblue");
                $(".current_pose").css("background-color", "cadetblue");
                $(".speed_box").text(obj["position"]["data"][2]);
                $(".current_pose").text(obj["position"]["data"][0]+", "+obj["position"]["data"][1]);
            }
        });
    }, 500);

    setInterval(function (){
        $.get("/get_sys", function (data, status) {
            const obj = jQuery.parseJSON(data);
            $(".cpu_box").text(obj["cpu"]+"%");
            $(".ram_box").text(obj["used_mem"]+"/"+obj["total_mem"]);
        });
    }, 3000);

    $(".topic_tag").on("click", function (){
        $(".topic_box").css("opacity", 1);
        $(".terminal_box").css("opacity", 0);
    });

    $(".terminal_tag").on("click", function (){
        $(".terminal_box").css("opacity", 1);
        $(".topic_box").css("opacity", 0);
    });
});

$(window).resize(function() {
    if($(".topic_tag").width()+$(".terminal_tag").width()>$(".topics").width()) {
        $(".topics").css("grid-template-columns", "30vh 30vh auto");
    }
});