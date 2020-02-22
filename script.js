function show_arrangements() {
    let x = document.getElementById("arrangements");

    x.innerHTML = "hahah";

    x.style.display = "block";

    console.log(pretty_string(108480));
}

function pretty_string( registration_no ) {
    arrangements = requested_arrangements(registration_no);

    let pretty_rows = "";
    for(let i = 0; i < arrangements.length; i++) {
        pretty_rows += arrangements[i].join(", ") + "\n";
    }

    return pretty_rows;
}

function arrangements_csv_as_string() {
    var arrangements_csv_file_path = "arrangements.csv";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", arrangements_csv_file_path, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

// Returns an array of rows, a row is an array of cell values
function parsed_arrangements_csv() {
    var parsed_csv = Papa.parse(arrangements_csv_as_string(), {header: false});
    return parsed_csv.data;
}

// Returns an array of rows, this array contains those rows which have the passed "registration_no" in the first cell
function requested_arrangements( registration_no ) {
    var result = [];
    parsed_csv = parsed_arrangements_csv();

    for( var i = 0; i < parsed_csv.length; i++ ) {
        var row = parsed_csv[i];

        if( row[0] == registration_no ) {
            result.push(row);
        }
    }

    return result;
}
































