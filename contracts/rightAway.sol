pragma solidity ^0.4.17;

contract rightAway {
	// This is a smart contract for an ethereum-based lottery that gives out the decision
	// right after the lottery is purchased.
	// The player chooses a random integer in a given range and see if he/she is lucky
	// enough to hit the one generated from the hash value of the current block.

	event purchased(address indexed _user, uint64 _guess);
	event delivered(address indexed _user, uint64 _guess, uint64 _wincode, bool _win);

	uint128 public price   =  5 wei;
	uint128 public award   = 50 wei;
	uint64 public minguess =  0;
	uint64 public maxguess = 20; // Range of the guess.
	// Parameters that won't be altered.

	address public user;
	bool public join;
	bool public checked;
	bool public win;
	// Arguments, will be cleared.

	constructor() public {
		user = msg.sender;
		join = false;
		checked = false;
		win = false;
	}

	modifier joined() {
		// Defines a state for the functions below that requires the user to be in the game.
		require(join == true);
		_;
	}

	function() payable public {
		// Fallback function.
		revert();
	}

	function play(uint64 _guess) payable public returns (bool) {
		require(msg.value == price);
		require(join == false);
		// One cannot join again.
		require(_guess >= minguess && _guess <= maxguess);

		join = true;
		user = msg.sender;
		emit purchased(user, _guess);

		deliver(_guess);
	}

	function deliver(uint64 _guess) public joined returns (address) {
		require(checked == false);
		// One cannot check for several times until he/she wins.
		uint64 wincode = check();
		if (_guess == wincode) {
			address tempusr = user;
			bool tempwin = true;
			reset();
			// Prevent the re-entrancy attack.
			tempusr.transfer(award);
		}
		emit delivered(tempusr, _guess, wincode, tempwin);
		return tempusr;
	}
	
	function check() public joined returns (uint64) {
		require(checked == false);
		bytes memory entropy = abi.encodePacked(block.timestamp, block.number);
        bytes32 hash = sha256(entropy);
        checked = true;
        // The secret winning code cannot be generated again.
        return uint64(hash) % maxguess;
	}

	function reset() private joined returns (bool) {
		delete user;
		join = false;
		checked = false;
		win = false;
	}
}