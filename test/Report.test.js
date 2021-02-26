const Report = artifacts.require("Report");

require("chai")
    .use(require("chai-as-promised"))
    .should()

contract("Report", (accounts) => {
    let report

    before(async() => {
        report = await Report.deployed()
    })

    describe("deployment", async() => {
        it("deploys successfully", async() => {
            const address = report.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, "")
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
    })

    describe("storage", async() =>{
        it("updates the reportHash", async() =>{
            let reportHash
            reportHash = "abc123"
            await report.set(reportHash)
            const result = await report.get()
            assert.equal(result, reportHash)
        })
    })
})