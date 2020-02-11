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
    const TITLE = document.getElementById("title");

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

    const FILE_URL_PARAM_NAME = "url";
    const searchParams = new URLSearchParams(new URL(window.location).search);
    const hash = location.hash.substr(1);

    let parseText = text => {
        let lines = text.split(/\r?\n/g).filter(l => l.length > 0); // split text by newlines, remove any empty strings
        if (lines.length < 25)
            throw new Error("File too short!");

        [centerLabel, ...labels] = lines; // save first line to centerLabel, rest of lines to labels
        generateSample();
        generatePages();
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

    let generatePages = () => {
        if (!labels) return;

        while (PRINT_ROOT.hasChildNodes())
            PRINT_ROOT.removeChild(PRINT_ROOT.firstChild);

        for (let p = 0; p < pageCount; p++) {

            const page = document.createElement("div");
            page.className = COLUMNS_PER_PAGE > 1 ? "page narrow" : "page";
            page.style.gridTemplateColumns = "auto ".repeat(COLUMNS_PER_PAGE);

            for (let g = 0; g < BOARDS_PER_PAGE; g++) {
                const entry = document.createElement("div");
                entry.className = "entry";
                entry.style.width = FIELD_SIZE_MILLIMETERS + "mm";
                entry.style.height = FIELD_SIZE_MILLIMETERS + "mm";

                entry.appendChild(randomGrid());
                page.appendChild(entry);
            }

            PRINT_ROOT.appendChild(page);
        }
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

    let loadFromURL = url => {
        fetch(url).then(response => {
            if (!response.ok)
                throw Error(response.statusText);
            return response.text();
        }).then(parseText).catch(_ => { throw new Error("Could not read file."); });
    };

    let loadFromFile = file => {
        let reader = new FileReader();
        reader.onload = ev => parseText(ev.target.result);
        reader.readAsText(file);
    }

    const url = searchParams.get(FILE_URL_PARAM_NAME) || hash;
    if (url) loadFromURL(url);

    ['dragenter', 'dragover'].forEach(name => DROP_AREA.addEventListener(name, _ => DROP_AREA.classList.add('highlight'), false));
    ['dragleave', 'drop'].forEach(name => DROP_AREA.addEventListener(name, _ => DROP_AREA.classList.remove('highlight'), false));
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(
        name => DROP_AREA.addEventListener(name, ev => { ev.preventDefault(); ev.stopPropagation(); }, false));

    DROP_AREA.addEventListener('drop', ev => {
        let files = ev.dataTransfer.files;
        if (files.length > 0) {
            loadFromFile(files[0]);
        } else if (ev.dataTransfer.items.length > 0 && ev.dataTransfer.items[0].kind === 'string') {
            ev.dataTransfer.items[0].getAsString(parseText);
        }
    });

    DROP_AREA.addEventListener('change', _ => {
        if (UPLOAD_FIELD.files.length > 0)
            loadFromFile(UPLOAD_FIELD.files[0]);
    });

    PAGES_FIELD.addEventListener('change', _ => {
        pageCount = PAGES_FIELD.value;
        generatePages();
    });

    URL_FORM.addEventListener('submit', ev => {
        ev.stopPropagation();
        ev.preventDefault();

        const url = URL_FIELD.value;
        if (url.length === 0) return;

        searchParams.set(FILE_URL_PARAM_NAME, url);
        history.replaceState({}, '', `${location.pathname}?${searchParams}`);
        loadFromURL(url);
    });

    TITLE.addEventListener('click', _ => {
        window.location = "index.html";
    })

    parseText("FREE SPACE\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n29\n30\n31\n32\n33\n34\n35\n36\n37\n38\n39\n40\n41\n42\n43\n44\n45\n46\n47\n48\n49\n50\n51\n52\n53\n54\n55\n56\n57\n58\n59\n60\n61\n62\n63\n64\n65\n66\n67\n68\n69\n70\n71\n72\n73\n74\n75"); // sample input
};

addEventListener('load', init);