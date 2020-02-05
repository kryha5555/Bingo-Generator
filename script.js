let init = () => {

    // --- CONFIGURATION ---

    const COLUMNS_PER_PAGE = 2;
    const ROWS_PER_PAGE = 3;

    // --- FORMAT A4, PORTRET ---
    const PAGE_WIDTH_MILLIMETERS = 210;
    const PAGE_HEIGHT_MILLIMETERS = 297;

    // --- END CONFIGURATION ---

    const PRINT_ROOT = document.getElementById("print");
    const PREVIEW_ROOT = document.getElementById("preview");
    const UPLOAD_FIELD = document.getElementById("file-field");
    const PAGES_FIELD = document.getElementById("pages");
    const DROP_AREA = document.getElementById("drop-area");
    const URL_FIELD = document.getElementById("url-field");
    const URL_FORM = document.getElementById("url-form");

    // margins
    const PAGE_MARGIN_MILLIMETERS = 7;
    const CELL_SPACING_MILLIMETERS = 2;

    // constants calculation
    const WIDTH_MILLIMETERS = PAGE_WIDTH_MILLIMETERS - 2 * PAGE_MARGIN_MILLIMETERS;
    const HEIGHT_MILLIMETERS = PAGE_HEIGHT_MILLIMETERS - 2 * PAGE_MARGIN_MILLIMETERS;
    const BOARDS_PER_PAGE = COLUMNS_PER_PAGE * ROWS_PER_PAGE;
    const FIELD_SIZE_MILLIMETERS = Math.min(HEIGHT_MILLIMETERS / ROWS_PER_PAGE, WIDTH_MILLIMETERS / COLUMNS_PER_PAGE) - 2 * CELL_SPACING_MILLIMETERS;

    let labels;
    let centerLabel;
    let pageCount = PAGES_FIELD.value;

    let parseText = text => {
        let lines = text.split(/\r?\n/g).filter(l => l.length > 0); // split text by newlines, remove any empty strings
        if (lines.length < 25)
            throw new Error("File too short!");

        [centerLabel, ...labels] = lines; // save first line to centerLabel, rest of lines to labels
        generateSample();
    };

    let generateSample = () => {
        if (!labels) return;

        while (PREVIEW_ROOT.hasChildNodes())
            PREVIEW_ROOT.removeChild(PREVIEW_ROOT.firstChild); // remove any child nodes

        PREVIEW_ROOT.appendChild(randomGrid()); // append random grid to preview root
    };

    let randomGrid = () => {
        let labelsCopy = labels.slice(); // copy labels array

        for (let i = 0; i < 25; i++) { // for each label
            const j = i + Math.floor(Math.random() * (labelsCopy.length - i)); // get a random integer such that 0 ≤ j ≤ i
            [labelsCopy[i], labelsCopy[j]] = [labelsCopy[j], labelsCopy[i]]; // swap two elements
        }

        const entries = [...labelsCopy.slice(0, 12), centerLabel, ...labelsCopy.slice(12, 24)]; // insert centerLabel into middle

        return makeGrid(entries);
    };

    let makeGrid = entries => {
        let grid = document.createElement("div"); // create new grid
        grid.className = "board";

        for (let r = 0; r < 5; r++) { // for each row in grid
            const row = document.createElement("div"); // create new row
            row.className = "row";
            
            for (let i = 0; i < 5; i++) { // for each cell in row
                const cell = document.createElement("div"); // create new cell
                cell.className = "cell";
                cell.innerText = entries[5 * r + i]; // assign text to cell
                row.appendChild(cell); // append cell to row
            }
            grid.appendChild(row); // append row to grid
        }

        return grid;
    };

    parseText("1\n2\n3\n4\n5\n6\n7\n\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25"); // sample input
};

addEventListener('load', init);