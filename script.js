function show_arrangements() {
    let registration_no = parseInt(document.getElementById("reg_no").value);
    let arrangements = requested_arrangements(registration_no);

    if( arrangements.length === 0 ) {
        document.getElementById("nothing_found").style.display = "block";
        document.getElementById("display_area").style.display = "none";
    } else {
        let canvas = document.getElementById("arrangements_display");

        draw_on_canvas(canvas);

        document.getElementById("download_button").href = canvas.toDataURL("image/jpg");

        document.getElementById("display_area").style.display = "block";
        document.getElementById("nothing_found").style.display = "none";
    }
}

function draw_on_canvas( canvas ) {
    canvas.width  = window.innerWidth - 20;
    canvas.height = canvas.width * 16 / 9;

    let context = canvas.getContext("2d");
    context.fillStyle = "green";
    context.fillRect(0,0, canvas.width,canvas.height);
}

function pretty_string( registration_no ) {
    arrangements = remove_unneeded_columns( requested_arrangements(registration_no) );

    let pretty_rows = "";
    for(let i = 0; i < arrangements.length; i++) {
        pretty_rows += arrangements[i].join(", ") + "<br>\n";
    }

    return pretty_rows;
}

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




















































