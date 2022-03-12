let scale = 10, dragging = false, moving = false, cheat = false, move_index, pos = {}, posl = {};
let originX, originY;
const MINIMUM_SCALE = 1.0;

let current_pose;
let bounding_box;
let spline_way;
let record_way;

$(function () {
    const $current_pose = $(".current_pose");
    const $pandar_points = $(".pandar_points");
    const $lidar_output = $(".lidar_output");
    const $command = $(".command");
    const $record_way = $(".record_way");
    // const $record_way = $(".record_way");
    const $topic_box = $(".topic_box");
    const $terminal_box = $(".terminal_box");
    const $canvas = document.getElementById("canvas");
    const $ctx = $canvas.getContext("2d");

    $canvas.width = $canvas.offsetWidth;
    $canvas.height = $canvas.offsetHeight;
    originX = $canvas.width / 2;
    originY = $canvas.height - 50;

    setInterval(function () {
        if (cheat) {
            return;
        }
        $.get("/get_ros", function (data, status) {
            const obj = jQuery.parseJSON(data);
            if (obj["position"] === false) {
                $current_pose.addClass("emergency");
            } else {
                $current_pose.removeClass("emergency");
                $current_pose.find(".data").text(obj["position"]["data"][0] + ", " + obj["position"]["data"][1] + "\n" + obj["position"]["data"][2]);
                current_pose = obj["position"]["data"];
            }
            if (obj["cloud"] === false) {
                $pandar_points.addClass("emergency");
            } else {
                $pandar_points.removeClass("emergency");
                $pandar_points.find(".data").text(obj["cloud"]["data"] + " points");
            }
            if (obj["lidar"] === false) {
                $lidar_output.addClass("emergency");
            } else {
                $lidar_output.removeClass("emergency");
                $lidar_output.find(".data").text(obj["lidar"]["data"]["size"] + " cones");
                bounding_box = obj["lidar"]["data"]["boxes"];
            }
            if (obj["command"] === false) {
                $command.addClass("emergency");
            } else {
                $command.removeClass("emergency");
                $command.find(".data").text(obj["command"]["data"][0] + ", " + obj["command"]["data"][1] + ", " + obj["command"]["data"][2] + "\n" +
                    obj["command"]["data"][3] + ", " + obj["command"]["data"][4] + ", " + obj["command"]["data"][5]);
            }
            if (obj["record_way"] === false) {
                $record_way.addClass("emergency");
            } else {
                $record_way.removeClass("emergency");
                $record_way.find(".data").text(obj["record_way"]["data"].length);
                record_way = obj["record_way"]["data"];
            }
            if (obj["spline_way"] === false) {

            } else {
                spline_way = obj["spline_way"]["data"];
            }
            drawMap();
        });
    }, 100);

    setInterval(function () {
        $.get("/get_sys", function (data, status) {
            const obj = jQuery.parseJSON(data);
            $(".cpu_box .data").text(obj["cpu"]);
            $(".ram_box .data").text(obj["used_mem"] + " / " + obj["total_mem"]);
        });
    }, 3000);

    $(".topic_tag").on("click", function () {
        $topic_box.css("z-index", 10);
        $terminal_box.css("z-index", 1);
        $topic_box.css("opacity", 1);
        $terminal_box.css("opacity", 0);
    });

    $(".terminal_tag").on("click", function () {
        $terminal_box.css("z-index", 10);
        $topic_box.css("z-index", 1);
        $terminal_box.css("opacity", 1);
        $topic_box.css("opacity", 0);
    });

    $(".map_tag").on("click", function () {
        if ($(this).text() === "visualize") {
            $(this).text("cheat");
            cheat = true;
            drawMap();
        } else {
            $(this).text("visualize");
            cheat = false;
        }
    });

    $(".save_tag").on("click", function () {
        $.post("/receive_cheat", {"cheat": JSON.stringify(record_way)}, function (data, status) {
            alert("status: " + status);
        });
    });

    canvasEventsInit();
});

$(window).resize(function () {
    if ($(".topic_tag").width() + $(".terminal_tag").width() > $(".topics").width()) {
        $(".topics").css("grid-template-columns", "30vh 30vh auto");
    }
});

function drawMap(x, y) {
    const $canvas = document.getElementById("canvas");
    const $ctx = $canvas.getContext("2d");
    $ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    $ctx.beginPath();

    $ctx.strokeRect(originX - 5, originY - 5, 10, 10);
    $ctx.moveTo(originX, originY);
    $ctx.lineTo(originX + 75, originY);
    $ctx.moveTo(originX, originY);
    $ctx.lineTo(originX, originY - 75);
    $ctx.stroke();

    $ctx.fillStyle = "#ff0000";
    let box_w = 0.8 * scale;
    let point_w = 0.2 * scale;
    $ctx.fillRect(originX + current_pose[0] * scale - box_w / 2, originY - current_pose[1] * scale - box_w / 2, box_w, box_w);

    $.each(bounding_box, function (index, element) {
        $ctx.fillStyle = "#87ceeb";
        $ctx.fillRect(originX + $(element)[0] * scale - box_w / 2, originY - $(element)[1] * scale - box_w / 2, box_w, box_w);
    });
    $.each(spline_way, function (index, element) {
        $ctx.fillStyle = "#87eb8f";
        $ctx.fillRect(originX + $(element)[0] * scale - point_w / 2, originY - $(element)[1] * scale - point_w / 2, point_w, point_w);
    });

    point_w = 0.4 * scale;
    if (cheat) {
        $.each(record_way, function (index, element) {
            if (arguments.length === 2 && Math.abs($(element)[0] - x) < 0.5 && Math.abs($(element)[1] - y) < 0.2) {
                dragging = false;
                if (!moving) {
                    move_index = index;
                }
                moving = true;
                if (moving && move_index === index) {
                    record_way[index][0] = Number(x);
                    record_way[index][1] = Number(y);
                    $ctx.fillStyle = "#ff4a4a"
                } else {
                    $ctx.fillStyle = "#ffe043";
                }
            } else {
                $ctx.fillStyle = "#ffe043";
            }
            $ctx.fillRect(originX + record_way[index][0] * scale - point_w / 2, originY - record_way[index][1] * scale - point_w / 2, point_w, point_w);
        });
    }
}

function canvasEventsInit() {
    const $canvas = document.getElementById("canvas");

    $canvas.onmousedown = function (event) {
        dragging = true;
        pos = windowToCanvas(event.clientX, event.clientY);
        const m_x = ((posl.x - originX) / scale).toFixed(2);
        const m_y = ((-posl.y + originY) / scale).toFixed(2);
        $("#m_pos").css("left", event.pageX + 20).css("top", event.pageY).text(m_x + ", " + m_y);
        if (cheat) {
            drawMap(m_x, m_y);
        } else {
            drawMap();
        }
    };
    $canvas.onmousemove = function (event) {
        posl = windowToCanvas(event.clientX, event.clientY);
        const m_x = ((posl.x - originX) / scale).toFixed(2);
        const m_y = ((-posl.y + originY) / scale).toFixed(2);
        $("#m_pos").css("left", event.pageX + 20).css("top", event.pageY).text(m_x + ", " + m_y);
        if (dragging) {
            const x = posl.x - pos.x, y = posl.y - pos.y;
            originX += x;
            originY += y;
            pos = JSON.parse(JSON.stringify(posl));
            if (cheat) {
                drawMap(m_x, m_y);
            } else {
                drawMap();
            }
        }
        if (moving) {
            pos = JSON.parse(JSON.stringify(posl));
            drawMap(m_x, m_y);
        }
    };
    $canvas.onmouseup = function () {
        dragging = false;
        moving = false;
    };
    $canvas.onmousewheel = $canvas.onwheel = function (event) {
        pos = windowToCanvas(event.clientX, event.clientY);
        event.wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltaY * (-40));
        posl = {x: ((pos.x - originX) / scale).toFixed(2), y: ((pos.y - originY) / scale).toFixed(2)};
        if (event.wheelDelta > 0) {
            scale += 0.1;
            originX = (1 - scale) * posl.x + (pos.x - posl.x);
            originY = (1 - scale) * posl.y + (pos.y - posl.y);
        } else {
            scale -= 0.1;
            if (scale < MINIMUM_SCALE) {
                scale = MINIMUM_SCALE;
            }
            originX = (1 - scale) * posl.x + (pos.x - posl.x);
            originY = (1 - scale) * posl.y + (pos.y - posl.y);
        }
        drawMap();
    };
}

function windowToCanvas(x, y) {
    const $canvas = document.getElementById("canvas");
    const box = $canvas.getBoundingClientRect();
    return {
        x: x - box.left - (box.width - $canvas.width) / 2,
        y: y - box.top - (box.height - $canvas.height) / 2
    };
}
