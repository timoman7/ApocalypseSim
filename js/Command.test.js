const Command = require('./Command');

test('Add command square to _Math, n', () =>{
  let _Math = new Command("nothing");
  _Math.assignCMD("square", function(input){
    return Math.pow(input, 2);
  });
  expect(_Math.parseCMD("square", 20)).toBe(400);
});

test('Add command square to _Math, and half of, 20^2 / 2', () =>{
  let _Math = new Command("nothing");
  _Math.assignCMD("square", function(input){
    return Math.pow(input, 2);
  });
  _Math.assignCMD("half of", function(input){
    return input/2;
  });
  expect(_Math.parseCMD("half of", _Math.parseCMD("square", 20))).toBe(200);
});
