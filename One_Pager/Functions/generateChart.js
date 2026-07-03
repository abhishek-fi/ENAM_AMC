const https = require('https');

// ─── HTTPS helpers (no npm needed) ───────────────────────────────────────────

// Uploads a file buffer to a Zoho Creator file/image field via multipart form-data.
// endpoint example:
//   /creator/v2.1/data/{owner}/{app}/{report}/{recordId}/{field}/upload
const httpsUploadPng = (accessToken, recordId, fileBuffer, zohoConfig) => new Promise((resolve, reject) => {

    const boundary = '----ZohoUploadBoundary' + Date.now();

    // Build multipart body
    const partHeader = Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file"; filename="valuation_chart.svg"\r\n` +
        `Content-Type: image/svg+xml\r\n\r\n`
    );
    const partFooter = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([partHeader, fileBuffer, partFooter]);

    const skipWorkflow = encodeURIComponent('["schedules","form_workflow"]');
    const path =
        `/creator/v2.1/data/${zohoConfig.owner}/${zohoConfig.app}` +
        `/report/${zohoConfig.report}/${recordId}/${zohoConfig.field}/upload` +
        `?skip_workflow=${skipWorkflow}`;
    console.info(path);

    const options = {
        hostname: 'www.zohoapis.in',
        path,
        method: 'POST',
        headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': body.length
        }
    };

    const req = https.request(options, (res) => {
        let raw = '';
        res.on('data', c => raw += c);
        res.on('end', () => {
            try { resolve(JSON.parse(raw)); }
            catch (_) { resolve(raw); }
        });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
});

// ─────────────────────────────────────────────────────────────────────────────
module.exports = async (context, basicIO) => {

    try {

        // =====================================
        // 🔹 GET INPUT (Zoho Creator)
        // =====================================
        let input;

        try {
            input = basicIO.getParameter('iMap');
            if (typeof input === "string") {
                input = JSON.parse(input);
                basicIO.write(input);
            }
        } catch (e) {
            input = null;
        }

        // =====================================
        // 🔹 FALLBACK DEMO (for manual run)
        // =====================================
        if (!input || !input.data) {
            input = {
                // data: [
                //     { "Date": "28-Dec-18", "PE": "19.5" },
                //     { "Date": "02-Jan-19", "PE": "19.4" },
                //     { "Date": "07-Jan-19", "PE": "18.7" },
                //     { "Date": "12-Jan-19", "PE": "18.7" },
                //     { "Date": "17-Jan-19", "PE": "18.4" },
                //     { "Date": "22-Jan-19", "PE": "18.1" },
                //     { "Date": "27-Jan-19", "PE": "17.8" },
                //     { "Date": "01-Feb-19", "PE": "17.2" },
                //     { "Date": "06-Feb-19", "PE": "16.4" },
                //     { "Date": "11-Feb-19", "PE": "16.8" }
                // ],
                // plus1: 51.0,
                // minus1: 20.0,
                // mean: 35.5
            };
        }

        const rawData = input.data;

        // =====================================
        // 🔹 CLEAN DATA
        // =====================================
        const data = rawData.map(r => {

            let peVal = (r.PE + "").replace(/,/g, ""); // remove commas

            return {
                date: r.Date,
                pe: parseFloat(peVal)
            };

        }).filter(d => !isNaN(d.pe));

        if (data.length < 2) {
            throw "Not enough valid data";
        }

        const values = data.map(d => d.pe);

        // =====================================
        // 🔹 STD / MEAN FROM INPUT (pre-calculated in sheet)
        // =====================================
        const plus1 = parseFloat((input.plus1 + "").replace(/,/g, ""));
        const minus1 = parseFloat((input.minus1 + "").replace(/,/g, ""));
        const mean = parseFloat((input.mean + "").replace(/,/g, ""));

        if (isNaN(plus1) || isNaN(minus1) || isNaN(mean)) {
            throw "Missing or invalid plus1 / minus1 / mean in input";
        }

        // =====================================
        // 🔹 EXCEL AXIS LOGIC
        // =====================================
        const niceNumber = (range) => {
            const exp = Math.floor(Math.log10(range));
            const frac = range / Math.pow(10, exp);

            let niceFrac;
            if (frac <= 1) niceFrac = 1;
            else if (frac <= 2) niceFrac = 2;
            else if (frac <= 5) niceFrac = 5;
            else niceFrac = 10;

            return niceFrac * Math.pow(10, exp);
        };

        const rawMin = Math.min(...values, minus1);
        const rawMax = Math.max(...values, plus1);

        const range = niceNumber(rawMax - rawMin);
        const step = niceNumber(range / 8); // ÷8 gives finer intervals (e.g. 5 instead of 10)

        const minY = Math.floor(rawMin / step) * step;
        const maxY = Math.ceil(rawMax / step) * step;

        // Add padding (Excel-like)
        const paddingFactor = 0.05;
        const minYFinal = minY - (maxY - minY) * paddingFactor;
        const maxYFinal = maxY + (maxY - minY) * paddingFactor;

        // =====================================
        // 🔹 DIMENSIONS
        // =====================================
        const width = 1100;
        const height = 580;

        const paddingLeft = 70;
        const paddingRight = 40;
        const paddingTop = 40;
        const paddingBottom = 130; // extra room for rotated x-labels + legend

        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        const xStep = chartWidth / (data.length - 1);

        const scaleY = (val) =>
            paddingTop + chartHeight - ((val - minYFinal) / (maxYFinal - minYFinal)) * chartHeight;

        // =====================================
        // 🔹 SMOOTH CURVE (Excel-like)
        // =====================================
        const getPoint = (i) => {
            const x = paddingLeft + i * xStep;
            const y = scaleY(data[i].pe);
            return { x, y };
        };

        let path = "";

        for (let i = 0; i < data.length; i++) {

            const p0 = getPoint(Math.max(i - 1, 0));
            const p1 = getPoint(i);
            const p2 = getPoint(Math.min(i + 1, data.length - 1));
            const p3 = getPoint(Math.min(i + 2, data.length - 1));

            if (i === 0) {
                path += `M ${p1.x} ${p1.y}`;
            }

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;

            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }

        // =====================================
        // 🔹 GRID + LABELS
        // =====================================
        let grid = "";
        let yLabels = "";

        for (let val = minY; val <= maxY; val += step) {
            const y = scaleY(val);

            grid += `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="#ebebeb"/>`;

            yLabels += `<text x="${paddingLeft - 10}" y="${y + 4}" font-size="14" text-anchor="end" fill="#555">${val}</text>`;
        }

        // =====================================
        // 🔹 X LABELS — rotated -45°, ellipsis truncation
        // =====================================
        const MAX_LABEL_CHARS = 10;
        const truncate = (s) => s.length > MAX_LABEL_CHARS
            ? s.slice(0, MAX_LABEL_CHARS - 1) + '…'
            : s;

        // Show up to ~45 labels so they don't crowd each other
        const labelInterval = Math.max(1, Math.ceil(data.length / 45));
        const axisBaseY = height - paddingBottom;

        let xLabels = "";
        data.forEach((d, i) => {
            if (i % labelInterval === 0) {
                const x = paddingLeft + i * xStep;
                xLabels +=
                    `<text transform="translate(${x},${axisBaseY + 4}) rotate(-45)"` +
                    ` text-anchor="end" font-size="14" fill="#555">${truncate(d.date)}</text>`;
            }
        });

        // =====================================
        // 🔹 HORIZONTAL LINES
        // =====================================
        const hLine = (value, color, isDashed = false) => {
            const y = scaleY(value);
            const dashArray = isDashed ? 'stroke-dasharray="4,4"' : '';
            return `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="${color}" stroke-width="1.5" ${dashArray}/>`;
        };

        // =====================================
        // 🔹 LEGEND — centered, dynamic company name
        // =====================================
        const chartTitle = input.title.includes("Fwd P/E") ? input.title : input.title + " Fwd P/E";

        // Colors matching Zoho Sheet / Excel defaults
        const C_LINE = '#4472C4'; // blue  — main series
        const C_PLUS1 = '#ED7D31'; // orange — +1 STD
        const C_MINUS1 = '#A9A9A9'; // gray   — -1 STD
        const C_MEAN = '#FFC000'; // gold   — Mean

        const LEG_LINE_W = 20;  // px width of colour swatch line
        const LEG_LINE_GAP = 6;  // px gap between swatch and text
        const LEG_ITEM_GAP = 28; // px gap between legend items
        const CHAR_W = 9;        // approximate px per character at font-size 14

        const legendItems = [
            { color: C_LINE, label: chartTitle },
            { color: C_PLUS1, label: '+1 STD' },
            { color: C_MINUS1, label: '-1 STD' },
            { color: C_MEAN, label: 'Mean' },
        ];

        const itemWidths = legendItems.map(
            item => LEG_LINE_W + LEG_LINE_GAP + item.label.length * CHAR_W
        );
        const totalLegendW = itemWidths.reduce((a, b) => a + b, 0)
            + LEG_ITEM_GAP * (legendItems.length - 1);
        let lx = (width - totalLegendW) / 2;
        const legendY = height - 22;

        let legendSvg = '<g>';
        legendItems.forEach((item, i) => {
            legendSvg +=
                `\n  <line x1="${lx}" y1="${legendY}" x2="${lx + LEG_LINE_W}" y2="${legendY}"` +
                ` stroke="${item.color}" stroke-width="2"/>` +
                `\n  <text x="${lx + LEG_LINE_W + LEG_LINE_GAP}" y="${legendY + 4}"` +
                ` font-size="18" fill="#333">${item.label}</text>`;
            lx += itemWidths[i] + LEG_ITEM_GAP;
        });
        legendSvg += '\n</g>';

        // =====================================
        // 🔹 FINAL SVG
        // =====================================
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<rect width="100%" height="100%" fill="white"/>

${grid}

<line x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${axisBaseY}" stroke="#bfbfbf"/>
<line x1="${paddingLeft}" y1="${axisBaseY}" x2="${width - paddingRight}" y2="${axisBaseY}" stroke="#bfbfbf"/>

${yLabels}
${xLabels}

<path d="${path}" fill="none" stroke="${C_LINE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

${hLine(plus1, C_PLUS1)}
${hLine(minus1, C_MINUS1)}
${hLine(mean, C_MEAN)}

${legendSvg}

</svg>`;

        // =====================================
        // 🔹 UPLOAD SVG TO ZOHO CREATOR RECORD
        // =====================================
        const accessToken = input.token;   // pass OAuth token via iMap
        const recordId = input.id;       // pass record ID via iMap
        basicIO.write(recordId);
        // recordId = "310788000002220024";

        // Update these four values to match your app
        const zohoConfig = {
            owner: "enamamc",   // ← Zoho account username
            app: "research-application-env",   // ← app link name
            report: "One_Page_Module_Report",// ← report link name
            field: "Valuation_Chart_Image"  // ← file/image field link name
        };

        const svgBuffer = Buffer.from(svg, 'utf8');
        const uploadResp = await httpsUploadPng(accessToken, recordId, svgBuffer, zohoConfig);

        basicIO.write(JSON.stringify(uploadResp));

    } catch (e) {
        basicIO.write("ERROR: " + e.toString());
    }

};
