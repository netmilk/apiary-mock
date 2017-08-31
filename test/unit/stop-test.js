const {assert} = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const fsMock = require('mock-fs');
const fs = require('fs');

const stop = require('../../src/stop')



describe("stop", ()=>{
  it("exports an object", ()=>{
    assert.isObject(stop);
  });

  describe("the object", ()=>{
    it("has 'execute' property",() =>{
      assert.property(stop, 'execute')
    });

    describe("the 'execute' property", ()=>{
      it("is a function", ()=>{
        assert.isFunction(stop.execute);
      });

      beforeEach(()=>{
        nock.disableNetConnect();
      });

      afterEach(()=>{
        nock.enableNetConnect();
      });

      describe("when I call .execute(config, callback)", ()=>{
        let config = {
          domain: "mockcislot1"
        };

        let apiaryNock, receivedRequest;

        describe("if the session file '.apiary-mock-session' already exists", ()=>{

          let callback;
          before((done)=>{
            fs.readFile("./test/fixtures/mock-html/allgood.html", 'utf8', (loadError, html)=>{
              if(loadError){done(loadError)};

              apiaryNock = nock("http://docs.mockcislot1.apiary.io")
                .get("/traffic")
                .reply(200, function(uri, requestBody){
                  receivedRequest = this.req;
                  return html;
                });

              fsMock({
                ".apiary-mock-mockcislot1":
                  `
                  domain: mockcislot1
                  url: http://private-anon-659a90205f-mockcislot1.apiary-mock.com
                  session: abcdefgh123456
                  `
              });

              callback = sinon.spy((error)=>{done(error)});
              stop.execute(config, callback);
            });
          });

          after(()=>{
            nock.cleanAll();
            fsMock.restore();
          });

          it("should fetch the mock url",()=>{
            assert.isTrue(apiaryNock.isDone());
          });

          it("should send the 'cookie' header with the 'connect.sid=abcde'", ()=>{
            assert.property(receivedRequest.headers, 'cookie');
            assert.include(receivedRequest.headers.cookie, 'connect.sid=abcdefgh123456')
          });

          it("should save the report to the 'apiary-mock-mockcislot1.html'", (done)=>{
            fs.stat('apiary-mock-mockcislot1.html',(error, stats)=>{
              if(error){done(error)};
              assert.isNull(error);
              assert.isDefined(stats);
              done()
            });
          });


          it("should delete the session file",(done)=>{
            fs.stat('./.apiary-mock-mockcislot1', (error)=>{
              assert.instanceOf(error, Error);
              done();
            });
          });

          describe("the first callback argument", ()=>{
            it("shuould be null",()=>{
              assert.isNull(callback.firstCall.args[0]);
            });
          });

          describe("the second callback argument", ()=>{
            it("should be and object with 'message', 'report' and 'statusCode' property", ()=>{
              let second = callback.firstCall.args[1];
              assert.property(second, 'message');
              assert.property(second, 'report');
              assert.include(second.report, 'file://');
              assert.include(second.report, 'apiary-mock-mockcislot1.html');
              // statusCode is 0 because of the 'allgood' fixture
              assert.propertyVal(second, 'statusCode', 0);
            });
          });
        });

        describe("if the mock URL in the session file is " +
        "different than the one in the fetched results ",()=>{

          let callback;
          before((done)=>{
            fs.readFile("./test/fixtures/mock-html/allgood.html", 'utf8', (loadError, html)=>{
              if(loadError){done(loadError)};

              apiaryNock = nock("http://docs.mockcislot1.apiary.io")
                .get("/traffic")
                .reply(200, function(uri, requestBody){
                  receivedRequest = this.req;
                  return html;
                });

              fsMock({
                ".apiary-mock-mockcislot1":
                  `
                  domain: mockcislot1
                  url: http://private-ALL-DIFFERENT-THAN-EXPECTED-mockcislot1.apiary-mock.com
                  session: abcdefgh123456
                  `
              });

              // Don't passing the error to the callback here. Expecting an error later.
              callback = sinon.spy((error)=>{done()});
              stop.execute(config, callback);
            });
          });

          after(()=>{
            nock.cleanAll();
            fsMock.restore();
          });


          it("should call the callback with an error as a first argument", ()=>{
            assert.instanceOf(callback.firstCall.args[0], Error);
          });

          describe("the error", ()=>{
            it("should contain 'PANIC' and 'changed', 'apiary' and 'doesn't work' in the message", ()=>{
              errorMessage = callback.firstCall.args[0].message;
              assert.include(errorMessage, "PANIC");
              assert.include(errorMessage, "doesn't work");
            });

            it("should have 'statusCode' property set to 6", ()=>{
              assert.propertyVal(callback.firstCall.args[0], 'statusCode', 6);
            });
          });
        });

        describe("when the session file doesn't exist",()=>{
          it("should return an error containing 'session' and 'doesn't exist' and 'mockcislot1'");
        });

        describe("when the response is error",()=>{
          it("should return the error to the first callback argument")
          it("shuoldn't delete the session file")
        });
      });
    });
  });
});
