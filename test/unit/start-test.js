const {assert} = require('chai');
const sinon = require('sinon');
const nock = require('nock');

const start = require('../../src/start')

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

      describe("when I call .execute(callback)", ()=>{
        describe("if the session file '.apiary-mock-sessoin' already exits", ()=>{
          before( (done)=>{
            //stub fs.stat
            //fs.
            done()
          });

          after( ()=>{
            //release fs stub
          });

          it("should call the passed callback with an error as a first argument");

          describe("the error", ()=>{
            it("should contain message with 'session'");
            it("should have the 'statusCode' property")
          });
        });

        describe("if first argument config object doesn't have domain option", () => {
          it("should call the passed callback with an error as a first argument");

          describe("the error message", ()=>{
            it("should contain 'domain'");
          });
        });

        it("should call Apiary Mock URL for the domain");

        describe("if the Apiary Mock fails for some reason", ()=>{
           it("should call the passed callback with the retrieved  error as a first argument");
        });

        describe("if everything goes as expected and Apiary Mock loads",()=>{
          it("should create the '.apiary-mock-session' file");

          describe("the session file", ()=>{
            it("should contain the Cookies retrived from the Apiary Mock page");
            it("should contain the url of the mock extracted from the Apiary Mock URL")
          })

          it("should call the callback function");

          describe("the callback arguments",()=>{
            it("should pass 'null' to the first one");
            it("should pass 'object' to the second one");

            describe("the passed object", ()=>{
              it("should have 'url' property");

              describe("the 'url' property", ()=>{
                it("is a valid URL")
              });

              it("should have 'cookie' property");
            })
          });
        });
      })
    });
  });
});
