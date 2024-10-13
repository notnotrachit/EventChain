// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedEventPlatform {
    struct Event {
        address creator;
        string name;
        string description;
        uint256 date;
        uint256 ticketPrice;
        uint256 maxTickets;
        uint256 ticketsSold;
    }

    mapping(uint256 => Event) public events;
    mapping(address => mapping(uint256 => uint256)) public ticketsOwned;
    uint256 public eventCount;

    event EventCreated(uint256 eventId, string name, uint256 date, uint256 ticketPrice, uint256 maxTickets);
    event TicketPurchased(address buyer, uint256 eventId, uint256 quantity);

    function createEvent(
        string memory _name,
        string memory _description,
        uint256 _date,
        uint256 _ticketPrice,
        uint256 _maxTickets
    ) public {
        require(_date > block.timestamp, "Event date must be in the future.");
        require(_maxTickets > 0, "There must be at least one ticket available.");
        events[eventCount] = Event({
            creator: msg.sender,
            name: _name,
            description: _description,
            date: _date,
            ticketPrice: _ticketPrice,
            maxTickets: _maxTickets,
            ticketsSold: 0
        });
        emit EventCreated(eventCount, _name, _date, _ticketPrice, _maxTickets);
        eventCount++;
    }

    function buyTickets(uint256 _eventId, uint256 _quantity) public payable {
        Event storage eventDetails = events[_eventId];
        require(eventDetails.date > block.timestamp, "Event has already occurred.");
        require(_quantity > 0 && _quantity <= (eventDetails.maxTickets - eventDetails.ticketsSold), "Not enough tickets available.");
        require(msg.value == eventDetails.ticketPrice * _quantity, "Incorrect payment amount.");
        ticketsOwned[msg.sender][_eventId] += _quantity;
        eventDetails.ticketsSold += _quantity;
        payable(eventDetails.creator).transfer(msg.value);
        emit TicketPurchased(msg.sender, _eventId, _quantity);
    }

    function getTicketsOwned(uint256 _eventId) public view returns (uint256) {
        return ticketsOwned[msg.sender][_eventId];
    }

    function getTicketsOwnedByAccount(address _account, uint256 _eventId) public view returns (uint256) {
        return ticketsOwned[_account][_eventId];
    }

    function getEventCount() public view returns (uint256) {
        return eventCount;
    }

    function getEventDetails(uint256 _eventId)
        public
        view
        returns (
            address,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        Event memory eventDetails = events[_eventId];
        return (
            eventDetails.creator,
            eventDetails.name,
            eventDetails.description,
            eventDetails.date,
            eventDetails.ticketPrice,
            eventDetails.maxTickets,
            eventDetails.ticketsSold
        );
    }
    
    function getTicketsOfEvent(uint256 _eventId) public view returns (address[] memory, uint256[] memory) {
        Event storage eventDetails = events[_eventId];
        address[] memory ticketOwners = new address[](eventDetails.maxTickets);
        uint256[] memory ticketQuantities = new uint256[](eventDetails.maxTickets);
        for (uint256 i = 0; i < eventDetails.maxTickets; i++) {
            ticketOwners[i] = address(0);
            ticketQuantities[i] = 0;
        }
        for (uint256 i = 0; i < eventDetails.maxTickets; i++) {
            address owner = address(0);
            uint256 quantity = 0;
            for (uint256 j = 0; j < eventCount; j++) {
                if (ticketsOwned[msg.sender][j] > 0) {
                    owner = msg.sender;
                    quantity = ticketsOwned[msg.sender][j];
                }
            }
            ticketOwners[i] = owner;
            ticketQuantities[i] = quantity;
        }
        return (ticketOwners, ticketQuantities);
    }
}
