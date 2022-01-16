$(function () {
    const $speed_box = $(".speed_box");
    const $current_pose = $(".current_pose");
    const $pandar_points = $(".pandar_points");
    const $lidar_output = $(".lidar_output");
    const $command = $(".command");
    setInterval(function () {
        $.get("/get_ros", function (data, status) {
            const obj = jQuery.parseJSON(data);
            if (obj["position"] === false) {
                $speed_box.addClass("emergency");
                $current_pose.addClass("emergency");
            } else {
                $speed_box.removeClass("emergency");
                $current_pose.removeClass("emergency");
                $speed_box.children("div").text(obj["position"]["data"][2]);
                $current_pose.children("div").text(obj["position"]["data"][0] + ", " + obj["position"]["data"][1]);
            }
            if (obj["cloud"] === false) {
                $pandar_points.addClass("emergency");
            } else {
                $pandar_points.removeClass("emergency");
                $pandar_points.children("div").text(obj["cloud"]["data"]);
            }
            if (obj["lidar"] === false) {
                $lidar_output.addClass("emergency");
            } else {
                $lidar_output.removeClass("emergency");
                $lidar_output.children("div").text(obj["lidar"]["data"]);
            }
            if (obj["command"] === false) {
                $command.addClass("emergency");
            } else {
                $command.removeClass("emergency");
                // $command.children("li").html(obj["command"]["data"]);
                $command.children("ul").children("li").each(function() {
                    $(this).text(obj["command"]["data"][$(this).index()].toFixed(2))
                });
            }
        });
    }, 500);

    setInterval(function () {
        $.get("/get_sys", function (data, status) {
            const obj = jQuery.parseJSON(data);
            $(".cpu_box div").text(obj["cpu"] + "%");
            $(".ram_box div").html(obj["used_mem"] + "<br />/" + obj["total_mem"]);
        });
    }, 3000);

    $(".topic_tag").on("click", function () {
        $(".topic_box").css("opacity", 1);
        $(".terminal_box").css("opacity", 0);
    });

    $(".terminal_tag").on("click", function () {
        $(".terminal_box").css("opacity", 1);
        $(".topic_box").css("opacity", 0);
    });
});

$(window).resize(function () {
    if ($(".topic_tag").width() + $(".terminal_tag").width() > $(".topics").width()) {
        $(".topics").css("grid-template-columns", "30vh 30vh auto");
    }
});