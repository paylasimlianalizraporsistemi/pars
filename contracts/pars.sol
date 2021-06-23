pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
contract pars{
    

    constructor() public {
        RolesMap[msg.sender] = "SUPERVISOR";
    }
    

    struct Report{
        uint256 reportID;
        string reportHash;
        string reportName;
        string reportType;
    }


    uint256 TotalReportsCount;


    Report[] ReportsList;
    Report[] ValidReportsList;

    mapping(address => string) RolesMap;

    mapping(uint256 => Report) ReportsMap;    
            
    mapping(uint256 => string) ReportsValidity;

    modifier checkRole(string memory _role) {
        require(
            keccak256(abi.encode(RolesMap[msg.sender])) ==
                keccak256(abi.encode(_role))
        );
        _;
    }
    

    function setUserRole(address _userAddress, string memory _role)
        public
        checkRole("SUPERVISOR")
    {
        RolesMap[_userAddress] = _role;
    }
    

    function getUserRole(address _userAddress)
        public
        view
        returns (string memory)
    {
        return RolesMap[_userAddress];
    }
    

    function createReport(
        string memory _reportHash,
        string memory _reportName,
        string memory _reportType
        ) public checkRole("LABORANT") {  
            Report memory newReport = Report({     
                reportID: TotalReportsCount,
                reportHash: _reportHash,
                reportName: _reportName,                            
                reportType: _reportType
            });
        
        ReportsMap[TotalReportsCount] = newReport;  
        ReportsValidity[TotalReportsCount] = "INVALID";
        ReportsList.push(newReport);
        TotalReportsCount++;

    }


    function validateReport(uint256 _reportID) public checkRole("SUPERVISOR"){
        Report memory report = ReportsMap[_reportID];
        ReportsValidity[_reportID] = "VALID";
        ValidReportsList.push(report);
        for(uint256 x = 0; x < ReportsList.length; x++){
            if(ReportsList[x].reportID == ReportsMap[_reportID].reportID){
                delete ReportsList[x];
            }
        }
        

    }

    function invalidateReport(uint256 _reportID) public checkRole("SUPERVISOR"){
        Report memory report = ReportsMap[_reportID];
        ReportsValidity[_reportID] = "INVALID";
        ReportsList.push(report);
        for(uint256 x = 0; x < ValidReportsList.length; x++){
            if(ValidReportsList[x].reportID == ReportsMap[_reportID].reportID){
                delete ValidReportsList[x];
            }
        }
    }
    
    /*
    function getReport(uint256 reportID) public view returns(string memory reportHash, string memory reportName, string memory reportType){
        Report memory report = ReportsMap[reportID];
        return (report.reportHash, report.reportName, report.reportType); 
    }*/

    function getAllReports() public view returns (Report[] memory) {
        return ReportsList;
    }

    function getValidReports() public view returns (Report[] memory) {
        return ValidReportsList;
    }

    function getReportCount() public view returns(uint256){
        return TotalReportsCount;
    }
}




