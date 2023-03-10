"use strict";

var assert = require("assert"),
  should = require("should");

var exchangeData = {};

describe("exchange", function () {
  it("buy should add a BUY nockmarket order", function (done) {
    exchangeData = exchange.buy(40, 100, exchangeData);
    exchangeData.buys.volumes[40].should.eql(100);
    done();
  });
  it("sell should add a SELL nockmarket order", function (done) {
    exchangeData = exchange.sell(41, 200, exchangeData);
    exchangeData.sells.volumes[41].should.eql(200);
    done();
  });
  it("sell should produce trades", function (done) {
    exchangeData = exchange.sell(40, 75, exchangeData);
    exchangeData.trades[0].price.should.eql(40);
    exchangeData.trades[0].volume.should.eql(75);
    exchangeData.buys.volumes[40].should.eql(25);
    exchangeData.sells.volumes[41].should.eql(200);
    done();
  });
});
