const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventPlatform", function () {
  let EventPlatform;
  let eventPlatform;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    EventPlatform = await ethers.getContractFactory("EventPlatform");
    [owner, addr1, addr2] = await ethers.getSigners();
    eventPlatform = await EventPlatform.deploy();
    await eventPlatform.deployed();
  });

  describe("Event Creation", function () {
    it("Should create an event", async function () {
      const eventName = "Test Event";
      const eventDate = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      const eventPrice = ethers.utils.parseEther("0.1");
      const ticketSupply = 100;
      const ipfsHash = "QmTest";

      await eventPlatform.createEvent(eventName, eventDate, eventPrice, ticketSupply, ipfsHash, false, ethers.constants.AddressZero);

      const event = await eventPlatform.getEvent(1);
      expect(event.name).to.equal(eventName);
      expect(event.date).to.equal(eventDate);
      expect(event.price).to.equal(eventPrice);
      expect(event.ticketSupply).to.equal(ticketSupply);
      expect(event.organizer).to.equal(owner.address);
    });
  });

  describe("Ticket Purchase", function () {
    beforeEach(async function () {
      await eventPlatform.createEvent("Test Event", Math.floor(Date.now() / 1000) + 86400, ethers.utils.parseEther("0.1"), 100, "QmTest", false, ethers.constants.AddressZero);
    });

    it("Should allow ticket purchase", async function () {
      await eventPlatform.connect(addr1).purchaseTicket(1, { value: ethers.utils.parseEther("0.1") });

      const event = await eventPlatform.getEvent(1);
      expect(event.ticketsSold).to.equal(1);

      const balance = await eventPlatform.balanceOf(addr1.address);
      expect(balance).to.equal(1);
    });

    it("Should not allow ticket purchase with insufficient funds", async function () {
      await expect(
        eventPlatform.connect(addr1).purchaseTicket(1, { value: ethers.utils.parseEther("0.05") })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Ticket Transfer", function () {
    beforeEach(async function () {
      await eventPlatform.createEvent("Test Event", Math.floor(Date.now() / 1000) + 86400, ethers.utils.parseEther("0.1"), 100, "QmTest", false, ethers.constants.AddressZero);
      await eventPlatform.connect(addr1).purchaseTicket(1, { value: ethers.utils.parseEther("0.1") });
    });

    it("Should allow ticket transfer", async function () {
      const tokenId = await eventPlatform.tokenOfOwnerByIndex(addr1.address, 0);
      await eventPlatform.connect(addr1).transferTicket(tokenId, addr2.address);

      const newOwner = await eventPlatform.ownerOf(tokenId);
      expect(newOwner).to.equal(addr2.address);
    });
  });

  describe("Whitelist Management", function () {
    beforeEach(async function () {
      await eventPlatform.createEvent("Test Event", Math.floor(Date.now() / 1000) + 86400, ethers.utils.parseEther("0.1"), 100, "QmTest", false, ethers.constants.AddressZero);
    });

    it("Should allow organizer to add addresses to whitelist", async function () {
      await eventPlatform.addToWhitelist(1, [addr1.address, addr2.address]);
      
      const isWhitelisted1 = await eventPlatform.eventWhitelists(1, addr1.address);
      const isWhitelisted2 = await eventPlatform.eventWhitelists(1, addr2.address);
      
      expect(isWhitelisted1).to.be.true;
      expect(isWhitelisted2).to.be.true;
    });

    it("Should allow organizer to remove addresses from whitelist", async function () {
      await eventPlatform.addToWhitelist(1, [addr1.address, addr2.address]);
      await eventPlatform.removeFromWhitelist(1, [addr1.address]);
      
      const isWhitelisted1 = await eventPlatform.eventWhitelists(1, addr1.address);
      const isWhitelisted2 = await eventPlatform.eventWhitelists(1, addr2.address);
      
      expect(isWhitelisted1).to.be.false;
      expect(isWhitelisted2).to.be.true;
    });
  });
});