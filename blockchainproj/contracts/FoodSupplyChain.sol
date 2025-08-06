// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FoodSupplyChain {
    enum State { Harvested, Processed, Packed, Shipped, Received, Sold }

    struct FoodItem {
        uint256 id;
        string name;
        string origin;
        address currentOwner;
        State state;
        string metadataURI;
    }

    uint256 public itemCount;
    uint256[] public itemIds;
    mapping(uint256 => FoodItem) public items;

    event StateChanged(uint256 indexed id, State state, address changedBy);

    modifier onlyOwner(uint256 _id) {
        require(msg.sender == items[_id].currentOwner, "Not authorized");
        _;
    }

    function createItem(string memory _name, string memory _origin, string memory _metadataURI) public {
        itemCount++;
        items[itemCount] = FoodItem({
            id: itemCount,
            name: _name,
            origin: _origin,
            currentOwner: msg.sender,
            state: State.Harvested,
            metadataURI: _metadataURI
        });
        itemIds.push(itemCount);
        emit StateChanged(itemCount, State.Harvested, msg.sender);
    }

    function getAllItemIds() public view returns (uint256[] memory) {
        return itemIds;
    }

    function advanceState(uint256 _id) public onlyOwner(_id) {
        require(uint8(items[_id].state) < uint8(State.Sold), "Already sold");
        items[_id].state = State(uint8(items[_id].state) + 1);
        emit StateChanged(_id, items[_id].state, msg.sender);
    }

    function transferOwnership(uint256 _id, address _newOwner) public onlyOwner(_id) {
        items[_id].currentOwner = _newOwner;
    }

    function getItem(uint256 _id) public view returns (FoodItem memory) {
        return items[_id];
    }
}
