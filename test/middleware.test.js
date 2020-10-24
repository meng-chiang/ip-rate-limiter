const chai = require('chai');
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');

const { expect } = chai;
const client = require('../service/redisClient');
const rateLimiter = require('../middleware/rateLimiter');
const { threshold } = require('../config/config').rateLimiterConfig;

describe('middleware function check', function () {
  afterEach(function() {
    client.multi.restore();
  });

  it("should reach rate limit threshold", async () => {
    // redis stub chain
    const execStub = sinon.stub().callsArgWith(0, null, [[null, null], [null, threshold + 1], [null, 60]]);
    const ttlStub = sinon.stub().returns({ exec: execStub });
    const incrStub = sinon.stub().returns({ ttl: ttlStub });
    const setStub = sinon.stub().returns({ incr: incrStub });
    const stub = sinon.stub(client, "multi").returns({ set: setStub });
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/v1/test',
      headers: {
        'x-forwarded-for': '127.0.0.1,192.168.0.1'
      }
    });
    const response = httpMocks.createResponse();
    const next = function() {};
    rateLimiter(request, response, next);
    expect(stub.calledOnce).to.be.true;
    expect(response.statusCode).to.equal(429);
  });

  it("should reach redis client error", async () => {
    // redis stub chain; Only trigger callback error in execStub
    const execStub = sinon.stub().callsArgWith(0, { error: 'fake error' });
    const ttlStub = sinon.stub().returns({ exec: execStub });
    const incrStub = sinon.stub().returns({ ttl: ttlStub });
    const setStub = sinon.stub().returns({ incr: incrStub });
    const stub = sinon.stub(client, "multi").returns({ set: setStub });
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/v1/test',
      headers: {
        'x-forwarded-for': '127.0.0.1,192.168.0.1'
      }
    });
    const response = httpMocks.createResponse();
    const next = function() {};
    rateLimiter(request, response, next);
    expect(stub.calledOnce).to.be.true;
    expect(response.statusCode).to.equal(500);
  });

  it("should pass rate limiter check", async () => {
    // redis stub chain; Only trigger callback error in execStub
    const execStub = sinon.stub().callsArgWith(0, null, [[null, null], [null, threshold - 1], [null, 60]]);
    const ttlStub = sinon.stub().returns({ exec: execStub });
    const incrStub = sinon.stub().returns({ ttl: ttlStub });
    const setStub = sinon.stub().returns({ incr: incrStub });
    const stub = sinon.stub(client, "multi").returns({ set: setStub });
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/v1/test',
      headers: {
        'x-forwarded-for': '127.0.0.1,192.168.0.1'
      }
    });
    const response = httpMocks.createResponse();
    const next = function() {};
    rateLimiter(request, response, next);
    expect(stub.calledOnce).to.be.true;
    expect(response.statusCode).to.equal(200);
  });

});