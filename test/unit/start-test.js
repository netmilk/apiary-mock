const {assert} = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const fsMock = require('mock-fs');
const fs = require('fs');

const start = require('../../src/start');



describe("start", ()=>{
  it("exports an object", ()=>{
    assert.isObject(start);
  });

  describe("the object", ()=>{
    it("has 'execute' property",() =>{
      assert.property(start, 'execute')
    });

    describe("the 'execute' property", ()=>{
      it("is a function", ()=>{
        assert.isFunction(start.execute);
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

        describe("if the session file '.apiary-mock-session' already exists", ()=>{

          let callback;

          before((done)=>{
            // This is a bit a integration test here because I'm not mocking session's
            // callback error. I'm loosing it.
            fsMock({
              ".apiary-mock-mockcislot1":
                `
                domain: mockcislot1
                url: http://mockcislot1.mock.tld
                session: abcdefgh123456
                `
            });

            callback = sinon.spy(()=>{done()});
            start.execute(config, callback);
          });

          after(()=>{
            fsMock.restore();
          });

          it("should call the passed callback with an error as a first argument",()=>{
            assert.instanceOf(callback.firstCall.args[0], Error);
          });

          describe("the error", ()=>{
            it("should contain message with 'already exists' and the mock URL", ()=>{
              let error = callback.firstCall.args[0];
              assert.include(error.message, 'already exists');
              assert.include(error.message, 'http://');
            });

            it("should have the 'statusCode' property with value 4",() =>{
              assert.equal(callback.firstCall.args[0].statusCode, 4);
            });
          });
        });

        describe("when first argument config object doesn't have 'domain' property", () => {
          it("should call the passed callback with an error as a first argument");

          describe("the error message", ()=>{
            it("should contain 'domain'");
          });
        });


        describe("when the session desn't exist", ()=>{
          let apiaryNock;
          beforeEach(()=>{
            apiaryNock = nock("http://docs.mockcislot1.apiary.io")
              .get('/traffic')
              .reply(200);
          });
          afterEach(()=>{
            nock.cleanAll();
          });

          it("should call Apiary Mock URL for the domain", (done)=>{
            start.execute(config, ()=>{
              assert.isTrue(apiaryNock.isDone());
              done();
            })
          });
        });

        describe("when the Apiary Mock fails for some reason", ()=>{
          let apiaryNock;
          beforeEach(()=>{
            apiaryNock = nock("http://docs.mockcislot1.apiary.io")
              .get('/traffic')
              .replyWithError("Failed for some reason");
          });
          afterEach(()=>{
            nock.cleanAll();
          });

          it("should call the passed callback with the retrieved  error as a first argument",(done)=>{
            start.execute(config, (error)=>{
              assert.isTrue(apiaryNock.isDone());
              assert.instanceOf(error, Error);
              assert.propertyVal(error, 'statusCode', 6)
              done()
            });
          });
        });

        describe("if everything goes as expected and Apiary Mock loads",()=>{
          let apiaryNock, callback;
          beforeEach((done)=>{
            // Not mocking the request behav on the js level, using integration approach insead
            fs.readFile('./test/fixtures/mock-html/allgood.html', 'utf8', (error, body)=>{
              if(error){done(error)}

              apiaryNock = nock("http://docs.mockcislot1.apiary.io")
                .get('/traffic')
                .reply(200, body, {
                  'Set-Cookie': 'connect.sid=s%3A_jFthqZARD0on1JAxo1aoE8HOdjDgrMh.sgpGtz9HpRfKdfKGYmgkzTdC2fHR%2Bdzv8dzbcQqY8Uk; Domain=.apiary.io; Path=/; Expires=Thu, 05 Oct 2017 16:25:42 GMT; HttpOnly'
                });
              fsMock({});
              callback = sinon.spy(()=>{done()});
              start.execute(config, callback);
            });
          });

          afterEach(()=>{
            nock.cleanAll();
            fsMock.restore();
          });


          describe("the session file", ()=>{
            let fileCallback;
            beforeEach((done)=>{
              fileCallback = sinon.spy(()=>{done()});
              fs.readFile('.apiary-mock-mockcislot1', fileCallback);
            });

            it("should be created",()=>{
              assert.isNull(fileCallback.firstCall.args[0]);
            });

            describe("it's content",()=>{
              let sessionFile;
              before(()=>{
                sessionFile = fileCallback.firstCall.args[1].toString();
              });

              it ("should contain the `session.sid` cookie retrived from the Apiary Mock page",()=>{
                assert.include(sessionFile, 's%3A_jFthqZARD0on1JAxo1aoE8HOdjDgrMh');
              });

              it("should contain the url of the mock extracted from the Apiary Mock URL",()=>{
                assert.include(sessionFile, 'http')
              })

            })
          })

          describe("the callback arguments",()=>{
            it("should pass 'undefined' to the first one",()=>{
              assert.isUndefined(callback.firstCall.args[0]);
            });

            it("should pass 'object' to the second one",()=>{
              assert.isObject(callback.firstCall.args[1]);
            });

            describe("the passed object as a second one", ()=>{
              it("should have 'url' property in format of url",()=>{
                assert.property(callback.firstCall.args[1], 'url');
              });
            })
          });
        });
      })
    });
  });
});

