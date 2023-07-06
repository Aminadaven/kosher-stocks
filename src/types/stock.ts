import type StockIndex from "./stockIndex";

interface Stock {
    [index: string]: Array<StockIndex> | string;
    Id: string;
    ISIN: string;
    NameHeb: string;
    NameEng: string;
    SubTypeHeb: string;
    SubTypeEng: string;
    SymbolHeb: string;
    SymbolEng: string;
    SuperSectorHeb: string;
    SuperSectorEng: string;
    SectorHeb: string;
    SectorEng: string;
    SubSectorHeb: string;
    SubSectorEng: string;
    CompanyNameHeb: string;
    CompanyNameEng: string;
    CorporateNo: string;
    IssueNo: string;
    IndicesListHeb: Array<StockIndex>;
    IndicesListEng: Array<StockIndex>;
    IncorporationPlaceHeb: string;
    IncorporationPlaceEng: string;
}

export default Stock;
