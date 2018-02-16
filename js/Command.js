class Command{
  constructor(game){
    this.game = game;
    this.init();
  }
  init(){
    this.CMDS = {};
    this.RECOGNIZED_CMDS = [];
  }
  assignCMD(CMD, func){
    this.RECOGNIZED_CMDS.push(CMD);
    this.CMDS[CMD] = func;
  }
  parseCMD(CMD, input){
    return this.CMDS[CMD](input);
  }
}

if(typeof module !== "undefined"){
  module.exports = Command;
}
