let specialElementHandlers = {
    '#editor': function (element, renderer) {
        return true;
    }
};

function cmdOnClick() {
    let doc = new jsPDF();
    // doc.fromHTML($('#content').html(), 15, 15, {'width': 170, 'elementHandlers': specialElementHandlers});

    doc.save('sample-file.pdf');
}