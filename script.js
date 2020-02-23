function show_arrangements() {
    let registration_no = parseInt(document.getElementById("reg_no").value);
    let arrangements = requested_arrangements(registration_no);

    if( arrangements.length === 0 ) {
        document.getElementById("nothing_found").style.display = "block";
        document.getElementById("display_area").style.display = "none";
    } else {
        let canvas = document.getElementById("arrangements_display");

        canvas.width  = window.innerWidth - 50;
        canvas.height = canvas.width * 16/9;

        draw_on_canvas( remove_unneeded_columns(arrangements) );

        document.getElementById("download_button").href = canvas.toDataURL("image/jpg");

        document.getElementById("display_area").style.display = "block";
        document.getElementById("nothing_found").style.display = "none";
    }
}

function draw_on_canvas( arrangements ) {
    let num_sections = 5;

    draw_frame(num_sections);
    draw_arrangements_text(num_sections, arrangements );
}

function draw_frame( num_sections ) {
    let canvas = document.getElementById("arrangements_display");
    let context = canvas.getContext("2d");

    context.strokeStyle = "red";
    context.lineWidth = "1px";

    context.strokeRect(0,0, canvas.width,canvas.height);

    for(let i = 1; i < num_sections; ++i ) {
        let section_height = canvas.height / num_sections;

        context.beginPath();
        context.moveTo(0,            i*section_height);
        context.lineTo(canvas.width, i*section_height);
        context.stroke();
    }
}
function draw_arrangements_text(num_sections, arrangements ) {
    let canvas = document.getElementById("arrangements_display");
    let context = canvas.getContext("2d");

    for(let i = 0; i < num_sections; ++i ) {
        let row_for_this_section = arrangements[i];

        let this_section_width  = canvas.width;
        let this_section_height = canvas.height / num_sections;
        let this_section_x      = 0;
        let this_section_y      = i * this_section_height;

        // there will be 3 lines of text per section:
        let text_line_height    = this_section_height / 3;

        let text_line_1_y       = this_section_y + 1 * text_line_height/2;
        let text_line_2_y       = this_section_y + 3 * text_line_height/2;
        let text_line_3_y       = this_section_y + 5 * text_line_height/2;

        let text_line_1 = row_for_this_section[0];
        let text_line_2 = row_for_this_section[1] + " at " + row_for_this_section[2];
        let text_line_3 = row_for_this_section[3];

        context.font = "20px PT Mono";
        context.textBaseline = "middle";
        context.fillText(text_line_1, this_section_x, text_line_1_y, canvas.width);
        context.fillText(text_line_2, this_section_x, text_line_2_y, canvas.width);
        context.fillText(text_line_3, this_section_x, text_line_3_y, canvas.width);
    }
}

// function pretty_string( registration_no ) {
//     arrangements = remove_unneeded_columns( requested_arrangements(registration_no) );
//
//     let pretty_rows = "";
//     for(let i = 0; i < arrangements.length; i++) {
//         pretty_rows += arrangements[i].join(", ") + "<br>\n";
//     }
//
//     return pretty_rows;
// }

function remove_unneeded_columns( arrangements ) {
    for (let i = 0; i < arrangements.length; i++) {
        arrangements[i].splice(4, 1);
        arrangements[i].splice(3, 1);
        arrangements[i].splice(1, 1);
        arrangements[i].splice(0, 1);
    }

    return arrangements;
}

function arrangements_csv_as_string() {
    let arrangements_csv_file_path = "arrangements.csv";

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", arrangements_csv_file_path, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

// Returns an array of rows, a row is an array of cell values
function parsed_arrangements_csv() {
    let parsed_csv = Papa.parse(arrangements_csv_as_string(), {header: false});
    return parsed_csv.data;
}

// Returns an array of rows, this array contains those rows
// which have the passed "registration_no" in the first cell.
// If no matching rows are found, an empty array is returned.
function requested_arrangements( registration_no ) {
    let result = [];
    let parsed_csv = parsed_arrangements_csv();

    for( let i = 0; i < parsed_csv.length; i++ ) {
        let row = parsed_csv[i];

        if( parseInt(row[0]) === registration_no ) {
            result.push(row);
        }
    }

    return result;
}



















































