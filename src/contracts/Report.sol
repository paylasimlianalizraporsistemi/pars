pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Report{
    uint public reportCount = 0;

    struct ReportObj{
      uint id;
      string reportHash;
      string reportName;
      string reportType;
    }

    mapping(uint => ReportObj) public reports;

    function createReport(string memory _reportHash, string memory _reportName, string memory _reportType) public{
        reports[reportCount] = ReportObj(reportCount, _reportHash, _reportName,_reportType);
        reportCount ++;


    }

    function getReportCount() view public returns (uint) {
      return reportCount;
    }

    function getTrip() public view returns (ReportObj[] memory){
      ReportObj[] memory trrips = new ReportObj[](reportCount);
      for (uint i = 0; i < reportCount; i++) {
          ReportObj storage trrip = reports[i];
          trrips[i] = trrip;
      }
      return trrips;
  }
}
