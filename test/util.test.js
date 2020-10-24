const chai = require('chai');
const httpMocks = require('node-mocks-http');

const { expect } = chai;

const getReqIP = require('../util/getReqIP');

describe('util function check', function () {
  it("should get req ip from x-forward-for correct", async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/mock',
      headers: {
        'x-forwarded-for': '127.0.0.1,192.168.0.1'
      }
    });
    expect(getReqIP(request)).to.equal('127.0.0.1');
  });
  it("should get req ip from connection.remoteAddress correct", async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/mock',
      connection: {
        'remoteAddress': '127.0.0.1'
      }
    });
    expect(getReqIP(request)).to.equal('127.0.0.1');
  });
});