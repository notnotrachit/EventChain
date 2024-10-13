// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EventPlatform is ERC721, Ownable {
    constructor() ERC721("EventTicket", "EVTK") Ownable() {}
    using Counters for Counters.Counter;
    Counters.Counter private _eventIds;
    Counters.Counter private _ticketIds;

    struct Event {
        uint256 id;
        string name;
        uint256 date;
        uint256 price;
        uint256 ticketSupply;
        uint256 ticketsSold;
        address organizer;
        string ipfsHash;
        bool isTokenGated;
        address gateToken;
    }

    struct Ticket {
        uint256 id;
        uint256 eventId;
        address owner;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(address => bool) public organizers;
    mapping(uint256 => mapping(address => bool)) public eventWhitelists;

    event EventCreated(uint256 indexed eventId, string name, address organizer);
    event TicketPurchased(uint256 indexed eventId, uint256 indexed ticketId, address buyer);
    event TicketTransferred(uint256 indexed ticketId, address from, address to);

    function createEvent(
        string memory _name,
        uint256 _date,
        uint256 _price,
        uint256 _ticketSupply,
        string memory _ipfsHash,
        bool _isTokenGated,
        address _gateToken
    ) external {
        require(organizers[msg.sender] || owner() == msg.sender, "Not authorized to create events");
        _eventIds.increment();
        uint256 newEventId = _eventIds.current();

        events[newEventId] = Event(
            newEventId,
            _name,
            _date,
            _price,
            _ticketSupply,
            0,
            msg.sender,
            _ipfsHash,
            _isTokenGated,
            _gateToken
        );

        emit EventCreated(newEventId, _name, msg.sender);
    }

    function purchaseTicket(uint256 _eventId) external payable {
        Event storage _event = events[_eventId];
        require(_event.id != 0, "Event does not exist");
        require(_event.ticketsSold < _event.ticketSupply, "Event is sold out");
        require(msg.value >= _event.price, "Insufficient payment");
        
        if (_event.isTokenGated) {
            require(IERC721(_event.gateToken).balanceOf(msg.sender) > 0, "You don't have the required token");
        }

        _ticketIds.increment();
        uint256 newTicketId = _ticketIds.current();

        tickets[newTicketId] = Ticket(newTicketId, _eventId, msg.sender);
        _event.ticketsSold++;

        _safeMint(msg.sender, newTicketId);

        emit TicketPurchased(_eventId, newTicketId, msg.sender);
    }

    function transferTicket(uint256 _ticketId, address _to) external {
        require(ownerOf(_ticketId) == msg.sender, "Not the ticket owner");
        _transfer(msg.sender, _to, _ticketId);
        tickets[_ticketId].owner = _to;

        emit TicketTransferred(_ticketId, msg.sender, _to);
    }

    function addToWhitelist(uint256 _eventId, address[] memory _addresses) external {
        require(events[_eventId].organizer == msg.sender, "Not the event organizer");
        for (uint i = 0; i < _addresses.length; i++) {
            eventWhitelists[_eventId][_addresses[i]] = true;
        }
    }

    function removeFromWhitelist(uint256 _eventId, address[] memory _addresses) external {
        require(events[_eventId].organizer == msg.sender, "Not the event organizer");
        for (uint i = 0; i < _addresses.length; i++) {
            eventWhitelists[_eventId][_addresses[i]] = false;
        }
    }

    function addOrganizer(address _organizer) external onlyOwner {
        organizers[_organizer] = true;
    }

    function removeOrganizer(address _organizer) external onlyOwner {
        organizers[_organizer] = false;
    }

    function getEvent(uint256 _eventId) external view returns (Event memory) {
        return events[_eventId];
    }

    function getTicket(uint256 _ticketId) external view returns (Ticket memory) {
        return tickets[_ticketId];
    }


    function getEventCount() external view returns (uint256) {
        return _eventIds.current();
    }

    function getAllEvents() external view returns (Event[] memory) {
        Event[] memory _events = new Event[](_eventIds.current());
        for (uint i = 1; i <= _eventIds.current(); i++) {
            _events[i - 1] = events[i];
        }
        return _events;
    }
}