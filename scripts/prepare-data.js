import fs from 'fs';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import ExcelJS from 'exceljs';

const generalIndex = {};
const generalData = [];

const consumePagingApi = async (fetcher, exitPredicate) => {
    const collectedData = [];
    let page = 0;
    while (true) {
        const response = await fetcher(page);
        if (!response.ok) {
            console.log('consumePagingApi exit due to not ok response');
            break;
        }
        const respData = await response.json();
        collectedData.push(respData);
        if (exitPredicate(respData))
            break;
        page++;
    }
    return collectedData;
};

const dropColumns = (obj, cols) => Object.fromEntries(Object.entries(obj).filter(([key]) => !cols.includes(key)));
const onlyColumns = (obj, cols) => Object.fromEntries(Object.entries(obj).filter(([key]) => cols.includes(key)));

const addElement = (propertyName, key, value) => {
    if (!(key in generalIndex))
        return;
    const dataObject = generalData[generalIndex[key]];
    if (!(propertyName in dataObject))
        dataObject[propertyName] = [];
    dataObject[propertyName].push(value);
};

const addElementOn = (propertyName, index, value) => {
    if (index < 0 || index >= generalData.length)
        return;
    const dataObject = generalData[index];
    if (!(propertyName in dataObject))
        dataObject[propertyName] = [];
    dataObject[propertyName].push(value);
};

const saveStocks = async () => {
    const baseUrl = 'https://api.tase.co.il/api/security/securitiesinfo'; // base url to fetch from (the tase api for they're frontend)
    // all the headers are required to make a successful request
    const headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Referer': 'https://www.tase.co.il/',
        "accept-language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
    };

    const postData = {
        dType: 1,
        TotalRec: 1,
        cl1: 1,
        cl2: 0,
        lang: 0
    };

    const collectedData = await consumePagingApi(
        page => fetch(baseUrl, { method: 'POST', headers, body: JSON.stringify({ ...postData, pageNum: page + 1 }) }),
        data => data.Items.length === 0);

    for (const chunk of collectedData) {
        for (const stock of chunk.Items) {
            generalIndex[stock['CorporateNo']] = generalData.length;
            const relevantKeys = [
                'NameHeb',
                'NameEng',
                'SymbolHeb',
                'SymbolEng',
                'CompanyNameHeb',
                'CompanyNameEng',
                'SectorHeb',
                'CorporateNo',
                'SuperSectorHeb',
                'SectorHeb',
                'SubSectorHeb',
                // 'IndicesListHeb',
                'IssueNo',
            ];
            // const engineeredStock = Object.fromEntries(Object.entries(stock).filter(([key]) => relevantKeys.includes(key)));
            // generalData.push({ stock: engineeredStock });
            generalData.push({ stock: onlyColumns(stock, relevantKeys) });
        }
    }
};

const savePermits = async () => {
    // base url to fetch from (the gov api for they're frontend)
    const baseUrl = 'https://apps.moital.gov.il/WeekendPermits/api/Permission/GetPermitListHokav';
    // all the headers are required to make a successful request
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': 'https://apps.moital.gov.il/WeekendPermits/',
    };

    const pageSize = 100;
    const collectedData = await consumePagingApi(
        page => fetch(baseUrl, { method: 'POST', headers, body: `NUM_FROM_RECORD=${page * pageSize}&NUM_RECORD=${(page + 1) * pageSize}` }),
        data => data.length < pageSize);

    const propertyName = 'permits';
    for (const chunk of collectedData) {
        for (const item of chunk) {
            const key = item['C_REG'];
            if (!(key in generalIndex))
                continue;
            const engineeredItem = {
                startDate: item['D_HETER_THILA'],
                endDate: item['D_HETER_SIYUM'],
                cause: item['ILA_TEUR'],
                subCause: item['TAT_ILA'],
                onCallEmployeesSum: item['SACH_HAKOL_KONANIM'],
                employeesSum: item['SACH_HAKOL_OVDIM'],
            };

            addElement(propertyName, key, engineeredItem);
        }
    }
};

const saveApprovals = async () => {
    const propertyName = 'approvals';
    const saveApprovalTable = async (url, selectorId, type) => {
        const response = await fetch(`https://www.iska.co.il/${url}`);
        if (!response.ok) {
            console.log(`error fetching iska.co.il for approvals ${type} data!`);
            return;
        }
        const html = parse(await response.text());
        const link = html.querySelector(`#${selectorId} > div > div > p > a`).getAttribute('href');

        const dataResponse = await fetch(link);
        if (!dataResponse.ok) {
            console.log(`error fetching excel file for approvals ${type} data!`);
            return;
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.read(dataResponse.body);
        const worksheet = workbook.worksheets[0];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber <= 2)
                return;
            const rowData = {};
            row.eachCell((cell, colNumber) => {
                rowData[worksheet.getCell(2, colNumber).value] = cell.value;
            });
            const key = rowData['מספר תאגיד'];
            if (!(key in generalIndex))
                return;

            rowData['סוג היתר עסקה'] = type;
            const engineeredRow = {
                type,
                details: rowData['אג"ח וני"ע'],
                comments: rowData['הערות'],
            };
            addElement(propertyName, key, engineeredRow);
        });
    };

    await saveApprovalTable(
        "%d7%a8%d7%a9%d7%99%d7%9e%d7%aa-%d7%97%d7%91%d7%a8%d7%95%d7%aa-%d7%a2%d7%9d-%d7%94%d7%99%d7%aa%d7%a8-%d7%a2%d7%99%d7%a1%d7%a7%d7%90-%d7%9b%d7%9c%d7%9c%d7%99/",
        'post-257', 'כללי');
    await saveApprovalTable(
        "%d7%a8%d7%a9%d7%99%d7%9e%d7%aa-%d7%97%d7%91%d7%a8%d7%95%d7%aa-%d7%a2%d7%9d-%d7%94%d7%99%d7%aa%d7%a8-%d7%a2%d7%99%d7%a1%d7%a7%d7%90-%d7%a4%d7%a8%d7%98%d7%99/",
        'post-2211', 'פרטי');
};

const saveLogos = async () => {
    const propertyName = 'logoUrl';

    for (const [stock, index] of generalData.map((obj, index) => [obj.stock, index])) {
        const companyName = stock.CompanyNameHeb;
        const searchQuery = `Company Logo ${companyName}`;

        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`;
        const response = await fetch(googleSearchUrl);
        if (!response.ok) {
            console.log(`error fetching logo of ${companyName}`);
            return;
        }
        const html = parse(await response.text());
        const imageElement = html.querySelectorAll('img')
            .find(img => img.getAttribute('src').startsWith("https"));

        if (!imageElement) {
            console.error('No logo found.');
            return;
        }
        const logoUrl = imageElement.getAttribute('src') ?? 'url not found.';
        // console.log(`Company: ${companyName}, Logo URL: ${logoUrl}`);
        generalData[index][propertyName] = logoUrl;
        // addElement(propertyName, generalIndex[index], logoUrl);
    }
};

const saveCompanyDetails = async () => {
    for (const [stock, index] of generalData.map((obj, index) => [obj.stock, index])) {
        const response = await fetch(`https://mayaapi.tase.co.il/api/company/alldetails?companyId=${stock.IssueNo}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "he-IL",
                "x-maya-with": "allow",
                "Referer": "https://market.tase.co.il/",
            },
        });
        if (!response.ok)
            return;
        const respData = await response.json();
        const companyDetailsKeys = [
            'CompanyLongName',
            'Description',
            'MarketValue',
            // 'Address',
            // 'ZIP',
            // 'City',
            // 'Tel',
            // 'Fax',
            // 'Email',
            'Site',
        ];
        // SecuritiesList?, ShareHolders.ShareHoldersChart, ManagementDetails.ManagementAndSeniorExecutives?, ControllerHolders?
        // SecuritiesList.Securities.[*]. ["IssuedCapital", "RegistredCapital", "MarketValue"?]
        // ControllerHolders.ShareHoldersChartData.series.[*]. [!"tooltip"]
        generalData[index]['companyDetails'] = onlyColumns(respData.CompanyDetails, companyDetailsKeys);
        generalData[index]['shareHolders'] = respData.ShareHolders.ShareHoldersChart;
    }
};

const saveFinanceData = async () => {
    for (const [stock, index] of generalData.map((obj, index) => [obj.stock, index])) {
        const response = await fetch(`https://mayaapi.tase.co.il/api/company/financereports?companyId=${stock.IssueNo}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "he-IL",
                "x-maya-with": "allow",
                "Referer": "https://market.tase.co.il/",
            },
        });
        if (!response.ok)
            return;
        const respData = await response.json();
        const relevantKeys = [
            'CurrentPeriod',
            'PreviousPeriod',
            'PreviousYear',
            'CurrencyName',
            'AllRows',
        ];
        const financeData = onlyColumns(respData, relevantKeys);
        const extractNum = (rowName, key, rowName2) => {
            const rowData = financeData.AllRows.find(row => row.Name.trim() === rowName) ??
                financeData.AllRows.find(row => row.Name.trim() === rowName2);
            return rowData ? Number(rowData?.[key].replace(" %", "").replaceAll(",", "")) : "---";
        };
        const calcPercent = (a, b) => (100 * a / b).toFixed(2) + " %";
        const formaPercent = number => (100 * number).toFixed(2) + " %";
        const additionalRows = [
            { "SectionId": 5, "Code": "0", "Name": "ערכים מחושבים נוספים", "CurrPeriodValue": "", "PrevPeriodValue": "", "PrevYearValue": "" },
            {
                "SectionId": 5, "Code": "1", "Name": "שיעור הרווח הנקי",
                "CurrPeriodValue":
                    calcPercent(extractNum("רווח נקי", "CurrPeriodValue", 'רווח נקי מיוחס לבעלי המניות'), extractNum('סה"כ הכנסות', "CurrPeriodValue")),
                "PrevPeriodValue":
                    calcPercent(extractNum("רווח נקי", "PrevPeriodValue", 'רווח נקי מיוחס לבעלי המניות'), extractNum('סה"כ הכנסות', "PrevPeriodValue")),
                "PrevYearValue":
                    calcPercent(extractNum("רווח נקי", "PrevYearValue", 'רווח נקי מיוחס לבעלי המניות'), extractNum('סה"כ הכנסות', "PrevYearValue"))
            },
            {
                "SectionId": 5, "Code": "2", "Name": "שיעור הצמיחה",
                "CurrPeriodValue": formaPercent((extractNum('סה"כ הון', "CurrPeriodValue", 'הון עצמי מיוחס לבעלי המניות') /
                    extractNum('סה"כ הון', "PrevPeriodValue", 'הון עצמי מיוחס לבעלי המניות')) - 1)
                , "PrevPeriodValue": "---", "PrevYearValue": "---"
            },

            {
                "SectionId": 5, "Code": "3", "Name": "תשואת דיבידנד",
                "CurrPeriodValue": formaPercent(
                    (extractNum('דיבידנד', "PrevYearValue") - extractNum('דיבידנד', "PrevPeriodValue") + extractNum('דיבידנד', "CurrPeriodValue"))
                    /
                    -extractNum('סה"כ הון', "CurrPeriodValue", 'הון עצמי מיוחס לבעלי המניות') /
                    extractNum('שוק להון', "CurrPeriodValue")), "PrevPeriodValue": "---", "PrevYearValue": "---"
            },

            {
                "SectionId": 5, "Code": "4", "Name": "צמיחת הכנסות",
                "CurrPeriodValue": formaPercent((extractNum('סה"כ הכנסות', "CurrPeriodValue") / extractNum('סה"כ הכנסות', "PrevPeriodValue")) - 1),
                "PrevPeriodValue": "---", "PrevYearValue": "---"
            },

            {
                "SectionId": 5, "Code": "5", "Name": "צמיחת רווח נקי",
                "CurrPeriodValue": formaPercent((extractNum('רווח נקי מיוחס לבעלי מניות', "CurrPeriodValue", 'רווח נקי') /
                    extractNum('רווח נקי מיוחס לבעלי מניות', "PrevPeriodValue", 'רווח נקי')) - 1),
                "PrevPeriodValue": "---", "PrevYearValue": "---"
            },

            // { "SectionId": 5, "Code": "6", "Name": "מספר הקסם", "CurrPeriodValue": "", "PrevPeriodValue": "---", "PrevYearValue": "---", },
        ];
        financeData.AllRows.push(...additionalRows);
        generalData[index]['financeData'] = financeData;
    }
};

const saveReports = async () => {
    for (const [stock, index] of generalData.map((obj, index) => [obj.stock, index])) {
        const body = {
            Page: 1,
            ItemsOnPage: 10,
            GroupData: [{
                DataList: [{
                    Cd: stock.IssueNo,
                    Desc: "",
                    IsSelected: true,
                    VFType: "entity"
                }]
            }],
            IsBreakingAnnouncement: false,
            IsForTaseMember: false,
            IsSpecificFund: false,
            QOpt: 1,
            ViewPage: 2
        };
        const response = await fetch("https://mayaapi.tase.co.il/api/report/filter?logo=0", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "he-IL",
                "x-maya-with": "allow",
                "Referer": "https://market.tase.co.il/",
            },
            body,
            "method": "POST"
        });
        if (!response.ok)
            return;
        const respData = await response.json();
        // console.log(respData);
        // return;
        const relevantKeys = [
            'DateFrom',
            'DateTo',
            'Reports',
        ];
        generalData[index]['reports'] = onlyColumns(respData, relevantKeys);
    }
};

const saveTradeData = async () => {
    for (const [stock, index] of generalData.map((obj, index) => [obj.stock, index])) {
        const response = await fetch(`https://api.tase.co.il/api/company/tradedata?companyId=${stock.IssueNo}&lang=0`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "he-IL",
                "x-maya-with": "allow",
                "Referer": "https://market.tase.co.il/",
            },
        });
        if (!response.ok)
            return;
        const respData = await response.json();
        const relevantKeys = [
            'BaseRate',
            'HighRate',
            'LowRate',
            'OpenRate',
            'InDay',
            'EODTradeDate',
            'TurnOverValueShekel',
            'MarketValue',
            'TradeDate',
            'LastRate',
            'Change',
        ];
        generalData[index]['tradeData'] = onlyColumns(respData, relevantKeys);
    }
};

const funcs = [
    savePermits,
    saveApprovals,
    saveLogos,
    saveCompanyDetails,
    saveFinanceData,

    // saveReports,
    // saveTradeData,
];
saveStocks()
    .then(() => Promise.all(funcs.map(func => func())))
    .then(() =>
        fs.writeFileSync('./src/lib/data/data.json',
            JSON.stringify({ index: generalIndex, data: generalData })));
