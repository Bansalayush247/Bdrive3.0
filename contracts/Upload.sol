// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload{
    uint count=0;
    struct Access{
        address user;
        bool access;
    }

    mapping (address => string[]) value;
    mapping (address => mapping(address=>bool)) ownership;
    mapping (address => mapping(address=>bool))previousData;
    mapping (address => Access[]) accessList;
    

    function add(address _user,string memory url) external{
        value[_user].push(url);
    }
    function addressremover(address _user) external{
        for(uint i=0;i<accessList[msg.sender].length;i++)
        {
            if(accessList[msg.sender][i].user == _user)
            {
                 accessList[msg.sender][i].access=false;
            delete accessList[msg.sender][i];          
            break ;
            }
        }
    }

    function allow(address user) external{
        ownership[msg.sender][user]=true;
        if(previousData[msg.sender][user]){
            for(uint i=0;i<accessList[msg.sender].length;i++)
            {
                if(accessList[msg.sender][i].user==user)
                {
                    accessList[msg.sender][i].access=true;
                }
            
            }

        }
        else{
            accessList[msg.sender].push(Access(user,true));
            previousData[msg.sender][user]=true;
            count ++;
        }
    }

    function disallow(address user) public{
        ownership[msg.sender][user]=false;
        for(uint i=0;i<accessList[msg.sender].length;i++)
        {
            if(accessList[msg.sender][i].user==user)
            {
                accessList[msg.sender][i].access=false;
            }
        }

    }
    function display(address _user) external view returns(string[] memory)
    {
        require(_user==msg.sender|| ownership[_user][msg.sender],"You don't have access");
        return value[_user];
    }
    function removeitem(address _user,string memory _data) external {
        require(_user==msg.sender ,"You cann't delete the image");
        for(uint i=0;i<value[_user].length;i++)
        {
            if(keccak256(abi.encodePacked(_data)) == keccak256(abi.encodePacked(value[_user][i])))
            {
               delete  value[_user][i];
            }
        }
    }
    function shareAccess() public view returns(Access[] memory){
        return accessList[msg.sender];
    }
}