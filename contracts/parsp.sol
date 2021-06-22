pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
contract parsp{
    
    // Kontrat deploy edildiğinde deploy eden adresi alır ve onu admin rolüne eşitler.
    constructor() public {
        RolesMap[msg.sender] = "SUPERVISOR";
    }
    
    // Report adında bir yapı oluşturduk yapının sahip olduğu özellikleri tanımladık.
    struct Report{
        uint256 reportID;
        string reportHash;
        string reportName;
        string reportType;
    }

    // kontrat tarafından oluşturulmuş toplam rapor sayısının atanacağı değişken.
    uint256 TotalReportsCount;


    Report[] ReportsList;
    Report[] ValidReportsList;

    mapping(address => string) RolesMap;

    // Reportnin içindeki reportID yi Report ile maplemak için oluştuduruğumuz map işlemi. 
    mapping(uint256 => Report) ReportsMap;    
            
    mapping(uint256 => string) ReportsValidity;

    // burası rolü kontrol eden bir yapı bu yapıyı fonksiyonların içerisine ekleyerek sadece admin rolune sahip adreslerin o fonksiyonları çalıştırması sağlanır.
    modifier checkRole(string memory _role) {
        require(
            keccak256(abi.encode(RolesMap[msg.sender])) ==
                keccak256(abi.encode(_role))
        );
        _;
    }
    
     // bunu sadece admin çağırabilir.(checkAuth yapısı sayesinde). İstediğimiz rolleri adreslere atayabiliriz.
    function setUserRole(address _userAddress, string memory _role)
        public
        checkRole("SUPERVISOR")
    {
        RolesMap[_userAddress] = _role;
    }
    
     // adreslere atadığımız rolleri buradan kontrol edebiliriz. bunu görüntülemek için de admin olmaa şartı checkAuth la sağlanmıştır.
    function getUserRole(address _userAddress)
        public
        view
        returns (string memory)
    {
        return RolesMap[_userAddress];
    }
    
    //bu fonksiyon parametre olarak Report alarak ReportList'e kayıt eklememizi sağlar. 
    function createReport(
        string memory _reportHash,
        string memory _reportName,
        string memory _reportType
        ) public checkRole("LABORANT") {                     //bu fonksyionu sadece CREATER rolüne sahip adresler çalıştırabilir.
            Report memory newReport = Report({     //parametre olarak aldığımız değerlerin Reportnin hangi değelrerine eşitlememiz gerektiğini atadığımız yer
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


    
    /* // GET REPORT FUNCTIONS
    function getReport(uint256 reportID) public view returns(string memory reportHash, string memory reportName, string memory reportType){
        Report memory report = ReportsMap[reportID];
        return (report.reportHash, report.reportName, report.reportType); 
    }*/

    function getAllReports() public view returns (Report[] memory) {
        return ReportsList;
    }

    function getReportCount() public view returns(uint256){
        return TotalReportsCount;
    }
}




