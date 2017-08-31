const {assert} = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const proxyquire = require('proxyquire');
const mockFs = require('mock-fs');
const fs = require('fs');

const session = require('../../../src/helpers/session');

describe("session", ()=>{
  it("exports an object", ()=>{
    assert.isObject(session);
  });

  describe("the object", ()=>{
    it("has 'save' property",()=>{
      assert.property(session, 'save');
    })

    describe("the save property", ()=>{
      let config = {
        domain: "mockcislot1",
        url: "http://mockcislot1.mock.tld",
        session: "abcdef1235"
      };

      it("is a function",()=>{
        assert.isFunction(session.save);
      });

      describe("when the config doesn't contain the domain property", ()=>{
        it("shuold callback the error with a message containing 'domain'", (done) => {
          let messedUpConfig = {};
          session.save(messedUpConfig, (error,result)=>{
            assert.instanceOf(error, Error);
            assert.include(error.message, 'domain');
            done();
          });
        });
      });

      describe("when I call it and the sesssion file './apiary-mock-mockcislot1' already exists", ()=>{
        before(()=>{
          mockFs({
            ".apiary-mock-mockcislot1":
              `
              session: abcdefg1234556
              url: http://mock.tld
              domain: apiary-mock-mockcislot1
              `
          });
        });

        after(()=>{
          mockFs.restore();
        });

        it("first argument of the called callback is an instance of error" +
        " with message containing <F2>'already exists'", (done)=>{
          session.save(config, (error, result)=>{
            console.log('session save callback')
            assert.instanceOf(error, Error);
            assert.include(error.message, 'already exists');
            done();
          });
        });
      });

      describe("when I call it and the session file doesn't exist",()=>{
        let first, second;

        before((done)=>{
          mockFs();

          session.save(config, (error, result)=>{
            first = error;
            second = result;
            done();
          })
        });

        after(()=>{
          mockFs.restore();
        })

        describe("first argument of the called callback",()=>{
          it("is undefined",()=>{
            assert.isUndefined(first);
          });
        });

        describe("second argument",()=>{
          it("is true",()=>{
            assert.isTrue(second);
          });

          it("the file .apiary-mock-mockcislot1 was created", (done)=>{
            fs.access(
              './.apiary-mock-mockcislot1',
              fs.constants.R_OK | fs.constants.W_OK,
              (error) => {
                assert.isNull(error);
                done()
              }
            );
          });
        });
      })
    })

    it("has 'load' property",() =>{
      assert.property(session, 'load')
    });

    describe("the 'load' property", ()=>{

      it("is a function", ()=>{
        assert.isFunction(session.load);
      });

      describe("when I call .load(config, callback)", ()=>{
        describe("when the first argument isn't object", ()=> {
          it("should call the callback with first argument of type" +
          "Error with message containing 'object'", (done)=>{
            let config = undefined;
            session.load(config, (first, second)=>{
              assert.instanceOf(first, Error);
              assert.include(first.message, "object");
              done()
            });
          });
        });

        describe("when the first argument doesn't have the 'domain' property",()=>{
          it("should call the callback with first argument" +
          "instance Error with message containing 'domain'", (done)=>{
            let config = {};
            session.load(config, (first, second)=>{
              assert.instanceOf(first, Error);
              assert.include(first.message, "domain");
              done()
            });
          })
        });

        describe("when the session file '.apiary-mock-<domain>' doesn't exist", ()=>{
          before(()=>{
            mockFs();
          });

          after(()=>{
            mockFs.restore();
          });

          it("should call the passed callback with the Error as a first argument" +
          "with a message containing 'desn't exist'", (done)=>{
            let config = {
              "domain": "mockcislot1"
            };

            session.load(config, (first, second)=>{
              assert.instanceOf(first, Error);
              assert.include(first.message, "no such");
              done()
            });
          });
        });

        describe("when the session file '.apiary-mock-<domain>' exists", ()=>{
          let config = {
            "domain": "mockcislot1"
          };

          describe("when it's content isn't a parseable YAML", ()=>{
            before(()=>{
              mockFs({
                "./.apiary-mock-mockcislot1":
                  `
                  foo: true: false
                  `
              });
            });

            after(()=>{
              mockFs.restore();
            });

            it("shouold call the callback with the first argument - the instance " +
            "of Error with message containing 'YAML'", (done) => {
              session.load(config, (first, second)=>{
                assert.instanceOf(first, Error);
                assert.include(first.message, "YAML");
                assert.include(first.message, ".apiary-mock-mockcislot1");
                done();
              });
            })
          });

          describe("when it's a parseable YAML obejct",()=>{
            let first, second;

            before((done)=>{
              mockFs({
                "./.apiary-mock-mockcislot1":
                  `
                  domain: mockcislot1
                  url: http://mock.domain.tld/
                  session: abc123
                  `
              });

              session.load(config, (err, session)=>{
                first = err;
                second = session;
                done();
              });

            });

            after(()=>{
              mockFs.restore();
            });

            describe("callback first argument",()=>{
              it("should be undefined",()=>{
                assert.isUndefined(first);
              });
            });

            describe("callback second argument",()=>{
              it("should be an object",()=>{
                assert.isObject(second)
              });
              it("should have the parsed YAML from the file in it",()=>{
                assert.property(second,"session")
              })
            });
          });
        });
      });
    });
  });
});

