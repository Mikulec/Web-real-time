"use strict";

var $ = require("jquery"),
  BinaryHeap = require("./BinaryHeap");
var BUY = "buys",
  SELL = "sells";

function createBinaryHeap(orderType) {
  return new BinaryHeap(function (x) {
    return x;
  }, orderType);
}

function createExchange(exchangeData) {
  var cloned = $.extend(true, {}, exchangeData);
  cloned.trades = [];
  init(cloned, BUY);
  init(cloned, SELL);
  return cloned;

  function init(exchange, orderType) {
    if (!exchange[orderType]) {
      exchange[orderType] = { volumes: {} };
      var options = {};
    }
    if (BUY === orderType) {
      options.max = true;
    }
    exchange[orderType].prices = createBinaryHeap(options);
  }
}

function order(orderType, price, volume, exchangeData) {
  var cloned = createExchange(exchangeData);
  var orderBook = cloned[orderType];
  var oldVolume = orderBook.volumes[price];
  var remainingVolume = volume;
  var storePrice = true;
  var trade = isTrade();

  if (trade) {
    var oppBook = cloned[BUY];
    if (orderType === BUY) {
      oppBook = cloned[SELL];
    }
    while (remainingVolume > 0 && Object.keys(oppBook.volumes).length > 0) {
      var bestOppPrice = oppBook.prices.peek();
      var bestOppVol = oppBook.volumes[bestOppPrice];

      if (bestOppVol > remainingVolume) {
        cloned.trades.push({ price: bestOppPrice, volume: remainingVolume });
        oppBook.volumes[bestOppPrice] =
          oppBook.volumes[bestOppPrice] - remainingVolume;
        remainingVolume = 0;
        storePrice = false;
      } else {
        if (bestOppVol == remainingVolume) {
          storePrice = false;
        }

        cloned.trades.push({
          price: bestOppPrice,
          volume: oppBook.volumes[bestOppPrice],
        });
        remainingVolume = remainingVolume - oppBook.volumes[bestOppPrice];
        oppBook.prices.pop();
        delete oppBook.volumes[bestOppPrice];
      }
    }
  }

  function getOposite() {
    return BUY === orderType ? SELL : BUY;
  }
  function isTrade() {
    var opp = cloned[getOposite()].prices.peek();
    return BUY === orderType ? price >= opp : price <= opp;
  }
}

module.exports = {
  BUY,
  SELL,
  buy: function (price, volume, exchangeData) {
    return order(BUY, price, volume, exchangeData);
  },
  sell: function (price, volume, exchangeData) {
    return order(SELL, price, volume, exchangeData);
  },
  order,
};
