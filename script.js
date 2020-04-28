let parsed_csv;

window.addEventListener('load', function () {
    parsed_csv = get_parsed_arrangements_csv();
    document.querySelector("#search_bar").addEventListener("keyup", event => {
        if(event.key !== "Enter") return; // Use `.key` instead.
        document.querySelector("#search_button").click(); // Things you want to do.
        event.preventDefault(); // No need to `return false;`.
    });
});

function arrangements_csv_as_string() {
    let arrangements_csv_file_path = "arrangements.csv";

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", arrangements_csv_file_path, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

function show_arrangements() {
    let registration_no = parseInt(document.getElementById("search_bar").value);
    let requested_arrangements = get_requested_arrangements(registration_no);
    let arrangements_processed =
        sort_arrangements_by_date(
            sort_arrangements_by_time(
                trim_arrangements_text(
                    remove_unneeded_columns(
                        requested_arrangements
                    )
                )
            )
        );

    if( arrangements_processed.length === 0 ) {
        document.getElementById("nothing_found").style.display = "block";

        document.getElementById("name_bar_div").style.display = "none";
        document.getElementById("display_area").style.display = "none";
        document.getElementById("download_button_div").style.display = "none";

        alert("No Results :(");
    } else {
        draw_on_canvas( arrangements_processed );

        document.getElementById("name_bar").value = requested_arrangements[0][1];

        document.getElementById("name_bar_div").style.display = "block";
        document.getElementById("display_area").style.display = "block";
        document.getElementById("download_button_div").style.display = "block";

        document.getElementById("nothing_found").style.display = "none";

        window.scrollTo(0, 6100);
    }
}

function draw_on_canvas( arrangements ) {
    let num_sections = arrangements.length;
    num_sections = num_sections < 4 ? 4 : num_sections;

    let canvas = document.getElementById("arrangements_display");

    canvas.width  = 1440;
    canvas.height = canvas.width * 16/9;

    // draw_frame(num_sections);
    draw_arrangements_text(num_sections, arrangements );

    let drawn_image = canvas.toDataURL("image/jpg");
    document.getElementById("download_anchor").href = canvas.toDataURL("image/jpg");

    let image_frame = document.getElementById("image_frame");
    image_frame.height = document.getElementById("search_bar").clientWidth * 16/9;
    image_frame.src = drawn_image;
}

// to be called after calling remove_unneeded_columns() and trim_arrangements_text() on the data
// sorts the arrangements by time (but not by day)
function sort_arrangements_by_time( arrangements ) {
    let result = arrangements;

    let sort_key_for_row = function(row) {
        let x = parseInt(row[2].split("-")[0].split(":")[0]);
        x = x > 9 ? x : x + 12;

        return x;
    };

    result.sort(
        function (rowA, rowB) {
            return sort_key_for_row(rowA) - sort_key_for_row(rowB);
        }
    );

    return result;
}

// to be called after calling remove_unneeded_columns() on the data
// sorts the arrangements by time
function sort_arrangements_by_date( arrangements ) {
    let result = arrangements;

    let sort_key_for_row = function(row) {
        let date = row[1].substr(row[1].length - 10, row[1].length);

        let date_split = date.split("-");

        let day   = parseInt(date_split[0]);
        let month = parseInt(date_split[1]);
        let year  = parseInt(date_split[2]);

        return 1000000*year + 10000*month + day;
    };

    result.sort(
        function (rowA, rowB) {
            return sort_key_for_row(rowA) - sort_key_for_row(rowB);
        }
    );

    return result;
}

// to be called after remove_unneeded_columns()
function trim_arrangements_text( arrangements ) {
    for(let i = 0; i < arrangements.length; ++i ) {
        let row_for_this_section = arrangements[i];

        row_for_this_section[0] = row_for_this_section[0].length > 35 ? row_for_this_section[0].substr(0, 35) + "..." : row_for_this_section[0];
        row_for_this_section[1] = row_for_this_section[1].replace(",", ", ");
        row_for_this_section[2] = row_for_this_section[2].replace(":00.0", "").replace(":00.0", "");
        row_for_this_section[3] = row_for_this_section[3].replace("1_SEECS-", "").replace("2_SEECS ", "").replace("Labs-", "");
    }

    return arrangements;
}

function draw_frame( num_sections ) {
    let canvas = document.getElementById("arrangements_display");
    let context = canvas.getContext("2d");

    // context.strokeStyle = "black";
    // context.strokeRect(1,1, canvas.width-1,canvas.height-1);

    context.lineWidth = "1px";
    for(let i = 1; i < num_sections; ++i ) {
        let space = 0;

        let section_height = canvas.height / num_sections;

        context.beginPath();
        context.moveTo(space, i*section_height);
        context.lineTo(canvas.width - space, i*section_height);
        context.stroke();
    }
}
function draw_arrangements_text(num_sections, arrangements) {
    let padding = 30;

    let canvas = document.getElementById("arrangements_display");
    let context = canvas.getContext("2d");

    let saved_fill_style = context.fillStyle;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = saved_fill_style;

    for(let i = 0; i < arrangements.length; ++i ) {
        let this_section_width  = canvas.width;

        let this_section_height = canvas.height / num_sections;
        let this_section_x      = 0;
        let this_section_y      = i*this_section_height + 35;

        // there will be 3 lines of text per section:
        let text_line_height    = this_section_height / 3;
        let text_line_1_y       = this_section_y + 1 * text_line_height/2;
        let text_line_2_y       = this_section_y + 3 * text_line_height/2;
        let text_line_3_y       = this_section_y + 5 * text_line_height/2;

        let row_for_this_section = arrangements[i];
        context.textBaseline = "middle";

        context.font = "Bold " + (this_section_width/12).toString() + "px Lucida Console";
        context.fillText(
            row_for_this_section[0],
            this_section_x + padding,
            text_line_1_y + 6,
            canvas.width - 2*padding
        );

        context.font = (this_section_width/14).toString() + "px Arial";
        context.fillText(
            row_for_this_section[1] + ", " + row_for_this_section[2],
            this_section_x + padding,
            text_line_2_y - 25,
            canvas.width - 2*padding
        );

        context.font = (this_section_width/15).toString() + "px Arial";
        context.fillText(row_for_this_section[3],
            this_section_x + padding,
            text_line_3_y - 70,
            canvas.width - 2*padding
        );
    }
}

function remove_unneeded_columns( requested_arrangements ) {
    // making a deep copy because we will modify "parsed_csv" indirectly otherwise
    let result = JSON.parse(JSON.stringify(requested_arrangements));

    for (let i = 0; i < requested_arrangements.length; i++) {
        result[i].splice(4, 1);
        result[i].splice(3, 1);
        result[i].splice(1, 1);
        result[i].splice(0, 1);
    }

    return result;
}

// Returns an array of rows, a row is an array of cell values
function get_parsed_arrangements_csv() {
    let parsed_csv = Papa.parse(arrangements_csv_as_string(), {header: false});
    return parsed_csv.data;
}

// Returns an array of rows, this array contains those rows
// which have the passed "registration_no" in the first cell.
// If no matching rows are found, an empty array is returned.
function get_requested_arrangements( registration_no ) {
    let result = [];

    for( let i = 1; i < parsed_csv.length; i++ ) {
        let row = parsed_csv[i];

        if( parseInt(row[0]) === registration_no ) {
            result.push(row);
        }
    }

    return result;
}

function click_download_anchor() {
    document.getElementById("download_anchor").click();
}





















