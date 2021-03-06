pragma solidity ^0.4.17;

contract probLottery {
 // This is a smart contract for an ethereum-based lottery, in which one single winner is
 // picked based on a random number generated by the hash value of the blocks in ethereum,
 // whenever the number of participants reaches 25. All the currency paid by the participants
 // to join the game will be transferred then to that winner.
 // To participate in the game, one has to pay a certain single.
 // One has also to pick from 1-25 (included) a random integer as his ticket id.

    event purchased(address _user, uint64 _ticketid);
    event awardpaid(address _winner, uint64 _ticketid, uint64 _amount);
    // Events to be watched.
 
    uint64 public single = 5 ether; // A fixed single to join the game.
    uint64 public nlimit =25; // The max amount of tickets that can be sold out.
    uint64 public minbid = 1;
    uint64 public maxbid =10;

    uint8 public sold;       // Records the number of tickets sold.
    uint8 [] prob;
    mapping(uint64 => address) players;
    // mapping(address => uint64) playerIndex;
    // mapping(address => bool) votes;
    // uint64 voterCount;
    bool sent = false;

    // constructor(uint64 _single, uint64 _minbid, uint64 _maxbid) public payable {
    constructor() public payable {
        sold = 0;
        // voterCount = 0;
        // single = _single;
        // minbid = _minbid;
        // maxbid = _maxbid;
    }

    modifier allsold() {
     // Defines a state for the functions below that requires all tickets to be sold.
        require(sold == nlimit);
        _;
    }

    function() public payable {
     // Fallback function.
        revert();
    }

    function join() payable public returns (bool) {
        require(msg.value % single == 0 && msg.value != 0);
        require(msg.value/single >= minbid && msg.value/single <= maxbid );
        require(sold < nlimit);
        // Conditions for the player to join successfully and legally.

        sold += 1;
        players[sold] = msg.sender;
        for (uint i = 0; i < msg.value/single; i++) {
            prob.push(sold);
        }
        emit purchased(msg.sender, sold);

        if (sold == nlimit) {
         // The number of participants reaches the upper bound, time to send the award.
            sendrwrd();
        }
        return true;
    }

    function sendrwrd() public allsold payable returns (address) {
        uint64 winnerticket = prob[picker()];
        uint8 multiplier = uint8(prob.length);

        sold = 0;
        // Prevent re-entrancy attack by removing all arguments.
        players[winnerticket].transfer(multiplier * single);
        emit awardpaid(players[winnerticket], winnerticket, multiplier * single);
        sent = true;
        return players[winnerticket];
    }

    function picker() public view allsold returns (uint64) {
        bytes memory entropy = abi.encodePacked(block.timestamp, block.number);
        bytes32 hash = sha256(entropy);
        return uint64(hash) % (uint8(prob.length)-1) + 1;
    }

    // function sendinAdvance() payable public void () {
    // 	require(playerIndex[msg.sender]);
    // 	require(!votes[msg.sender]);

    // 	votes[msg.sender] = true;
    // 	voterCount += 1;

    // 	if (voterCount == sold) {
    // 		sendrwrd();
    // 	}
    // }

    function kill() public {
    	require(sent == true);
    	selfdestruct(this);
    }
}