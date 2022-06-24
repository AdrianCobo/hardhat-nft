// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

pragma solidity ^0.8.7;

contract BasicNft is ERC721 {
    //este link, apunta a los atributos del nft incluido su imagen, pero la imagen a la que se apunta es a un link centralizado(https), para un nft
    //no hagas esto, haz que el link apunte a una ruta descentralizada como por ejemplo la de la constante TOKEN_URI, que no es https sino ifps
    //esto solo se hizo asi para el curso
    string public constant TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    uint256 private s_tokenCounter;

    constructor() ERC721("Dogie", "DOG") {
        s_tokenCounter = 0;
    }

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter); //(who is gonna recive it, and what id is gonna have)
        s_tokenCounter = s_tokenCounter + 1; //s_tokenCounter+1
        return s_tokenCounter;
    }

    function tokenURI(
        uint256 /*tokenId*/
    ) public view override returns (string memory) {
        //no usamos el tokenId ya que solo va a haber uno
        //require(_exists(tokenId))
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
