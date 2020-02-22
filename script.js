function show_arrangements() {
    let display_area = document.getElementById("arrangements");

    let registration_no = document.getElementById("reg_no").value;

    display_area.innerHTML = pretty_string(parseInt(registration_no));

    display_area.style.display = "block";
}

function remove_unneeded_columns() {
    
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
































